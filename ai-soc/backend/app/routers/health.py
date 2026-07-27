"""
Health Router — GET /api/health

Returns a liveness probe payload consumed by the frontend status bar.
"""

from datetime import datetime, timezone

from fastapi import APIRouter

from app.models import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse, summary="Liveness probe")
async def get_health() -> HealthResponse:
    """
    Returns operational status and UTC timestamp.
    The Next.js dashboard polls this endpoint to display the
    backend connection indicator in the header status bar.
    """
    return HealthResponse(
        status="operational",
        timestamp=datetime.now(tz=timezone.utc),
        version="0.1.0",
        message="AI-SOC Core Engine is running nominally.",
    )
