"use client";

// ---------------------------------------------------------------------------
// ThreatLevelBar — extracted client sub-component
// 5-segment visual threat indicator. Relocated from HeaderStatusBar into the
// Command Dashboard title row for zero-clutter header architecture.
// Forest Green × Gold executive theme.
// ---------------------------------------------------------------------------

export function ThreatLevelBar() {
  const segments = [
    { active: true,  color: "#4CAF50" }, // green  — Guarded
    { active: true,  color: "#D4AF37" }, // gold   — Elevated (pulsing)
    { active: false, color: "#1E4530" }, // dark   — High
    { active: false, color: "#1E4530" }, // dark   — Severe
    { active: false, color: "#1E4530" }, // dark   — Critical
  ];

  return (
    <div
      className="flex items-center gap-2 rounded border px-3 py-1.5"
      style={{
        borderColor: "rgba(212,175,55,0.18)",
        backgroundColor: "rgba(212,175,55,0.04)",
      }}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: "#3D5C46" }}
      >
        Threat
      </span>

      {/* 5-segment bar */}
      <div className="flex gap-1">
        {segments.map(({ active, color }, i) => (
          <div
            key={i}
            className={`h-3 w-5 rounded-sm${i === 1 && active ? " animate-pulse" : ""}`}
            style={{ backgroundColor: color, opacity: active ? 1 : 0.3 }}
          />
        ))}
      </div>

      <span
        className="font-mono text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: "#D4AF37" }}
      >
        ELEVATED
      </span>
    </div>
  );
}
