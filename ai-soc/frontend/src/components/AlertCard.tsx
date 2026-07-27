"use client";

// ---------------------------------------------------------------------------
// Alert Card Component — Forest Green × Gold Executive Theme
// Renders a single security incident with severity-styled badge.
// Severity colors retained for data-critical legibility (WCAG AA).
//
// v2 additions:
//   • onDismiss(id) prop — called by both operator action buttons
//   • Fade-out animation state before removing from parent list
//   • "Operator Actions" row: [Approve Block] [Ignore Alert]
//   • agent_recommendation display when present
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
  new:           { label: "NEW",           color: "#f87171", bg: "rgba(244,63,94,0.10)"  },
  triaging:      { label: "TRIAGING",      color: "#fb923c", bg: "rgba(249,115,22,0.10)" },
  investigating: { label: "INVESTIGATING", color: "#D4AF37", bg: "rgba(212,175,55,0.08)" },
  contained:     { label: "CONTAINED",     color: "#6DB872", bg: "rgba(109,184,114,0.08)"},
  resolved:      { label: "RESOLVED",      color: "#8A9E8E", bg: "rgba(138,158,142,0.08)"},
  false_positive:{ label: "FALSE +",       color: "#3D5C46", bg: "rgba(61,92,70,0.15)"  },
};

// --------------- Component ---------------------------------------------------

interface AlertCardProps {
  incident: Incident;
  index: number;
  /** Called after dismiss animation completes — removes incident from parent list */
  onDismiss?: (id: string) => void;
}

export function AlertCard({ incident, index, onDismiss }: AlertCardProps) {
  // Dismiss animation: "idle" → "exiting" → parent removes node
  const [dismissState, setDismissState] = useState<"idle" | "exiting">("idle");

  const sev  = SEVERITY_CONFIG[incident.severity];
  const stat = STATUS_CONFIG[incident.status];

  const formattedTime = new Date(incident.timestamp).toLocaleString("en-US", {
    month:   "short",
    day:     "2-digit",
    hour:    "2-digit",
    minute:  "2-digit",
    second:  "2-digit",
    hour12:  false,
    timeZone:"UTC",
  });

  /** Trigger fade-out, then notify parent to remove from list */
  function handleDismiss() {
    if (!onDismiss || dismissState === "exiting") return;
    setDismissState("exiting");
    setTimeout(() => onDismiss(incident.id), 350); // matches CSS transition duration
  }

  const isExiting = dismissState === "exiting";

  return (
    <article
      className="group relative overflow-hidden rounded-lg p-4 shadow-lg cursor-pointer"
      style={{
        border: `1px solid ${isExiting ? "transparent" : sev.borderColor}`,
        backgroundColor: isExiting ? "transparent" : "rgba(15,42,28,0.65)",
        // Smooth fade + collapse — height transition handled via max-height trick
        transition: "opacity 350ms ease, transform 350ms ease, max-height 350ms ease, padding 350ms ease, border-color 350ms ease, background-color 350ms ease",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "translateY(-6px) scale(0.98)" : "translateY(0) scale(1)",
        maxHeight: isExiting ? "0px" : "800px",
        overflow: "hidden",
        pointerEvents: isExiting ? "none" : "auto",
      }}
      onMouseEnter={(e) => {
        if (isExiting) return;
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.30)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px -8px rgba(212,175,55,0.12)";
      }}
      onMouseLeave={(e) => {
        if (isExiting) return;
        (e.currentTarget as HTMLElement).style.borderColor = sev.borderColor;
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      {/* Severity left-accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-0.5"
        style={{ backgroundColor: sev.accentColor }}
      />

      {/* Top row */}
      <div className="mb-3 flex flex-wrap items-start gap-2">
        {/* Index */}
        <span className="font-mono text-[10px]" style={{ color: "#2A4535" }}>
          #{String(index + 1).padStart(2, "0")}
        </span>

        {/* Severity badge */}
        <span className={`flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest ${sev.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${sev.dotColor}`} />
          {sev.label}
        </span>

        {/* Status badge */}
        <span
          className="rounded px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest"
          style={{ color: stat.color, backgroundColor: stat.bg }}
        >
          {stat.label}
        </span>

        {/* Incident ID */}
        <span className="ml-auto font-mono text-[10px] font-semibold" style={{ color: "#3D5C46" }}>
          {incident.id}
        </span>
      </div>

      {/* Event type + host */}
      <div className="mb-2">
        <p className="mb-0.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: "#3D5C46" }}>
          {incident.event_type}
        </p>
        <p className="text-sm font-semibold" style={{ color: "#F5F0E8" }}>
          {incident.affected_host && (
            <span className="mr-2 font-mono" style={{ color: "#D4AF37" }}>
              {incident.affected_host}
            </span>
          )}
        </p>
      </div>

      {/* Description */}
      {incident.description && (
        <p className="mb-3 text-xs leading-relaxed" style={{ color: "#8A9E8E" }}>
          {incident.description}
        </p>
      )}

      {/* Agent Recommendation — shown only when present */}
      {incident.agent_recommendation && (
        <div
          className="mb-3 flex items-start gap-2 rounded-md border px-3 py-2"
          style={{
            borderColor: "rgba(212,175,55,0.18)",
            backgroundColor: "rgba(212,175,55,0.04)",
          }}
        >
          {/* Target-reticle icon */}
          <svg
            className="mt-px h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
          <div>
            <p className="mb-0.5 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.5)" }}>
              Agent Recommendation
            </p>
            <p className="font-mono text-[10px] font-semibold" style={{ color: "#D4AF37" }}>
              {incident.agent_recommendation}
            </p>
          </div>
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
          <span className="font-mono text-[10px]" style={{ color: "#3D5C46" }}>
            {incident.source}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <svg className="h-3 w-3" style={{ color: "#2A4535" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="font-mono text-[10px]" style={{ color: "#3D5C46" }}>
            {formattedTime} UTC
          </span>
        </div>
      </div>

      {/* ── Operator Actions ── */}
      {onDismiss && (
        <div
          className="mt-3 flex items-center gap-2 border-t pt-3"
          style={{ borderColor: "#1E4530" }}
        >
          <p className="mr-1 font-mono text-[9px] uppercase tracking-widest" style={{ color: "#2A4535" }}>
            Operator
          </p>

          {/* Approve Block — decisive, red-toned */}
          <button
            id={`approve-${incident.id}`}
            onClick={handleDismiss}
            className="flex items-center gap-1.5 rounded border px-3 py-1 font-mono text-[10px] font-bold tracking-widest transition-all duration-200 hover:scale-[1.03] active:scale-95"
            style={{
              borderColor: "rgba(239,68,68,0.45)",
              backgroundColor: "rgba(127,29,29,0.35)",
              color: "#fca5a5",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(127,29,29,0.6)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px -4px rgba(239,68,68,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(127,29,29,0.35)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
            }}
          >
            {/* Shield-check icon */}
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            Approve Block
          </button>

          {/* Ignore Alert — muted, secondary */}
          <button
            id={`ignore-${incident.id}`}
            onClick={handleDismiss}
            className="flex items-center gap-1.5 rounded border px-3 py-1 font-mono text-[10px] tracking-widest transition-all duration-200 hover:scale-[1.03] active:scale-95"
            style={{
              borderColor: "rgba(68,68,68,0.5)",
              backgroundColor: "transparent",
              color: "#78716c",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#d6d3d1";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(120,113,108,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#78716c";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(68,68,68,0.5)";
            }}
          >
            {/* X icon */}
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Ignore Alert
          </button>
        </div>
      )}
    </article>
  );
}
