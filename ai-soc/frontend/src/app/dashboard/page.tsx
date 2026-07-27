// NOTE: This page remains a Server Component for cookie auth + redirect.
// The ThreatLevelBar and TerminateButton are extracted as their own
// "use client" sub-components so they can own local state/transitions
// without forcing the whole page into client-land.
import { Suspense } from "react";
import type { Metadata } from "next";
import { HeaderStatusBar } from "@/components/HeaderStatusBar";
import { AlertQueue } from "@/components/AlertQueue";
import { CapabilitiesMatrix } from "@/components/CapabilitiesMatrix";
import { ThreatLevelBar } from "@/components/ThreatLevelBar";
import { TerminateButton } from "@/components/TerminateButton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "AI-SOC | Security Operations Center — Phase 1",
  description:
    "AI-powered Security Operations Center dashboard. Real-time threat monitoring, incident triage, and autonomous remediation powered by multi-agent orchestration.",
  keywords: [
    "SOC", "SIEM", "security operations", "threat detection", "AI security", "incident response",
  ],
};

// ---------------------------------------------------------------------------
// Loading Skeletons — Forest Green × Gold theme
// ---------------------------------------------------------------------------

function AlertQueueSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-px w-4" style={{ backgroundColor: "rgba(212,175,55,0.3)" }} />
          <div className="h-3 w-40 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border p-4"
          style={{
            borderColor: "rgba(212,175,55,0.1)",
            backgroundColor: "rgba(15,42,28,0.55)",
            animationDelay: `${i * 100}ms`,
          }}
        >
          <div className="mb-3 flex gap-2">
            <div className="h-4 w-16 rounded" style={{ backgroundColor: "#163524" }} />
            <div className="h-4 w-20 rounded" style={{ backgroundColor: "#163524" }} />
          </div>
          <div className="mb-2 h-3 w-48 rounded" style={{ backgroundColor: "#163524" }} />
          <div className="mb-1 h-3 w-full rounded" style={{ backgroundColor: "#163524" }} />
          <div className="h-3 w-3/4 rounded" style={{ backgroundColor: "#163524" }} />
        </div>
      ))}
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="border-b px-6 py-3" style={{ borderColor: "#1E4530" }}>
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
        <div className="h-4 w-48 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metrics Bar
// ---------------------------------------------------------------------------

function MetricsBar() {
  const metrics = [
    { label: "MTTR",      value: "—", unit: "min",    note: "Mean Time to Respond"    },
    { label: "FP RATE",   value: "—", unit: "%",      note: "False Positive Rate"     },
    { label: "INGESTED",  value: "—", unit: "ev/s",   note: "Events per Second"       },
    { label: "AGENTS",    value: "0", unit: "active", note: "Autonomous Agents"        },
    { label: "PLAYBOOKS", value: "0", unit: "loaded", note: "Remediation Playbooks"   },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map(({ label, value, unit, note }) => (
        <div
          key={label}
          className="rounded-lg border p-3 transition-all duration-200 hover:border-amber-500/25"
          style={{
            borderColor: "rgba(212,175,55,0.12)",
            backgroundColor: "rgba(15,42,28,0.55)",
          }}
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: "#3D5C46" }}>
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-bold" style={{ color: "#F5F0E8" }}>
              {value}
            </span>
            <span className="font-mono text-[10px]" style={{ color: "#3D5C46" }}>
              {unit}
            </span>
          </div>
          <p className="mt-0.5 text-[10px]" style={{ color: "#2A4535" }}>
            {note}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const IS_PROD = process.env.NODE_ENV === "production";
  const cookieName = IS_PROD ? "__Secure-soc_session" : "soc_session";
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen" style={{ color: "#F5F0E8" }}>

      {/* Dashboard header (brand + threat level + session) */}
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderStatusBar />
      </Suspense>

      {/* Main content */}
      <main className="mx-auto max-w-screen-2xl px-6 py-6">

        {/* ── Page title row ── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-6">

          {/* Left — eyebrow / title / subtitle */}
          <div>
            <div className="flex items-center gap-2">
              <div
                className="h-px w-6"
                style={{ background: "linear-gradient(to right, #D4AF37, transparent)" }}
              />
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                Security Operations
              </span>
            </div>
            <h1
              className="mt-1 font-mono text-2xl font-bold tracking-tight"
              style={{ color: "#F5F0E8" }}
            >
              Command Dashboard
            </h1>
            <p className="mt-0.5 font-mono text-xs" style={{ color: "#3D5C46" }}>
              Phase 1 — Foundational Intelligence Layer &nbsp;·&nbsp; Real-time Alert Monitoring
            </p>
          </div>

          {/* Right — Threat Level + Terminate Session */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <ThreatLevelBar />
            <TerminateButton />
          </div>

        </div>

        {/* Metrics bar */}
        <div className="mb-6">
          <MetricsBar />
        </div>

        {/* Main grid: Alert Queue + Capabilities Matrix */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          <Suspense fallback={<AlertQueueSkeleton />}>
            <AlertQueue />
          </Suspense>
          <CapabilitiesMatrix />
        </div>

        {/* Footer */}
        <footer
          className="mt-10 border-t pt-4"
          style={{ borderColor: "#1E4530" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[10px]" style={{ color: "#2A4535" }}>
              AI-SOC Core Engine v0.1.0 &nbsp;·&nbsp; Phase 1: Foundation &nbsp;·&nbsp; All data mock
            </p>
            <p className="font-mono text-[10px]" style={{ color: "#2A4535" }}>
              Next.js 15 App Router &nbsp;·&nbsp; FastAPI &nbsp;·&nbsp; Pydantic v2
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
