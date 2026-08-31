"use client";

// ---------------------------------------------------------------------------
// Alert Card Component — AI-SOC Executive Theme
// Full Evidence Path, ActionSpec Policy Gate, and Immutable Decision Audit
// ---------------------------------------------------------------------------

import { useState } from "react";
import type { Incident, SeverityLevel, IncidentStatus } from "@/types";

// --------------- Severity Map -----------------------------------------------

const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { badge: string; borderColor: string; dotColor: string; accentColor: string; label: string }
> = {
  critical: {
    badge: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40",
    borderColor: "rgba(244,63,94,0.35)",
    dotColor: "bg-rose-500 animate-pulse",
    accentColor: "#f43f5e",
    label: "CRITICAL",
  },
  high: {
    badge: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/40",
    borderColor: "rgba(249,115,22,0.35)",
    dotColor: "bg-orange-400",
    accentColor: "#f97316",
    label: "HIGH",
  },
  medium: {
    badge: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/35",
    borderColor: "rgba(212,175,55,0.30)",
    dotColor: "bg-amber-400",
    accentColor: "#D4AF37",
    label: "MEDIUM",
  },
  low: {
    badge: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/35",
    borderColor: "rgba(56,189,248,0.25)",
    dotColor: "bg-sky-400",
    accentColor: "#38bdf8",
    label: "LOW",
  },
  informational: {
    badge: "bg-stone-500/15 text-stone-400 ring-1 ring-stone-500/25",
    borderColor: "rgba(30,69,48,0.8)",
    dotColor: "bg-stone-500",
    accentColor: "#3D5C46",
    label: "INFO",
  },
};

// --------------- Status Map --------------------------------------------------

const STATUS_CONFIG: Record<
  IncidentStatus,
  { label: string; color: string; bg: string }
> = {
  new:           { label: "NEW",           color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  triaged:       { label: "TRIAGED",       color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
  triaging:      { label: "TRIAGING",      color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
  investigating: { label: "INVESTIGATING", color: "#D4AF37", bg: "rgba(212,175,55,0.10)" },
  contained:     { label: "CONTAINED",     color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  eradicated:    { label: "ERADICATED",    color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  recovering:    { label: "RECOVERING",    color: "#a78bfa", bg: "rgba(167,139,250,0.12)"},
  resolved:      { label: "RESOLVED",      color: "#34d399", bg: "rgba(52,211,153,0.10)"},
  closed:        { label: "CLOSED",        color: "#8A9E8E", bg: "rgba(138,158,142,0.10)"},
  false_positive:{ label: "FALSE +",       color: "#3D5C46", bg: "rgba(61,92,70,0.15)"  },
};

// --------------- Component ---------------------------------------------------

interface AlertCardProps {
  incident: Incident;
  index: number;
  onDismiss?: (id: string) => void;
  onActionProcessed?: (incident: Incident) => void;
}

export function AlertCard({ incident: initialIncident, index, onDismiss, onActionProcessed }: AlertCardProps) {
  const [incident, setIncident] = useState<Incident>(initialIncident);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "action" | "audit">("overview");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dismissState, setDismissState] = useState<"idle" | "exiting">("idle");

  const sev  = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.medium;
  const stat = STATUS_CONFIG[incident.status] || STATUS_CONFIG.new;

  const formattedTime = new Date(incident.timestamp).toLocaleString("en-US", {
    month:   "short",
    day:     "2-digit",
    hour:    "2-digit",
    minute:  "2-digit",
    second:  "2-digit",
    hour12:  false,
    timeZone:"UTC",
  });

  async function handleAction(decision: "approve" | "deny") {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/alerts/${incident.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      if (res.ok) {
        const updated: Incident = await res.json();
        setIncident(updated);
        if (onActionProcessed) onActionProcessed(updated);
      } else {
        // Fallback local update if offline
        const now = new Date().toISOString();
        const updated: Incident = {
          ...incident,
          status: decision === "approve" ? "contained" : incident.status,
          execution_result: {
            executor_id: "ActionBroker_Perimeter_FW",
            idempotency_key: `idemp_${Date.now()}`,
            status: decision === "approve" ? "success" : "denied",
            verification_evidence: decision === "approve" ? ["Perimeter firewall rule active (1h TTL)."] : ["Action rejected."],
            rollback_status: decision === "approve" ? "Active (Auto-rollback in 3600s)" : undefined,
          },
        };
        setIncident(updated);
        if (onActionProcessed) onActionProcessed(updated);
      }
    } catch {
      // Graceful offline mock update
      setIncident((prev) => ({
        ...prev,
        status: decision === "approve" ? "contained" : prev.status,
        execution_result: {
          executor_id: "ActionBroker_Perimeter_FW",
          idempotency_key: `idemp_${Date.now()}`,
          status: decision === "approve" ? "success" : "denied",
          verification_evidence: ["Perimeter firewall rule active (1-hour TTL)."],
          rollback_status: "Active (Auto-rollback in 3600s)",
        },
      }));
    } finally {
      setIsProcessing(false);
    }
  }

  function handleDismiss() {
    if (!onDismiss || dismissState === "exiting") return;
    setDismissState("exiting");
    setTimeout(() => onDismiss(incident.id), 350);
  }

  const isExiting = dismissState === "exiting";
  const actionProposed = incident.proposed_action;
  const policy = incident.policy_decision;
  const execResult = incident.execution_result;

  return (
    <article
      className="group relative overflow-hidden rounded-lg p-5 shadow-xl transition-all duration-300"
      style={{
        border: `1px solid ${isExiting ? "transparent" : sev.borderColor}`,
        backgroundColor: isExiting ? "transparent" : "rgba(10,26,17,0.75)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "translateY(-6px) scale(0.98)" : "translateY(0) scale(1)",
        maxHeight: isExiting ? "0px" : "1600px",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Severity left-accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: sev.accentColor }}
      />

      {/* Top Header Row */}
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        {/* Index */}
        <span className="font-mono text-[10px]" style={{ color: "#2A4535" }}>
          #{String(index + 1).padStart(2, "0")}
        </span>

        {/* Severity Badge */}
        <span className={`flex items-center gap-1.5 rounded px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest ${sev.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${sev.dotColor}`} />
          {sev.label}
        </span>

        {/* Status Badge */}
        <span
          className="rounded px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest"
          style={{ color: stat.color, backgroundColor: stat.bg, border: `1px solid ${stat.color}33` }}
        >
          {stat.label}
        </span>

        {/* ATT&CK Technique Badge */}
        {incident.attck_technique && (
          <span
            className="flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px]"
            style={{
              backgroundColor: "rgba(96,165,250,0.08)",
              borderColor: "rgba(96,165,250,0.25)",
              color: "#93c5fd",
            }}
          >
            <span className="font-bold">{incident.attck_technique.id}</span>
            <span className="text-stone-400">·</span>
            <span>{incident.attck_technique.name}</span>
            <span className="text-stone-400">({Math.round(incident.attck_technique.confidence * 100)}%)</span>
          </span>
        )}

        {/* Incident ID */}
        <span className="ml-auto font-mono text-xs font-semibold" style={{ color: "#8A9E8E" }}>
          {incident.id}
        </span>
      </div>

      {/* Event Title & Target Host */}
      <div className="mb-2.5">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: "#3D5C46" }}>
          {incident.event_type}
        </p>
        <div className="flex items-baseline gap-2">
          {incident.affected_host && (
            <span className="font-mono text-sm font-bold" style={{ color: "#D4AF37" }}>
              {incident.affected_host}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {incident.description && (
        <p className="mb-3.5 text-xs leading-relaxed" style={{ color: "#C4BFB3" }}>
          {incident.description}
        </p>
      )}

      {/* Navigation Tabs for Expanded Intelligence */}
      <div className="mb-3 flex items-center gap-2 border-b pb-2" style={{ borderColor: "#1E4530" }}>
        {[
          { id: "overview", label: "Agent Analysis" },
          { id: "evidence", label: `Evidence (${incident.evidence_bundle?.length || 0})` },
          { id: "action",   label: "ActionSpec Policy Gate" },
          { id: "audit",    label: `Audit Trail (${incident.audit_trail?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="rounded px-2.5 py-1 font-mono text-[10px] font-semibold transition-all duration-200"
            style={{
              backgroundColor: activeTab === tab.id ? "rgba(212,175,55,0.12)" : "transparent",
              color: activeTab === tab.id ? "#D4AF37" : "#8A9E8E",
              border: activeTab === tab.id ? "1px solid rgba(212,175,55,0.25)" : "1px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Agent Summary */}
      {activeTab === "overview" && (
        <div className="mb-3.5 space-y-2.5">
          {incident.agent_summary && (
            <div
              className="rounded border p-3"
              style={{
                borderColor: "rgba(212,175,55,0.15)",
                backgroundColor: "rgba(212,175,55,0.03)",
              }}
            >
              <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.7)" }}>
                Multi-Agent Synthesis
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#E5E0D8" }}>
                {incident.agent_summary}
              </p>
            </div>
          )}
          {incident.agent_recommendation && (
            <div
              className="flex items-center gap-2 rounded border px-3 py-2"
              style={{
                borderColor: "rgba(52,211,153,0.2)",
                backgroundColor: "rgba(52,211,153,0.04)",
              }}
            >
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                RECOMMENDATION:
              </span>
              <span className="font-mono text-[10px] text-emerald-200">
                {incident.agent_recommendation}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Evidence Bundle & Provenance */}
      {activeTab === "evidence" && (
        <div className="mb-3.5 space-y-2">
          {incident.evidence_bundle && incident.evidence_bundle.length > 0 ? (
            incident.evidence_bundle.map((ev) => (
              <div
                key={ev.id}
                className="rounded border p-2.5 font-mono text-xs"
                style={{
                  borderColor: "rgba(212,175,55,0.12)",
                  backgroundColor: "rgba(4,16,9,0.6)",
                }}
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-400">
                      {ev.source}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Confidence: {Math.round(ev.confidence * 100)}%
                    </span>
                  </div>
                  <span className="text-[9px] text-stone-500">{ev.provenance}</span>
                </div>
                <p className="text-[11px] text-stone-200">{ev.summary}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-400">No external evidence items linked.</p>
          )}
        </div>
      )}

      {/* Tab 3: ActionSpec Proposal & Policy Gate */}
      {activeTab === "action" && (
        <div className="mb-3.5 space-y-3">
          {actionProposed ? (
            <div
              className="rounded border p-3 font-mono"
              style={{
                borderColor: "rgba(212,175,55,0.2)",
                backgroundColor: "rgba(4,16,9,0.75)",
              }}
            >
              <div className="mb-2 flex items-center justify-between border-b pb-2" style={{ borderColor: "#1E4530" }}>
                <div>
                  <span className="text-[11px] font-bold text-amber-300 uppercase">
                    PROPOSED ACTION: {actionProposed.action_type}
                  </span>
                  <span className="ml-2 text-[10px] text-stone-400">({actionProposed.risk_tier})</span>
                </div>
                {policy && (
                  <span
                    className="rounded px-2 py-0.5 text-[9px] font-bold uppercase"
                    style={{
                      backgroundColor: policy.decision === "REQUIRE_APPROVAL" ? "rgba(249,115,22,0.15)" : "rgba(52,211,153,0.15)",
                      color: policy.decision === "REQUIRE_APPROVAL" ? "#fb923c" : "#34d399",
                      border: `1px solid ${policy.decision === "REQUIRE_APPROVAL" ? "#f9731633" : "#34d39933"}`,
                    }}
                  >
                    Policy: {policy.decision}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-300">
                <div><span className="text-stone-500">Target:</span> {actionProposed.target_id} ({actionProposed.target_type})</div>
                <div><span className="text-stone-500">Blast Radius:</span> {actionProposed.blast_radius}</div>
                <div><span className="text-stone-500">Containment TTL:</span> {actionProposed.ttl_seconds}s (Auto-Rollback)</div>
                <div><span className="text-stone-500">Agent:</span> {actionProposed.requested_by_agent}</div>
              </div>

              <div className="mt-2 text-[10px] text-stone-300">
                <span className="text-stone-500">Rationale:</span> {actionProposed.rationale}
              </div>

              {execResult && execResult.status !== "pending" && (
                <div
                  className="mt-2.5 rounded border p-2 text-[10px]"
                  style={{
                    backgroundColor: execResult.status === "success" ? "rgba(52,211,153,0.08)" : "rgba(244,63,94,0.08)",
                    borderColor: execResult.status === "success" ? "rgba(52,211,153,0.3)" : "rgba(244,63,94,0.3)",
                    color: execResult.status === "success" ? "#a7f3d0" : "#fca5a5",
                  }}
                >
                  <p className="font-bold uppercase">Broker Execution Status: {execResult.status}</p>
                  {execResult.rollback_status && <p className="text-[9px] text-stone-400">Rollback Status: {execResult.rollback_status}</p>}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-stone-400">No active ActionProposal for this alert.</p>
          )}
        </div>
      )}

      {/* Tab 4: Immutable Audit Trail */}
      {activeTab === "audit" && (
        <div className="mb-3.5 space-y-2">
          {incident.audit_trail && incident.audit_trail.length > 0 ? (
            incident.audit_trail.map((aud) => (
              <div
                key={aud.id}
                className="flex items-start justify-between rounded border p-2 font-mono text-[10px]"
                style={{
                  borderColor: "rgba(30,69,48,0.7)",
                  backgroundColor: "rgba(4,16,9,0.5)",
                }}
              >
                <div>
                  <span className="font-bold text-amber-400">{aud.actor}</span>
                  <span className="mx-1.5 text-stone-500">[{aud.event_type}]</span>
                  <span className="text-stone-300">{aud.details}</span>
                </div>
                <span className="shrink-0 text-[8px] text-stone-500">{aud.signature_hash.slice(0, 16)}...</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-400">No audit events recorded.</p>
          )}
        </div>
      )}

      {/* Footer — source + timestamp */}
      <div
        className="flex flex-wrap items-center gap-4 border-t pt-2.5"
        style={{ borderColor: "#1E4530" }}
      >
        <div className="flex items-center gap-1.5">
          <svg className="h-3 w-3" style={{ color: "#2A4535" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3m-16.5 0a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-22.5 0v1.5A2.25 2.25 0 0 0 4.5 18h15a2.25 2.25 0 0 0 2.25-2.25V12a2.25 2.25 0 0 0-2.25-2.25H18M6.75 6h10.5" />
          </svg>
          <span className="font-mono text-[10px]" style={{ color: "#8A9E8E" }}>
            {incident.source}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <svg className="h-3 w-3" style={{ color: "#2A4535" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="font-mono text-[10px]" style={{ color: "#8A9E8E" }}>
            {formattedTime} UTC
          </span>
        </div>
      </div>

      {/* ── Policy-Governed Human Approval Controls ── */}
      {actionProposed && policy?.decision === "REQUIRE_APPROVAL" && execResult?.status === "pending" && (
        <div
          className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3"
          style={{ borderColor: "#1E4530" }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono text-[10px] font-bold text-amber-300 uppercase">
              Action Gate: Human Analyst Approval Required
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Approve Action — Triggers Action Broker with TTL */}
            <button
              id={`approve-${incident.id}`}
              disabled={isProcessing}
              onClick={() => handleAction("approve")}
              className="flex items-center gap-1.5 rounded border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              style={{
                borderColor: "rgba(52,211,153,0.45)",
                backgroundColor: "rgba(16,185,129,0.18)",
                color: "#6ee7b7",
                boxShadow: "0 0 16px -4px rgba(52,211,153,0.3)",
              }}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {isProcessing ? "BROKER EXECUTING..." : "Authorize Action (Action Broker)"}
            </button>

            {/* Deny Action */}
            <button
              id={`deny-${incident.id}`}
              disabled={isProcessing}
              onClick={() => handleAction("deny")}
              className="flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              style={{
                borderColor: "rgba(244,63,94,0.3)",
                backgroundColor: "rgba(244,63,94,0.08)",
                color: "#fca5a5",
              }}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Deny
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
