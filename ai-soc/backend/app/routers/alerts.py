"""
Alerts Router — GET /api/alerts
================================
Returns the alert queue of normalized security incidents from the DB.

Security hardening applied:
  - POST /api/alerts/analyze now requires a valid JWT Bearer token
    (previously this endpoint was completely unauthenticated)
  - Rate limited to 10 analyze requests/minute per IP
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from slowapi import Limiter
from slowapi.util import get_remote_address

from pydantic import BaseModel
from app.models import AlertsResponse, Incident as PydanticIncident, IncidentStatus, SeverityLevel
from app.auth_utils import decode_access_token
from app.agents.graph import soc_graph
from app.database import get_db
from app.db_models import Incident as DBIncident

router = APIRouter(tags=["Alerts"])
security = HTTPBearer()
limiter = Limiter(key_func=get_remote_address)

# ---------------------------------------------------------------------------
# Shared JWT auth dependency
# ---------------------------------------------------------------------------

def _require_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Validate Bearer JWT, return payload. Raises 401 if invalid."""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


# ---------------------------------------------------------------------------
# GET /alerts — fetch all incidents
# ---------------------------------------------------------------------------

@router.get("/alerts", response_model=AlertsResponse, summary="Fetch alert queue")
async def get_alerts(
    _payload: dict = Depends(_require_token),
    db: AsyncSession = Depends(get_db),
) -> AlertsResponse:
    result = await db.execute(select(DBIncident))
    db_alerts = result.scalars().all()

    severity_order = {
        SeverityLevel.CRITICAL: 0,
        SeverityLevel.HIGH: 1,
        SeverityLevel.MEDIUM: 2,
        SeverityLevel.LOW: 3,
        SeverityLevel.INFORMATIONAL: 4,
    }

    alerts = [
        PydanticIncident(
            id=db_alert.id,
            timestamp=db_alert.timestamp,
            source=db_alert.source,
            event_type=db_alert.event_type,
            severity=db_alert.severity,
            status=db_alert.status,
            description=db_alert.description,
            affected_host=db_alert.affected_host,
        )
        for db_alert in db_alerts
    ]
    sorted_alerts = sorted(alerts, key=lambda a: severity_order[a.severity])
    return AlertsResponse(total=len(sorted_alerts), alerts=sorted_alerts)


# ---------------------------------------------------------------------------
# POST /alerts/analyze — submit raw log for autonomous agent analysis
# Now requires authentication (was previously unauthenticated)
# ---------------------------------------------------------------------------

class AnalyzePayload(BaseModel):
    raw_log: str


@router.post(
    "/alerts/analyze",
    summary="Analyze a raw log using the SOC multi-agent graph",
    dependencies=[Depends(_require_token)],  # ← JWT required
)
@limiter.limit("10/minute")
async def analyze_alert(
    request: Request,
    payload: AnalyzePayload,
    db: AsyncSession = Depends(get_db),
):
    """
    Submit a raw log string for autonomous multi-agent analysis.

    Requires authentication. Rate limited to 10 requests/minute per IP
    to prevent abuse of the expensive LLM inference pipeline.
    """
    initial_state = {"raw_log": payload.raw_log}
    try:
        final_state = soc_graph.invoke(initial_state)

        try:
            severity = SeverityLevel(final_state.get("severity", "high").lower())
        except ValueError:
            severity = SeverityLevel.HIGH

        description = (
            f"Context: {final_state.get('enrichment_context', 'N/A')} | "
            f"Action: {final_state.get('proposed_action', 'N/A')}"
        )

        new_incident = DBIncident(
            id=str(uuid.uuid4()),
            timestamp=datetime.now(timezone.utc),
            source="LangGraph Autonomous Agent",
            event_type="Automated Analysis",
            severity=severity,
            status=IncidentStatus.NEW,
            description=description,
            affected_host=final_state.get("extracted_ip", "unknown"),
        )
        db.add(new_incident)
        await db.commit()

        return final_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
