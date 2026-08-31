// ---------------------------------------------------------------------------
// AI-SOC Frontend — Shared Type Definitions & ActionSpec Contract
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
  | "triaged"
  | "triaging"
  | "investigating"
  | "contained"
  | "eradicated"
  | "recovering"
  | "resolved"
  | "closed"
  | "false_positive";

export type AutonomyTier =
  | "tier_0_observe"
  | "tier_1_administrative"
  | "tier_2_bounded_containment"
  | "tier_3_disruptive"
  | "tier_4_destructive";

export type PolicyDecisionType = "DENY" | "REQUIRE_APPROVAL" | "ALLOW";

export type ActionExecutionStatus =
  | "pending"
  | "approved"
  | "denied"
  | "executing"
  | "success"
  | "failed"
  | "rolled_back";

// ---------------------------------------------------------------------------
// ActionSpec Contract
// Strict contract between AI Agent -> Policy Engine -> Action Broker
// ---------------------------------------------------------------------------

export interface ActionProposal {
  id: string;
  tenant_id: string;
  incident_id: string;
  action_type: string;          // e.g. "firewall_block", "isolate_endpoint", "create_ticket"
  target_type: string;          // e.g. "ip", "host", "user", "ticket"
  target_id: string;            // e.g. "185.220.101.47"
  evidence_refs: string[];      // References to EvidenceItem IDs
  rationale: string;            // Grounded explanation with citations
  risk_tier: AutonomyTier;      // Tier 0 - Tier 4
  expected_effect: string;      // Operational outcome
  blast_radius: string;         // Scope of disruption (e.g. "Single External IP")
  ttl_seconds: number;          // Containment time-to-live before auto-rollback (e.g. 3600)
  preconditions: string[];      // Required system checks before execution
  postconditions: string[];     // Verification criteria after execution
  rollback_action: string;      // Compensating action on expiry or failure
  requested_by_agent: string;   // Agent / Node identifier (e.g. "response_agent_v1")
  model_version: string;        // e.g. "claude-3-5-sonnet" or "gpt-4o"
  prompt_version: string;       // e.g. "prompt_response_v2.4"
}

export interface PolicyDecision {
  decision: PolicyDecisionType;
  policy_version: string;
  reason_codes: string[];
  required_approvers: string[];
  decided_at: string;
}

export interface ExecutionResult {
  executor_id: string;
  idempotency_key: string;
  started_at?: string;
  completed_at?: string;
  status: ActionExecutionStatus;
  verification_evidence?: string[];
  rollback_status?: string;
}

export interface EvidenceItem {
  id: string;
  source: string;
  source_type: "wazuh" | "splunk" | "threat_intel" | "edr" | "network";
  timestamp: string;
  confidence: number;
  provenance: string;
  summary: string;
  raw_payload?: Record<string, any>;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;               // e.g. "WazuhCollector", "TriageAgent", "PolicyEngine", "Operator:sec_analyst"
  event_type:
    | "ingested"
    | "normalized"
    | "enriched"
    | "agent_proposal"
    | "policy_evaluated"
    | "analyst_approved"
    | "analyst_denied"
    | "executed"
    | "verified"
    | "rolled_back";
  details: string;
  signature_hash: string;      // Tamper-evident cryptographic hash
}

export interface Incident {
  id: string;
  tenant_id: string;
  timestamp: string;           // ISO 8601 UTC string
  source: string;
  event_type: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  description?: string;
  affected_host?: string;
  attck_technique?: {
    id: string;                // e.g. "T1110.001"
    name: string;              // e.g. "Password Guessing"
    tactic: string;            // e.g. "Credential Access"
    confidence: number;        // e.g. 0.94
  };
  agent_summary?: string;
  agent_recommendation?: string;
  evidence_bundle?: EvidenceItem[];
  proposed_action?: ActionProposal;
  policy_decision?: PolicyDecision;
  execution_result?: ExecutionResult;
  audit_trail?: AuditEvent[];
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
  icon: React.ReactNode;
}
