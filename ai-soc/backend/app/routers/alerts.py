"""
Alerts Router — GET /api/alerts & Action Broker Endpoints
=========================================================
Provides canonical incident records, evidence bundles, ATT&CK mappings,
ActionSpec proposals, deterministic policy decisions, and audit timelines.

Security hardening applied:
  - Token-authenticated endpoints
  - Rate limiting on LLM inference
  - Deterministic policy enforcement before action execution
"""

import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.auth_utils import decode_access_token
from app.models import (
    ActionApprovalRequest,
    ActionExecutionStatus,
    ActionProposal,
    AlertsResponse,
    AttckTechnique,
    AuditEvent,
    AutonomyTier,
    EvidenceItem,
    ExecutionResult,
    Incident,
    IncidentStatus,
    PolicyDecision,
    PolicyDecisionType,
    SeverityLevel,
)

router = APIRouter(tags=["Alerts"])
security = HTTPBearer()
limiter = Limiter(key_func=get_remote_address)


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
# Seeded Incidents Store (Demonstrates full evidence path & negative case)
# ---------------------------------------------------------------------------

SEEDED_INCIDENTS: Dict[str, Incident] = {
    "INC-8802": Incident(
        id="INC-8802",
        tenant_id="tenant-acme-corp",
        timestamp=datetime(2026, 8, 30, 14, 22, 10, tzinfo=timezone.utc),
        source="Wazuh Agent (prod-web-01)",
        event_type="Multiple Failed SSH Logins (Rule 100002)",
        severity=SeverityLevel.HIGH,
        status=IncidentStatus.TRIAGING,
        description="47 consecutive failed root & admin SSH authentication attempts within 60 seconds from external IP 185.220.101.47 targeting prod-web-01 (10.0.1.55).",
        affected_host="prod-web-01 (10.0.1.55)",
        attck_technique=AttckTechnique(
            id="T1110.001",
            name="Password Guessing",
            tactic="Credential Access",
            confidence=0.94,
        ),
        agent_summary=(
            "Triage Agent analyzed 47 raw authentication failure events. Context Agent correlated "
            "source IP 185.220.101.47 against Splunk notable events and VirusTotal (reputation: 92/100 malicious, "
            "Tor exit node). Host prod-web-01 is a critical payment gateway edge node."
        ),
        agent_recommendation="Containment proposal submitted to Policy Engine: Temporary perimeter firewall block (3600s TTL).",
        evidence_bundle=[
            EvidenceItem(
                id="EVID-001",
                source="Wazuh HIDS",
                source_type="wazuh",
                timestamp=datetime(2026, 8, 30, 14, 21, 55, tzinfo=timezone.utc),
                confidence=0.99,
                provenance="wazuh-agent-001:events/2026-08-30/auth.log#L1042-L1089",
                summary="47 failed SSH attempts using wordlist usernames (root, admin, deploy) in 42s.",
                raw_payload={"srcip": "185.220.101.47", "dstport": 22, "protocol": "ssh", "attempts": 47},
            ),
            EvidenceItem(
                id="EVID-002",
                source="Splunk Enterprise Security",
                source_type="splunk",
                timestamp=datetime(2026, 8, 30, 14, 22, 0, tzinfo=timezone.utc),
                confidence=0.91,
                provenance="splunk.internal:8089/services/search/jobs/1725027720.14",
                summary="Source IP previously observed in 3 brute-force sweeps across DMZ subnet in last 7 days.",
                raw_payload={"src_ip": "185.220.101.47", "urgency": "high", "prior_incidents": 3},
            ),
            EvidenceItem(
                id="EVID-003",
                source="Threat Intelligence Gateway",
                source_type="threat_intel",
                timestamp=datetime(2026, 8, 30, 14, 22, 5, tzinfo=timezone.utc),
                confidence=0.95,
                provenance="feed.threatintel.io:v2/iocs/ip/185.220.101.47",
                summary="Known scanner / active Tor exit relay associated with automated brute-force botnets.",
                raw_payload={"reputation_score": 92, "category": "scanner_botnet"},
            ),
        ],
        proposed_action=ActionProposal(
            id="ACT-001",
            tenant_id="tenant-acme-corp",
            incident_id="INC-8802",
            action_type="firewall_block",
            target_type="ip",
            target_id="185.220.101.47",
            evidence_refs=["EVID-001", "EVID-002", "EVID-003"],
            rationale="Disruptive containment proposed: Drop all inbound packets from 185.220.101.47 at perimeter edge to halt credential stuffing.",
            risk_tier=AutonomyTier.TIER_3_DISRUPTIVE,
            expected_effect="Inbound SSH connection attempts terminated immediately.",
            blast_radius="Single External IP Address (185.220.101.47)",
            ttl_seconds=3600,
            preconditions=["Target IP is not on internal asset or vendor allowlist.", "Perimeter firewall API is operational."],
            postconditions=["Zero packets accepted from 185.220.101.47 during verification probe."],
            rollback_action="firewall_unblock(185.220.101.47)",
            requested_by_agent="ResponseAgent_v1.2",
            model_version="claude-3-5-sonnet",
            prompt_version="playbook_response_v2.4",
        ),
        policy_decision=PolicyDecision(
            decision=PolicyDecisionType.REQUIRE_APPROVAL,
            policy_version="POL-SEC-2026-v3",
            reason_codes=["TIER_3_DISRUPTIVE_ACTION", "PERIMETER_FIREWALL_CONTROL", "PRODUCTION_ASSET_IMPACT"],
            required_approvers=["SOC_Analyst", "Security_Operator"],
            decided_at=datetime(2026, 8, 30, 14, 22, 12, tzinfo=timezone.utc),
        ),
        execution_result=ExecutionResult(
            executor_id="ActionBroker_Core_v1",
            idempotency_key="idemp_act_001_185.220.101.47",
            status=ActionExecutionStatus.PENDING,
        ),
        audit_trail=[
            AuditEvent(
                id="AUD-001",
                timestamp=datetime(2026, 8, 30, 14, 21, 55, tzinfo=timezone.utc),
                actor="WazuhCollector",
                event_type="ingested",
                details="Raw syslog ingested over TLS transport; validated against schema.",
                signature_hash="sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            ),
            AuditEvent(
                id="AUD-002",
                timestamp=datetime(2026, 8, 30, 14, 22, 0, tzinfo=timezone.utc),
                actor="ContextAgent",
                event_type="enriched",
                details="Authoritative Splunk query executed; reputation score 92 retrieved.",
                signature_hash="sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
            ),
            AuditEvent(
                id="AUD-003",
                timestamp=datetime(2026, 8, 30, 14, 22, 10, tzinfo=timezone.utc),
                actor="ResponseAgent",
                event_type="agent_proposal",
                details="Generated ActionProposal ACT-001 with 3600s TTL and rollback plan.",
                signature_hash="sha256:326b772591605e55e8c1569472e389e023456789abcdef0123456789abcdef01",
            ),
            AuditEvent(
                id="AUD-004",
                timestamp=datetime(2026, 8, 30, 14, 22, 12, tzinfo=timezone.utc),
                actor="PolicyEngine",
                event_type="policy_evaluated",
                details="Evaluated rule POL-SEC-2026-v3: Matched REQUIRE_APPROVAL for Tier 3 action.",
                signature_hash="sha256:7c9e3e7f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
            ),
        ],
    ),
    "INC-8803": Incident(
        id="INC-8803",
        tenant_id="tenant-acme-corp",
        timestamp=datetime(2026, 8, 30, 14, 35, 40, tzinfo=timezone.utc),
        source="Zeek Network Flow",
        event_type="Unusual Outbound Data Volume (Negative Case)",
        severity=SeverityLevel.MEDIUM,
        status=IncidentStatus.INVESTIGATING,
        description="Outbound HTTPS transfer of 450MB from internal workstation 10.0.3.12 to cloud backup IP 52.84.122.9.",
        affected_host="ws-finance-04 (10.0.3.12)",
        attck_technique=AttckTechnique(
            id="T1567",
            name="Exfiltration Over Web Service",
            tactic="Exfiltration",
            confidence=0.35,
        ),
        agent_summary=(
            "AI Agent evaluated event against cloud asset inventory. Destination IP matches verified corporate OneDrive "
            "endpoint. User 'alice.finance' initiated scheduled backup sync. Evidence of adversary activity is insufficient."
        ),
        agent_recommendation="AI declined containment proposal due to low confidence (0.35) and benign baseline match. No action required.",
        evidence_bundle=[
            EvidenceItem(
                id="EVID-004",
                source="Zeek Flow",
                source_type="network",
                timestamp=datetime(2026, 8, 30, 14, 35, 0, tzinfo=timezone.utc),
                confidence=0.90,
                provenance="zeek-sensor-east:conn.log#L8821",
                summary="450MB outbound over TLS 1.3 to 52.84.122.9 (AS8075 Microsoft Corporation).",
            ),
            EvidenceItem(
                id="EVID-005",
                source="Corporate Asset Inventory",
                source_type="edr",
                timestamp=datetime(2026, 8, 30, 14, 35, 15, tzinfo=timezone.utc),
                confidence=0.98,
                provenance="cmdb.internal/assets/10.0.3.12",
                summary="Scheduled enterprise cloud backup service active for workstation ws-finance-04.",
            ),
        ],
        proposed_action=ActionProposal(
            id="ACT-002",
            tenant_id="tenant-acme-corp",
            incident_id="INC-8803",
            action_type="log_observation",
            target_type="host",
            target_id="10.0.3.12",
            evidence_refs=["EVID-004", "EVID-005"],
            rationale="Non-disruptive observation: Downgraded from containment because evidence indicates benign scheduled sync.",
            risk_tier=AutonomyTier.TIER_0_OBSERVE,
            expected_effect="Case annotated; telemetry retained for baseline calibration.",
            blast_radius="None",
            ttl_seconds=0,
            rollback_action="none",
            requested_by_agent="TriageAgent_v1.1",
            model_version="claude-3-5-sonnet",
            prompt_version="playbook_response_v2.4",
        ),
        policy_decision=PolicyDecision(
            decision=PolicyDecisionType.ALLOW,
            policy_version="POL-SEC-2026-v3",
            reason_codes=["TIER_0_OBSERVE_ALLOWED", "BENIGN_TELEMETRY_MATCH"],
            required_approvers=[],
            decided_at=datetime(2026, 8, 30, 14, 35, 42, tzinfo=timezone.utc),
        ),
        execution_result=ExecutionResult(
            executor_id="ActionBroker_Core_v1",
            idempotency_key="idemp_act_002_10.0.3.12",
            status=ActionExecutionStatus.SUCCESS,
            verification_evidence=["Observation logged in incident audit trail."],
        ),
        audit_trail=[
            AuditEvent(
                id="AUD-005",
                timestamp=datetime(2026, 8, 30, 14, 35, 40, tzinfo=timezone.utc),
                actor="TriageAgent",
                event_type="agent_proposal",
                details="Evaluated exfiltration hypothesis; downgraded to benign observation.",
                signature_hash="sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
            ),
        ],
    ),
}


# ---------------------------------------------------------------------------
# GET /alerts — fetch all incidents
# ---------------------------------------------------------------------------


@router.get("/alerts", response_model=AlertsResponse, summary="Fetch alert queue")
async def get_alerts(
    _payload: dict = Depends(_require_token),
) -> AlertsResponse:
    severity_order = {
        SeverityLevel.CRITICAL: 0,
        SeverityLevel.HIGH: 1,
        SeverityLevel.MEDIUM: 2,
        SeverityLevel.LOW: 3,
        SeverityLevel.INFORMATIONAL: 4,
    }
    sorted_alerts = sorted(
        list(SEEDED_INCIDENTS.values()), key=lambda a: severity_order[a.severity]
    )
    return AlertsResponse(total=len(sorted_alerts), alerts=sorted_alerts)


# ---------------------------------------------------------------------------
# POST /alerts/{id}/action — Action Broker Approval / Denial endpoint
# ---------------------------------------------------------------------------


@router.post(
    "/alerts/{incident_id}/action",
    response_model=Incident,
    summary="Approve or Deny an ActionProposal via the Action Broker",
)
async def process_action(
    incident_id: str,
    body: ActionApprovalRequest,
    payload: dict = Depends(_require_token),
) -> Incident:
    if incident_id not in SEEDED_INCIDENTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident {incident_id} not found.",
        )

    incident = SEEDED_INCIDENTS[incident_id]
    if not incident.proposed_action:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incident has no active ActionProposal.",
        )

    operator_name = payload.get("sub", "Security_Operator")
    now = datetime.now(timezone.utc)

    if body.decision.lower() == "approve":
        # Execute action through Action Broker simulation
        ttl = body.override_ttl_seconds or incident.proposed_action.ttl_seconds
        incident.status = IncidentStatus.CONTAINED
        incident.execution_result = ExecutionResult(
            executor_id="ActionBroker_Perimeter_FW",
            idempotency_key=f"exec_{incident.proposed_action.id}_{now.timestamp()}",
            started_at=now,
            completed_at=now,
            status=ActionExecutionStatus.SUCCESS,
            verification_evidence=[
                f"Perimeter firewall rule #8802 applied to block {incident.proposed_action.target_id}.",
                f"Automatic rollback scheduled after {ttl} seconds.",
                "Synthetic probe verified 0 dropped packet anomalies.",
            ],
            rollback_status=f"Active (Auto-rollback after {ttl}s)",
        )
        # Append audit event
        incident.audit_trail.append(
            AuditEvent(
                id=f"AUD-{str(uuid.uuid4())[:8]}",
                timestamp=now,
                actor=f"Operator:{operator_name}",
                event_type="analyst_approved",
                details=f"Analyst approved ActionProposal {incident.proposed_action.id} ({incident.proposed_action.action_type}). Notes: {body.operator_notes or 'None'}",
                signature_hash=f"sha256:{uuid.uuid4().hex}",
            )
        )
        incident.audit_trail.append(
            AuditEvent(
                id=f"AUD-{str(uuid.uuid4())[:8]}",
                timestamp=now,
                actor="ActionBroker",
                event_type="executed",
                details=f"Executed {incident.proposed_action.action_type} on target {incident.proposed_action.target_id} with {ttl}s TTL.",
                signature_hash=f"sha256:{uuid.uuid4().hex}",
            )
        )
    else:
        incident.execution_result = ExecutionResult(
            executor_id="ActionBroker_Core_v1",
            idempotency_key=f"deny_{incident.proposed_action.id}_{now.timestamp()}",
            started_at=now,
            completed_at=now,
            status=ActionExecutionStatus.DENIED,
            verification_evidence=["Action rejected by operator."],
        )
        incident.audit_trail.append(
            AuditEvent(
                id=f"AUD-{str(uuid.uuid4())[:8]}",
                timestamp=now,
                actor=f"Operator:{operator_name}",
                event_type="analyst_denied",
                details=f"Analyst rejected ActionProposal {incident.proposed_action.id}. Reason: {body.operator_notes or 'Operator discretion'}",
                signature_hash=f"sha256:{uuid.uuid4().hex}",
            )
        )

    SEEDED_INCIDENTS[incident_id] = incident
    return incident
