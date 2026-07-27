"use client";

// ---------------------------------------------------------------------------
// Header Status Bar — Dashboard (Client Component)
// Forest Green × Gold executive theme.
//
// v3 — Pruned to brand-only anchor bar:
//   • Removed: Threat Level indicator (relocated to Command Dashboard title row)
//   • Removed: API CONNECTED / Last sync pill (redundant to Navbar telemetry)
//   • Removed: SECURE SESSION badge (redundant noise)
//   • Removed: TERMINATE SESSION button (relocated to Command Dashboard title row)
//   • Kept:    AI-SOC brand mark — persistent top-of-page identity anchor
// ---------------------------------------------------------------------------

export function HeaderStatusBar() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: "rgba(10,31,21,0.95)",
        borderColor: "#1E4530",
      }}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center px-6 py-3">

        {/* ── Brand ── */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded ring-1"
            style={{
              backgroundColor: "rgba(212,175,55,0.08)",
              boxShadow: "0 0 0 1px rgba(212,175,55,0.25)",
            }}
          >
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
          <div>
            <p className="font-mono text-sm font-semibold tracking-widest" style={{ color: "#F5F0E8" }}>
              AI<span style={{ color: "#D4AF37" }}>-SOC</span>
            </p>
            <p className="font-mono text-[10px] tracking-wider" style={{ color: "#3D5C46" }}>
              SECURITY OPERATIONS CENTER
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
