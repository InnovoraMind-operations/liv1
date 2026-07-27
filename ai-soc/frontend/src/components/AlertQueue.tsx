"use client";

// ---------------------------------------------------------------------------
// Inbound Alert Queue (Client Component)
// Fetches and renders the full alert list from /api/alerts.
//
// v2 additions — Demo / Presentation mode:
//   • mockAlerts state layer overlaid on top of API data
//   • injectMockAlert() — appends a hardcoded CRITICAL brute-force payload
//   • "Simulate Threat" trigger button in the SectionHeader
//   • dismissAlert(id) — removes an alert (mock or real) from the rendered list
//   • AlertCard receives onDismiss prop to drive its fade-out animation
// ---------------------------------------------------------------------------

import { useEffect, useState, useCallback } from "react";
import { fetchAlerts } from "@/lib/api";
import { AlertCard } from "./AlertCard";
import { TriageLoader } from "./TriageLoader";
import type { AlertsResponse, Incident } from "@/types";

// ---------------------------------------------------------------------------
// Mock alert factory — returns a fresh CRITICAL brute-force incident
// ---------------------------------------------------------------------------

function buildMockAlert(): Incident {
  return {
    id:                   `MOCK-${Date.now()}`,
    timestamp:            new Date().toISOString(),
    source:               "SSH Auth Monitor",
    event_type:           "Brute Force Anomaly",
    severity:             "critical",
    status:               "new",
    description:          "45 consecutive failed SSH logins for 'root' from 185.220.101.47.",
    affected_host:        "prod-bastion-01",
    agent_recommendation: "Execute iptables IP drop",
  };
}

// ---------------------------------------------------------------------------
// AlertQueue
// ---------------------------------------------------------------------------

export function AlertQueue() {
  const [data,       setData]       = useState<AlertsResponse | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [mockAlerts, setMockAlerts] = useState<Incident[]>([]);
  // Tracks IDs dismissed by the operator (hides them from the API list too)
  const [dismissed,  setDismissed]  = useState<Set<string>>(new Set());

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

  // ── Dismiss handler (called after AlertCard fade-out animation) ───────────
  const dismissAlert = useCallback((id: string) => {
    setMockAlerts((prev) => prev.filter((a) => a.id !== id));
    setDismissed((prev) => new Set(prev).add(id));
  }, []);

  // ── Merge mock + API lists for rendering ──────────────────────────────────
  const apiAlerts: Incident[] = (data?.alerts ?? []).filter(
    (a) => !dismissed.has(a.id)
  );
  const allAlerts: Incident[] = [...mockAlerts, ...apiAlerts];
  const totalCount            = allAlerts.length;

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Inbound Alert Queue"
          count={0}
          status="offline"
          onSimulate={injectMockAlert}
        />
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16"
          style={{ borderColor: "#1E4530" }}
        >
          <p className="font-mono text-sm animate-pulse" style={{ color: "#3D5C46" }}>
            LOADING ALERTS...
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
          title="Inbound Alert Queue"
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
        title="Inbound Alert Queue"
        count={totalCount}
        status="online"
        onSimulate={injectMockAlert}
      />

      {allAlerts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16"
          style={{ borderColor: "#1E4530" }}
        >
          <p className="font-mono text-sm" style={{ color: "#6DB872" }}>
            ✓ QUEUE CLEAR — No active alerts
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* ── Active Triage Demo Slot ──
               Remove this <TriageLoader /> block once real agent integration is wired up. */}
          <TriageLoader />

          {allAlerts.map((incident, index) => (
            <AlertCard
              key={incident.id}
              incident={incident}
              index={index}
              onDismiss={dismissAlert}
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
            {count} ACTIVE
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
            color: "rgba(212,175,55,0.55)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#D4AF37";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.45)";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(212,175,55,0.08)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 10px -4px rgba(212,175,55,0.25)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(212,175,55,0.55)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.20)";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(212,175,55,0.04)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
          }}
          title="Inject a mock CRITICAL brute-force alert for demo purposes"
        >
          {/* Zap icon */}
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Simulate Threat
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
