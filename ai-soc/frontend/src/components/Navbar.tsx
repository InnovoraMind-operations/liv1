import Link from "next/link";
import { cookies } from "next/headers";

// ---------------------------------------------------------------------------
// Unified Live Telemetry Badge Data
// Single source of truth for ALL six system indicators shown in the
// consolidated status bar (replaces the duplicated "LIVE SYSTEMS" bars).
// ---------------------------------------------------------------------------

const TELEMETRY_BADGES = [
  { id: "api",          label: "API",          ok: true  },
  { id: "db",           label: "DB",           ok: true  },
  { id: "agent-core",   label: "AGENT CORE",   ok: true  },
  { id: "backend",      label: "BACKEND",      ok: true  },
  { id: "alert-queue",  label: "ALERT QUEUE",  ok: true  },
  { id: "log-ingestion",label: "LOG INGESTION",ok: false },
] as const;

// ---------------------------------------------------------------------------
// Shared badge component (used here and importable by HeaderStatusBar)
// ---------------------------------------------------------------------------

export function TelemetryBadge({
  label,
  ok,
}: {
  label: string;
  ok: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "cursor-default transition-all duration-300 ease-in-out group/badge",
        ok
          ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 hover:bg-amber-500/10"
          : "border-stone-700/40 bg-stone-900/20",
      ].join(" ")}
    >
      {/* Gold pulsing dot — two-layer radar effect */}
      <span className="relative flex h-2 w-2 items-center justify-center">
        {ok && (
          <span className="animate-gold-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50" />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            ok ? "bg-amber-400" : "bg-stone-600"
          }`}
        />
      </span>
      <span
        className={[
          "font-mono text-[9px] font-semibold uppercase tracking-widest transition-colors duration-200",
          ok
            ? "text-amber-400/80 group-hover/badge:text-amber-300"
            : "text-stone-600",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export default async function Navbar() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("soc_session");

  return (
    <nav
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: "rgba(10,31,21,0.92)",
        borderColor: "#1E4530",
      }}
    >
      {/* ── Primary navigation row ── */}
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="flex h-8 w-8 items-center justify-center rounded ring-1 transition-all duration-300 ease-in-out group-hover:shadow-[0_0_14px_-2px_rgba(212,175,55,0.45)]"
            style={{
              backgroundColor: "rgba(212,175,55,0.08)",
              borderColor: "rgba(212,175,55,0.25)",
              boxShadow: "0 0 14px -2px rgba(212,175,55,0.25)",
            }}
          >
            {/* Shield-check icon */}
            <svg
              className="h-4 w-4"
              style={{ color: "#D4AF37" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <span
            className="font-mono text-sm font-bold tracking-widest uppercase transition-colors duration-300"
            style={{ color: "#F5F0E8" }}
          >
            AI<span style={{ color: "#D4AF37" }}>-SOC</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {[
            { href: "/docs",      label: "Documentation" },
            { href: "/api-docs",  label: "API Docs"      },
            {
              href: hasSession ? "/dashboard" : "/login",
              label: "Command Center",
            },
            { href: "/settings",  label: "Settings"      },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-colors duration-200 hover:text-amber-400"
              style={{ color: "#8A9E8E" }}
            >
              {label}
            </Link>
          ))}

          {/* Auth actions */}
          <div
            className="ml-4 flex items-center gap-3 pl-4 border-l"
            style={{ borderColor: "#1E4530" }}
          >
            {hasSession ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-mono font-bold tracking-widest rounded transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "#D4AF37",
                  color: "#0A1F15",
                  boxShadow: "0 0 18px -4px rgba(212,175,55,0.45)",
                }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium transition-colors duration-200 hover:text-amber-300"
                  style={{ color: "#8A9E8E" }}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-mono font-bold tracking-widest rounded transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "#D4AF37",
                    color: "#0A1F15",
                    boxShadow: "0 0 18px -4px rgba(212,175,55,0.45)",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Unified Telemetry Status Row ──
           Single bar showing all six system indicators.
           The HeaderStatusBar's duplicate "Live Systems" sub-bar
           is replaced by this authoritative row. */}
      <div
        className="border-t px-6 py-1.5"
        style={{ borderColor: "rgba(30,69,48,0.5)", backgroundColor: "rgba(15,42,28,0.5)" }}
      >
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-1.5">
          {/* Label */}
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] mr-2" style={{ color: "#3D5C46" }}>
            Live Systems
          </span>
          <div className="h-3 w-px mr-2" style={{ backgroundColor: "#1E4530" }} />

          {/* All six badges */}
          {TELEMETRY_BADGES.map(({ id, label, ok }) => (
            <TelemetryBadge key={id} label={label} ok={ok} />
          ))}

          {/* Trailing nominal indicator */}
          <span
            className="ml-auto font-mono text-[9px] tracking-wider hidden sm:block"
            style={{ color: "#2A4535" }}
          >
            ALL SYSTEMS NOMINAL
          </span>
        </div>
      </div>
    </nav>
  );
}
