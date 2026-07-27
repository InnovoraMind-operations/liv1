// ---------------------------------------------------------------------------
// TriageLoader — Active Triage Skeleton Component — Forest Green × Gold Theme
// Mimics the shape of an AlertCard but communicates that an autonomous
// agent is actively investigating the threat in real time.
// Trigger this state by rendering <TriageLoader /> in the alert queue.
// ---------------------------------------------------------------------------

"use client";

import { useEffect, useState } from "react";

const TRIAGE_STEPS = [
  "Initializing agent sandbox...",
  "Pulling threat intelligence feeds...",
  "Correlating IOC signatures...",
  "Running behavioral heuristics...",
  "Cross-referencing MITRE ATT&CK...",
  "Generating triage report...",
];

export function TriageLoader() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((i) => (i + 1) % TRIAGE_STEPS.length);
    }, 1400);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        return p + Math.random() * 4;
      });
    }, 600);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <article
      className="relative overflow-hidden rounded-lg p-4 shadow-lg before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-amber-500/4 before:to-transparent before:animate-pulse"
      style={{
        border: "1px solid rgba(212,175,55,0.25)",
        backgroundColor: "rgba(15,42,28,0.75)",
        boxShadow: "0 4px 24px -6px rgba(212,175,55,0.10)",
      }}
    >
      {/* Gold left accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-0.5"
        style={{
          backgroundColor: "#D4AF37",
          boxShadow: "0 0 6px 0px rgba(212,175,55,0.7)",
        }}
      />

      {/* ── Top row ghosts ── */}
      <div className="mb-3 flex flex-wrap items-start gap-2">
        <div className="h-3 w-6 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />

        {/* TRIAGING badge */}
        <div
          className="flex items-center gap-1.5 rounded px-2 py-0.5"
          style={{
            backgroundColor: "rgba(212,175,55,0.10)",
            boxShadow: "0 0 0 1px rgba(212,175,55,0.30)",
          }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "#D4AF37" }} />
          <span className="font-mono text-[10px] font-bold tracking-widest" style={{ color: "#D4AF37" }}>
            TRIAGING
          </span>
        </div>

        <div className="h-4 w-20 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
        <div className="ml-auto h-3 w-28 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
      </div>

      {/* ── Event type + host ghosts ── */}
      <div className="mb-2">
        <div className="mb-1.5 h-2.5 w-32 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
        <div className="h-3.5 w-48 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
      </div>

      {/* ── Description ghost lines ── */}
      <div className="mb-4 space-y-1.5">
        <div className="h-2.5 w-full animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
        <div className="h-2.5 w-4/5 animate-pulse rounded" style={{ backgroundColor: "#163524", animationDelay: "100ms" }} />
        <div className="h-2.5 w-2/3 animate-pulse rounded" style={{ backgroundColor: "#163524", animationDelay: "200ms" }} />
      </div>

      {/* ── Agent Status Panel ── */}
      <div
        className="rounded-md px-3 py-2.5 animate-triage-glow"
        style={{
          border: "1px solid rgba(212,175,55,0.18)",
          backgroundColor: "rgba(212,175,55,0.04)",
        }}
      >
        {/* Headline row */}
        <div className="mb-2 flex items-center gap-2">
          {/* Spinner */}
          <svg className="h-3 w-3 animate-spin" style={{ color: "#D4AF37" }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            />
          </svg>
          <p
            className="font-mono text-[11px] font-semibold tracking-wider"
            style={{
              color: "#D4AF37",
              textShadow: "0 0 10px rgba(212,175,55,0.5)",
            }}
          >
            Autonomous Agent Triaging Threat...
          </p>
        </div>

        {/* Step label */}
        <p
          key={stepIndex}
          className="mb-2.5 font-mono text-[10px] transition-all duration-500"
          style={{ color: "rgba(212,175,55,0.5)" }}
        >
          › {TRIAGE_STEPS[stepIndex]}
        </p>

        {/* Progress bar */}
        <div className="overflow-hidden rounded-full" style={{ backgroundColor: "#163524" }}>
          <div
            className="h-1 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(progress, 92)}%`,
              background: "linear-gradient(to right, #8B6914, #D4AF37, #F2C94C)",
              boxShadow: "0 0 8px 0px rgba(212,175,55,0.45)",
            }}
          />
        </div>

        {/* Progress meta */}
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-mono text-[9px]" style={{ color: "#2A4535" }}>
            AGENT-CORE/triage-worker-01
          </span>
          <span className="font-mono text-[10px] font-semibold" style={{ color: "#D4AF37" }}>
            {Math.round(Math.min(progress, 92))}%
          </span>
        </div>
      </div>

      {/* ── Footer ghost row ── */}
      <div
        className="mt-3 flex items-center gap-4 border-t pt-2.5"
        style={{ borderColor: "#1E4530" }}
      >
        <div className="h-2.5 w-24 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
        <div className="ml-auto h-2.5 w-32 animate-pulse rounded" style={{ backgroundColor: "#163524" }} />
      </div>
    </article>
  );
}
