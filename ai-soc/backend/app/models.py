"""
Domain Models — Phase 1

Pydantic v2 schemas for the AI-SOC data layer.
These models are intentionally lightweight; future phases will extend them
with agent-enrichment fields (MITRE ATT&CK mappings, confidence scores, etc.).
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------


class SeverityLevel(str, Enum):
    """CVSS-aligned severity taxonomy."""

    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFORMATIONAL = "informational"


class IncidentStatus(str, Enum):
    """Incident lifecycle states (mirrors SOAR playbook stages)."""

    NEW = "new"
    TRIAGING = "triaging"
    INVESTIGATING = "investigating"
    CONTAINED = "contained"
    RESOLVED = "resolved"
    FALSE_POSITIVE = "false_positive"


# ---------------------------------------------------------------------------
# Core Schema
# ---------------------------------------------------------------------------


class Incident(BaseModel):
    """
    Represents a normalized security incident / alert surfaced by the SOC.

    Future extension points:
      - agent_id: str          → which orchestration agent raised/enriched this
      - mitre_technique: str   → ATT&CK TTP mapping
      - raw_log_ref: str       → pointer to raw log store
      - remediation_actions: list[str]
    """

    id: str = Field(..., description="Unique incident identifier (UUID or slug)")
    timestamp: datetime = Field(..., description="UTC time the alert was generated")
    source: str = Field(..., description="Originating sensor / data source")
    event_type: str = Field(..., description="Normalised event category")
    severity: SeverityLevel
    status: IncidentStatus
    description: Optional[str] = Field(None, description="Human-readable summary")
    affected_host: Optional[str] = Field(None, description="Target hostname or IP")


# ---------------------------------------------------------------------------
# Response Wrappers
# ---------------------------------------------------------------------------


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    message: str


class AlertsResponse(BaseModel):
    total: int
    alerts: list[Incident]
