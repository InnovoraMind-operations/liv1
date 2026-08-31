"use client";

// ---------------------------------------------------------------------------
// Platform Capabilities Matrix Sidebar
// Shows staging status of upcoming AI-SOC modules.
// ---------------------------------------------------------------------------

import React from "react";
import type { PlatformModule, ModuleStage } from "@/types";

// ---------------------------------------------------------------------------
// Inline SVG icon set — gold-tinted, w-5 h-5, stroke-based, no external deps
// ---------------------------------------------------------------------------

const ICON_COLOR = "#D4AF37"; // true gold
const ICON_DIM   = 20;        // px — matches w-5 h-5

function IconShield() {
  return (
    <svg width={ICON_DIM} height={ICON_DIM} viewBox="0 0 24 24" fill="none"
      stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCpu() {
  return (
    <svg width={ICON_DIM} height={ICON_DIM} viewBox="0 0 24 24" fill="none"
      stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 4v1M15 4v1M9 19v1M15 19v1M4 9h1M4 15h1M19 9h1M19 15h1" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function IconTerminal() {
  return (
    <svg width={ICON_DIM} height={ICON_DIM} viewBox="0 0 24 24" fill="none"
      stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function IconNetwork() {
  return (
    <svg width={ICON_DIM} height={ICON_DIM} viewBox="0 0 24 24" fill="none"
      stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <line x1="12" y1="7" x2="5" y2="17" />
      <line x1="12" y1="7" x2="19" y2="17" />
      <line x1="5" y1="19" x2="19" y2="19" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width={ICON_DIM} height={ICON_DIM} viewBox="0 0 24 24" fill="none"
      stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconServer() {
  return (
    <svg width={ICON_DIM} height={ICON_DIM} viewBox="0 0 24 24" fill="none"
      stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function IconLayoutDashboard() {
  return (
    <svg width={ICON_DIM} height={ICON_DIM} viewBox="0 0 24 24" fill="none"
      stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg width={ICON_DIM} height={ICON_DIM} viewBox="0 0 24 24" fill="none"
      stroke={ICON_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

// --------------- Module Registry --------------------------------------------

const PLATFORM_MODULES: PlatformModule[] = [
  {
    name: "SOC Command Dashboard",
    description:
      "Next.js 15 App Router frontend with real-time status polling & evidence inspection.",
    stage: "live",
    icon: <IconLayoutDashboard />,
  },
  {
    name: "REST API & Ingestion Core",
    description:
      "FastAPI backend with Pydantic v2 schemas, CORS, and health telemetry.",
    stage: "live",
    icon: <IconServer />,
  },
  {
    name: "ActionSpec & Policy Gate",
    description:
      "Deterministic policy evaluation and ActionProposal schema contract.",
    stage: "live",
    icon: <IconShield />,
  },
  {
    name: "Action Broker (HITL)",
    description:
      "Policy-authorized executor with scoped credentials and auto-rollback TTL.",
    stage: "staging",
    icon: <IconZap />,
  },
  {
    name: "Canonical Alert Queue",
    description:
      "Normalized incident store with evidence bundles and immutable audit trail.",
    stage: "staging",
    icon: <IconTerminal />,
  },
  {
    name: "Multi-Agent LangGraph Core",
    description:
      "LangGraph orchestration mesh with Triage, Context, and Response agents.",
    stage: "development",
    icon: <IconCpu />,
  },
  {
    name: "MITRE ATT&CK Mapper",
    description:
      "Calibrated candidate retrieval and TTP tagging with confidence scoring.",
    stage: "development",
    icon: <IconMap />,
  },
  {
    name: "Windows Event & Packet Sensors",
    description:
      "Event Log tailer (4625/4688) and libpcap network flow collector.",
    stage: "development",
    icon: <IconNetwork />,
  },
  {
    name: "Enterprise SSO & API Keys",
    description:
      "OIDC/SAML integration, phishing-resistant MFA, and scoped API key lifecycle.",
    stage: "planned",
    icon: <IconShield />,
  },
];

// --------------- Stage Config ------------------------------------------------

const STAGE_CONFIG: Record<
  ModuleStage,
  { label: string; textColor: string; bg: string; ring: string; barColor: string; order: number }
> = {
  live: {
    label: "LIVE",
    textColor: "#D4AF37",
    bg: "rgba(212,175,55,0.08)",
    ring: "rgba(212,175,55,0.30)",
    barColor: "#D4AF37",
    order: 0,
  },
  staging: {
    label: "STAGING",
    textColor: "rgba(212,175,55,0.8)",
    bg: "rgba(212,175,55,0.06)",
    ring: "rgba(212,175,55,0.25)",
    barColor: "rgba(212,175,55,0.8)",
    order: 1,
  },
  development: {
    label: "DEV",
    textColor: "rgba(212,175,55,0.5)",
    bg: "rgba(212,175,55,0.04)",
    ring: "rgba(212,175,55,0.15)",
    barColor: "rgba(212,175,55,0.5)",
    order: 2,
  },
  planned: {
    label: "PLANNED",
    textColor: "rgba(138,158,142,0.8)",
    bg: "rgba(138,158,142,0.05)",
    ring: "rgba(138,158,142,0.15)",
    barColor: "rgba(138,158,142,0.5)",
    order: 3,
  },
};

// --------------- Component ---------------------------------------------------

export function CapabilitiesMatrix() {
  const sorted = [...PLATFORM_MODULES].sort(
    (a, b) => STAGE_CONFIG[a.stage].order - STAGE_CONFIG[b.stage].order
  );

  const stageCounts = PLATFORM_MODULES.reduce(
    (acc, m) => {
      acc[m.stage] = (acc[m.stage] || 0) + 1;
      return acc;
    },
    {} as Record<ModuleStage, number>
  );

  const liveCount = stageCounts["live"] ?? 0;
  const total = PLATFORM_MODULES.length;
  const completionPct = Math.round((liveCount / total) * 100);

  return (
    <aside className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-px w-4" style={{ backgroundColor: "rgba(212,175,55,0.4)" }} />
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: "#8A9E8E" }}>
            Capabilities Matrix
          </h2>
        </div>
        <span className="font-mono text-[10px]" style={{ color: "#3D5C46" }}>
          PHASE 1/{" "}
          <span style={{ color: "#D4AF37" }}>{completionPct}%</span>
        </span>
      </div>

      {/* Progress bar — gold fill */}
      <div className="overflow-hidden rounded-full p-px" style={{ backgroundColor: "#163524" }}>
        <div
          className="h-1 rounded-full transition-all duration-700"
          style={{
            width: `${completionPct}%`,
            background: "linear-gradient(to right, #8B6914, #D4AF37)",
          }}
        />
      </div>

      {/* Stage summary pills */}
      <div className="grid grid-cols-2 gap-2">
        {(["live", "staging", "development", "planned"] as ModuleStage[]).map((stage) => {
          const cfg = STAGE_CONFIG[stage];
          return (
            <div
              key={stage}
              className="flex items-center justify-between rounded border px-3 py-2"
              style={{ borderColor: "#1E4530", backgroundColor: "rgba(15,42,28,0.55)" }}
            >
              <span
                className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest"
                style={{
                  color: cfg.textColor,
                  backgroundColor: cfg.bg,
                  boxShadow: `0 0 0 1px ${cfg.ring}`,
                }}
              >
                {cfg.label}
              </span>
              <span className="font-mono text-xs font-semibold" style={{ color: "#8A9E8E" }}>
                {stageCounts[stage] ?? 0}
              </span>
            </div>
          );
        })}
      </div>

      {/* Module list */}
      <div className="flex flex-col gap-2">
        {sorted.map((mod) => {
          const cfg = STAGE_CONFIG[mod.stage];
          return (
            <div
              key={mod.name}
              className="group relative overflow-hidden rounded-lg border p-3 transition-all duration-200"
              style={{ borderColor: "#1E4530", backgroundColor: "rgba(15,42,28,0.45)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(212,175,55,0.2)";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(15,42,28,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#1E4530";
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(15,42,28,0.45)";
              }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 h-full w-0.5 opacity-70"
                style={{ backgroundColor: cfg.barColor }}
              />

              <div className="mb-1 flex items-center gap-3">
                {/* Gold SVG icon — w-5 h-5 equivalent via ICON_DIM constant */}
                <span className="shrink-0 flex items-center justify-center opacity-90">
                  {mod.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[11px] font-semibold" style={{ color: "#F5F0E8" }}>
                      {mod.name}
                    </p>
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest"
                      style={{
                        color: cfg.textColor,
                        backgroundColor: cfg.bg,
                        boxShadow: `0 0 0 1px ${cfg.ring}`,
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] leading-relaxed" style={{ color: "#3D5C46" }}>
                    {mod.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center font-mono text-[10px]" style={{ color: "#2A4535" }}>
        ── Phase 1: Foundation ──
      </p>
    </aside>
  );
}
