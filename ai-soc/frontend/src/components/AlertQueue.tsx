"use client";

// ---------------------------------------------------------------------------
// Inbound Alert Queue (Client Component)
// Canonical incidents with policy gates, evidence bundles, and sandbox simulation
// ---------------------------------------------------------------------------

import { useEffect, useState, useCallback } from "react";
import { fetchAlerts } from "@/lib/api";
import { AlertCard } from "./AlertCard";
import { TriageLoader } from "./TriageLoader";
import type { AlertsResponse, Incident } from "@/types";

// ---------------------------------------------------------------------------
// Mock alert factory with full ActionSpec contract
// ---------------------------------------------------------------------------

function buildMockAlert(): Incident {
  const id = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();
  return {
    id,
    tenant_id: "tenant-acme-corp",
    timestamp: now,
    source: "Wazuh Agent (prod-bastion-01)",
    event_type: "SSH Credential Stuffing Anomaly",
    severity: "critical",
    status: "new",
    description: "52 consecutive failed SSH logins for 'root' and 'deploy' from 194.26.29.112 within 45 seconds.",
    affected_host: "prod-bastion-01 (10.0.1.10)",
    attck_technique: {
      id: "T1110.001",
      name: "Password Guessing",
      tactic: "Credential Access",
      confidence: 0.96,
    },
    agent_summary: "Triage Agent verified failed authentication velocity exceeding baseline threshold (52/min). Splunk lookup matched known adversary botnet.",
    agent_recommendation: "ActionProposal submitted: Perimeter firewall IP block with 1-hour containment TTL.",
    evidence_bundle: [
      {
        id: `EVID-${Date.now()}-1`,
        source: "Wazuh HIDS",
        source_type: "wazuh",
        timestamp: now,
        confidence: 0.99,
        provenance: "wazuh-agent-bastion:auth.log",
        summary: "52 failed authentication attempts targeting port 22.",
      },
      {
        id: `EVID-${Date.now()}-2`,
        source: "Splunk ES",
        source_type: "splunk",
        timestamp: now,
        confidence: 0.92,
        provenance: "splunk.internal:8089/notable",
        summary: "Source IP 194.26.29.112 listed on global botnet blocklist.",
      },
    ],
    proposed_action: {
      id: `ACT-${Date.now()}`,
      tenant_id: "tenant-acme-corp",
      incident_id: id,
      action_type: "firewall_block",
      target_type: "ip",
      target_id: "194.26.29.112",
      evidence_refs: [`EVID-${Date.now()}-1`, `EVID-${Date.now()}-2`],
      rationale: "Perimeter block proposed to halt active brute-force credential exhaustion.",
      risk_tier: "tier_3_disruptive",
      expected_effect: "Inbound SSH connection attempts dropped at perimeter.",
      blast_radius: "Single External IP (194.26.29.112)",
      ttl_seconds: 3600,
      preconditions: ["Target IP is not in internal allowlist."],
      postconditions: ["0 packets accepted from 194.26.29.112."],
      rollback_action: "firewall_unblock(194.26.29.112)",
      requested_by_agent: "ResponseAgent_v1.2",
      model_version: "claude-3-5-sonnet",
      prompt_version: "playbook_response_v2.4",
    },
    policy_decision: {
      decision: "REQUIRE_APPROVAL",
      policy_version: "POL-SEC-2026-v3",
      reason_codes: ["TIER_3_DISRUPTIVE_ACTION", "PERIMETER_FIREWALL_CONTROL"],
      required_approvers: ["SOC_Analyst", "Security_Operator"],
      decided_at: now,
    },
    execution_result: {
      executor_id: "ActionBroker_Core_v1",
      idempotency_key: `idemp_${Date.now()}`,
      status: "pending",
    },
    audit_trail: [
      {
        id: `AUD-${Date.now()}-1`,
        timestamp: now,
        actor: "WazuhCollector",
        event_type: "ingested",
        details: "Ingested via secure TLS transport.",
        signature_hash: `sha256:${Math.random().toString(36).substring(2)}`,
      },
      {
        id: `AUD-${Date.now()}-2`,
        timestamp: now,
        actor: "PolicyEngine",
        event_type: "policy_evaluated",
        details: "Matched rule POL-SEC-2026-v3: Approval required before execution.",
        signature_hash: `sha256:${Math.random().toString(36).substring(2)}`,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// AlertQueue
// ---------------------------------------------------------------------------

export function AlertQueue() {
  const [data, setData] = useState<AlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockAlerts, setMockAlerts] = useState<Incident[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "requires_approval" | "contained" | "investigating">("all");

  // ── API polling ──────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    async function loadAlerts() {
      const fetchedData = await fetchAlerts();
      if (isMounted) {
        setData(fetchedData);
        setLoading(false);
      }
    }

    loadAlerts();
    const interval = setInterval(loadAlerts, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ── Inject mock alert ─────────────────────────────────────────────────────
  const injectMockAlert = useCallback(() => {
    setMockAlerts((prev) => [buildMockAlert(), ...prev]);
  }, []);

  // ── Dismiss handler ───────────────────────────────────────────────────────
  const dismissAlert = useCallback((id: string) => {
    setMockAlerts((prev) => prev.filter((a) => a.id !== id));
    setDismissed((prev) => new Set(prev).add(id));
  }, []);

  // ── Update incident in state when action processed ────────────────────────
  const handleActionProcessed = useCallback((updated: Incident) => {
    setMockAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setData((prev) =>
      prev
        ? {
            ...prev,
            alerts: prev.alerts.map((a) => (a.id === updated.id ? updated : a)),
          }
        : null
    );
  }, []);

  // ── Merge mock + API lists for rendering ──────────────────────────────────
  const apiAlerts: Incident[] = (data?.alerts ?? []).filter((a) => !dismissed.has(a.id));
  const allAlerts: Incident[] = [...mockAlerts, ...apiAlerts];

  // ── Apply Filter ──────────────────────────────────────────────────────────
  const filteredAlerts = allAlerts.filter((incident) => {
    if (filter === "requires_approval") {
      return incident.policy_decision?.decision === "REQUIRE_APPROVAL" && incident.execution_result?.status === "pending";
    }
    if (filter === "contained") {
      return incident.status === "contained" || incident.execution_result?.status === "success";
    }
    if (filter === "investigating") {
      return incident.status === "investigating" || incident.status === "new" || incident.status === "triaging";
    }
    return true;
  });

  const totalCount = allAlerts.length;

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Inbound Alert Queue & Action Broker"
          count={0}
          status="offline"
          onSimulate={injectMockAlert}
        />
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16"
          style={{ borderColor: "#1E4530" }}
        >
          <p className="font-mono text-sm animate-pulse" style={{ color: "#3D5C46" }}>
            INITIALIZING CANONICAL INCIDENT QUEUE...
          </p>
        </div>
      </section>
    );
  }

  // ── Error / backend unreachable state ─────────────────────────────────────
  if (!data) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Inbound Alert Queue & Action Broker"
          count={mockAlerts.length}
          status={mockAlerts.length > 0 ? "online" : "offline"}
          onSimulate={injectMockAlert}
        />

        {mockAlerts.length > 0 ? (
          <div className="flex flex-col gap-3">
            <TriageLoader />
            {mockAlerts.map((incident, index) => (
              <AlertCard
                key={incident.id}
                incident={incident}
                index={index}
                onDismiss={dismissAlert}
                onActionProcessed={handleActionProcessed}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16"
            style={{ borderColor: "#1E4530" }}
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(244,63,94,0.1)" }}
            >
              <svg className="h-5 w-5" style={{ color: "#f87171" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="font-mono text-sm" style={{ color: "#f87171" }}>
              BACKEND UNREACHABLE OR UNAUTHORIZED
            </p>
            <p className="mt-1 font-mono text-xs" style={{ color: "#3D5C46" }}>
              Ensure valid session token and server on :8000
            </p>
          </div>
        )}
      </section>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Inbound Alert Queue & Action Broker"
        count={totalCount}
        status="online"
        onSimulate={injectMockAlert}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: `All Incidents (${allAlerts.length})` },
          { id: "requires_approval", label: "Requires Approval Gate" },
          { id: "contained", label: "Contained / Executed" },
          { id: "investigating", label: "Under Investigation" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className="rounded border px-3 py-1 font-mono text-[10px] font-semibold transition-all duration-200"
            style={{
              backgroundColor: filter === f.id ? "rgba(212,175,55,0.12)" : "rgba(10,28,18,0.5)",
              borderColor: filter === f.id ? "rgba(212,175,55,0.35)" : "rgba(30,69,48,0.6)",
              color: filter === f.id ? "#D4AF37" : "#8A9E8E",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredAlerts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16"
          style={{ borderColor: "#1E4530" }}
        >
          <p className="font-mono text-sm" style={{ color: "#6DB872" }}>
            ✓ NO INCIDENTS MATCHING FILTER CRITERIA
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <TriageLoader />
          {filteredAlerts.map((incident, index) => (
            <AlertCard
              key={incident.id}
              incident={incident}
              index={index}
              onDismiss={dismissAlert}
              onActionProcessed={handleActionProcessed}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// --------------- Sub-components ----------------------------------------------

interface SectionHeaderProps {
  title: string;
  count: number;
  status: "online" | "offline";
  onSimulate: () => void;
}

function SectionHeader({ title, count, status, onSimulate }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left — title */}
      <div className="flex items-center gap-3">
        <div
          className="h-px w-4 shrink-0"
          style={{ background: "linear-gradient(to right, rgba(212,175,55,0.5), transparent)" }}
        />
        <h2
          className="font-mono text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#8A9E8E" }}
        >
          {title}
        </h2>
      </div>

      {/* Right — active badge + simulate button + status dot */}
      <div className="flex items-center gap-3">
        {status === "online" && count > 0 && (
          <span
            className="rounded px-2 py-0.5 font-mono text-[10px] font-bold"
            style={{
              color: "#f87171",
              backgroundColor: "rgba(244,63,94,0.10)",
              boxShadow: "0 0 0 1px rgba(244,63,94,0.25)",
            }}
          >
            {count} INCIDENTS
          </span>
        )}

        {/* ── Simulate Threat button ── */}
        <button
          id="simulate-threat-btn"
          onClick={onSimulate}
          className="flex items-center gap-1.5 rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            borderColor: "rgba(212,175,55,0.20)",
            backgroundColor: "rgba(212,175,55,0.04)",
            color: "rgba(212,175,55,0.7)",
          }}
          title="Inject synthetic brute-force incident into sandbox queue"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Simulate Incident
        </button>

        {/* Status dot */}
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: status === "online" ? "#D4AF37" : "#f43f5e" }}
        />
      </div>
    </div>
  );
}
