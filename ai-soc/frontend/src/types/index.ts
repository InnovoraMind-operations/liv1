// ---------------------------------------------------------------------------
// AI-SOC Frontend — Shared Type Definitions
// Mirrors the Pydantic models from the FastAPI backend.
// ---------------------------------------------------------------------------

import type React from "react";

export type SeverityLevel =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "informational";

export type IncidentStatus =
  | "new"
  | "triaging"
  | "investigating"
  | "contained"
  | "resolved"
  | "false_positive";

export interface Incident {
  id: string;
  timestamp: string; // ISO 8601 UTC string
  source: string;
  event_type: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  description?: string;
  affected_host?: string;
  /** AI agent remediation recommendation — populated on mock/injected alerts */
  agent_recommendation?: string;
}

export interface AlertsResponse {
  total: number;
  alerts: Incident[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  message: string;
}

// Module staging status for the Capabilities Matrix sidebar
export type ModuleStage =
  | "live"
  | "staging"
  | "development"
  | "planned";

export interface PlatformModule {
  name: string;
  description: string;
  stage: ModuleStage;
  icon: React.ReactNode; // Inline SVG / JSX icon element
}
