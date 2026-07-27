import Link from "next/link";
import type { Metadata } from "next";
import { FeatureCard } from "@/components/FeatureCard";

export const metadata: Metadata = {
  title: "AI-SOC | Autonomous Security Operations",
  description:
    "AI-powered Security Operations Center utilizing multi-agent orchestration.",
};

// ---------------------------------------------------------------------------
// Metallic gold palette constants (referenced in inline styles)
// ---------------------------------------------------------------------------
const GOLD       = "#D4AF37";
const GOLD_DIM   = "#8B6914";
const GOLD_GLOW  = "rgba(212,175,55,0.30)";
const BG_CARD    = "rgba(10,26,16,0.70)";
const BORDER_DIM = "rgba(212,175,55,0.12)";
const BORDER_MID = "rgba(212,175,55,0.25)";
const SAGE       = "#8A9E8E";
const FOREST_DIM = "#1E4530";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 flex flex-col">

        {/* ════════════════════════════════════════════════════════════════
            HERO SECTION
            Left 61.8% — copy & CTA
            Right 38.2% — Agent Topology Knot SVG
        ════════════════════════════════════════════════════════════════ */}
        <section className="relative px-6 py-[6.854rem] overflow-hidden">

          {/* ── Section-level radial glow (behind hero content) ── */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 55% 70% at 72% 45%, rgba(212,175,55,0.04) 0%, transparent 65%)`,
            }}
          />

          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-8 relative">

            {/* ── 61.8% Primary Block ── */}
            <div className="w-full md:w-[61.8%] flex flex-col items-start text-left z-10">

              {/* H1 — metallic gold gradient */}
              <h1
                className="text-[4.236rem] leading-[1.1] font-bold tracking-tight mb-[1.618rem] bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(130deg, #F5F0E8 0%, ${GOLD} 48%, ${GOLD_DIM} 100%)`,
                }}
              >
                Autonomous<br />
                AI-SOC Platform
              </h1>

              <p
                className="text-[1rem] mb-[2.618rem] leading-relaxed max-w-lg"
                style={{ color: SAGE }}
              >
                Next-generation security operations utilizing multi-agent
                orchestration for zero-day threat triage and automated
                remediation pipelines.
              </p>

              {/* ── Gold CTA with metallic glow ── */}
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 rounded font-mono font-bold text-[0.875rem] tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 hover:brightness-110"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, #F0CB45 50%, ${GOLD_DIM} 100%)`,
                  color: "#041009",
                  boxShadow: `0 0 22px -4px ${GOLD_GLOW}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                INITIALIZE COMMAND CENTER
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              {/* Sub-label */}
              <p
                className="mt-4 font-mono text-[0.618rem] uppercase tracking-[0.2em]"
                style={{ color: "rgba(212,175,55,0.35)" }}
              >
                Multi-Agent Orchestration · Zero-Trust Architecture
              </p>
            </div>

            {/* ── 38.2% Secondary Block — Agent Topology Knot ── */}
            <div className="w-full md:w-[38.2%] flex justify-center items-center mt-12 md:mt-0 z-10">
              <AgentTopologyKnot />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            FEATURE GRID
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ borderTop: `1px solid ${FOREST_DIM}`, backgroundColor: "rgba(4,16,9,0.55)" }}>
          <div className="max-w-screen-xl mx-auto px-6 py-[6.854rem]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <FeatureCard
                iconColor="#60a5fa"
                iconBg="rgba(96,165,250,0.07)"
                iconBorder="rgba(96,165,250,0.14)"
                title="Intelligent"
                subtitle="Threat Triage"
                body="Deploy specialized AI agents to concurrently investigate inbound alerts, drastically reducing MTTD."
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                }
              />

              <FeatureCard
                iconColor="#c084fc"
                iconBg="rgba(192,132,252,0.07)"
                iconBorder="rgba(192,132,252,0.14)"
                title="Vector"
                subtitle="Enrichment"
                body="Automatically enrich IOCs with global threat intelligence and deep behavioral vector analysis."
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                }
              />

              <FeatureCard
                iconColor={GOLD}
                iconBg="rgba(212,175,55,0.07)"
                iconBorder="rgba(212,175,55,0.18)"
                title="Automated"
                subtitle="Mitigation"
                body="Execute dynamic remediation playbooks to contain active threats in milliseconds, not minutes."
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                }
              />

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AgentTopologyKnot — Server Component (no event handlers / state)
//
// An architectural SVG diagram of the three-agent mesh:
//   Node A (top-right)   — Threat Triage
//   Node B (bottom-left) — Splunk Vector Enrichment
//   Node C (bottom-right) — Active Response
//
// Connections are cubic Bézier paths with a CSS strokeDasharray animation
// defined via a <style> tag embedded in the SVG so the file stays Server-safe.
// The outer ring and nodes are fixed; connection lines pulse to convey
// live data routing between agents.
// ---------------------------------------------------------------------------

function AgentTopologyKnot() {
  // Node positions within a 400×420 viewBox
  const nodes = [
    { id: "triage",   cx: 285, cy:  80, label: "Threat Triage",            sublabel: "AGENT-01" },
    { id: "splunk",   cx:  80, cy: 310, label: "Splunk Vector Enrichment",  sublabel: "AGENT-02" },
    { id: "response", cx: 320, cy: 340, label: "Active Response",            sublabel: "AGENT-03" },
  ] as const;

  // Cubic Bézier connections — each pair uses carefully tuned control points
  // to create an elegant "knot" rather than straight lines.
  const connections = [
    {
      id: "ab",
      d: "M 285 80 C 340 180, 60 140, 80 310",
      delay: "0s",
      color: "rgba(212,175,55,0.55)",
    },
    {
      id: "bc",
      d: "M 80 310 C 60 420, 360 420, 320 340",
      delay: "0.6s",
      color: "rgba(212,175,55,0.45)",
    },
    {
      id: "ca",
      d: "M 320 340 C 420 260, 360 40, 285 80",
      delay: "1.2s",
      color: "rgba(212,175,55,0.50)",
    },
    // Cross-link for the knot effect
    {
      id: "ac-cross",
      d: "M 285 80 C 120 120, 200 360, 320 340",
      delay: "0.3s",
      color: "rgba(212,175,55,0.22)",
    },
  ] as const;

  return (
    <div
      className="relative w-full max-w-[440px]"
      style={{ filter: "drop-shadow(0 0 40px rgba(212,175,55,0.08))" }}
    >
      <svg
        viewBox="0 0 400 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label="Multi-agent mesh topology diagram"
        overflow="visible"
      >
        {/* ── Embedded animation keyframes ── */}
        <style>{`
          @keyframes dash-flow {
            0%   { stroke-dashoffset: 200; opacity: 0.3; }
            50%  { opacity: 1; }
            100% { stroke-dashoffset: 0;   opacity: 0.3; }
          }
          @keyframes dash-flow-slow {
            0%   { stroke-dashoffset: 200; }
            100% { stroke-dashoffset: 0;   }
          }
          @keyframes node-breathe {
            0%, 100% { opacity: 0.15; r: 28; }
            50%       { opacity: 0.30; r: 32; }
          }
          @keyframes ring-rotate {
            from { transform: rotate(0deg);   }
            to   { transform: rotate(360deg); }
          }
          @keyframes dot-ping {
            0%, 100% { transform: scale(1);   opacity: 0.8; }
            50%       { transform: scale(1.5); opacity: 0.4; }
          }
          .conn-path {
            stroke-dasharray: 6 14;
            animation: dash-flow 3s linear infinite;
          }
          .conn-base {
            stroke-dasharray: none;
          }
          .node-halo {
            animation: node-breathe 3s ease-in-out infinite;
          }
          .outer-ring {
            transform-origin: 200px 200px;
            animation: ring-rotate 120s linear infinite;
          }
          .inner-ring {
            transform-origin: 200px 200px;
            animation: ring-rotate 80s linear infinite reverse;
          }
        `}</style>

        {/* ── Background: outer orbital rings (reference grid) ── */}
        <circle
          className="outer-ring"
          cx="200" cy="200" r="185"
          stroke="rgba(212,175,55,0.04)"
          strokeWidth="0.6"
          strokeDasharray="4 12"
        />
        <circle
          className="inner-ring"
          cx="200" cy="200" r="130"
          stroke="rgba(212,175,55,0.03)"
          strokeWidth="0.5"
          strokeDasharray="2 8"
        />

        {/* ── Fibonacci spiral in the background of the knot ── */}
        <g opacity="0.07" stroke={GOLD} strokeWidth="0.8">
          <path d="M 200 200 A 80 80 0 0 0 200 120" />
          <path d="M 200 120 A 50 50 0 0 0 150 170" />
          <path d="M 150 170 A 30 30 0 0 0 180 200" />
          <path d="M 180 200 A 18 18 0 0 0 200 182" />
        </g>

        {/* ── Connection BASE lines (faint, static) ── */}
        {connections.map((c) => (
          <path
            key={`base-${c.id}`}
            d={c.d}
            stroke={c.color.replace("0.55", "0.12").replace("0.45", "0.10").replace("0.50", "0.11").replace("0.22", "0.07")}
            strokeWidth="1"
          />
        ))}

        {/* ── Connection ANIMATED dash lines (data flow) ── */}
        {connections.map((c) => (
          <path
            key={`anim-${c.id}`}
            className="conn-path"
            d={c.d}
            stroke={c.color}
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ animationDelay: c.delay }}
          />
        ))}

        {/* ── Nodes ── */}
        {nodes.map((n) => (
          <g key={n.id}>
            {/* Breathing halo */}
            <circle
              className="node-halo"
              cx={n.cx}
              cy={n.cy}
              r="28"
              fill={GOLD}
              style={{ animationDelay: n.id === "triage" ? "0s" : n.id === "splunk" ? "1s" : "2s" }}
            />

            {/* Outer ring */}
            <circle
              cx={n.cx}
              cy={n.cy}
              r="20"
              stroke={GOLD}
              strokeWidth="0.8"
              fill="none"
              opacity="0.35"
            />

            {/* Inner node disc */}
            <circle
              cx={n.cx}
              cy={n.cy}
              r="12"
              fill="#041009"
              stroke={GOLD}
              strokeWidth="1.2"
            />

            {/* Node centre dot */}
            <circle
              cx={n.cx}
              cy={n.cy}
              r="3"
              fill={GOLD}
            />

            {/* Label — placed to avoid overlap */}
            <text
              x={n.id === "splunk" ? n.cx + 26 : n.cx - 26}
              y={n.cy - 6}
              fill="#F5F0E8"
              fontSize="8"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
              textAnchor={n.id === "splunk" ? "start" : "end"}
            >
              {n.label}
            </text>
            <text
              x={n.id === "splunk" ? n.cx + 26 : n.cx - 26}
              y={n.cy + 6}
              fill={GOLD}
              fontSize="6.5"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="400"
              textAnchor={n.id === "splunk" ? "start" : "end"}
              opacity="0.7"
            >
              {n.sublabel}
            </text>
          </g>
        ))}

        {/* ── Central hub node (Orchestration Core) ── */}
        <g>
          <circle
            cx="200" cy="210" r="14"
            fill="#041009"
            stroke={GOLD}
            strokeWidth="1"
            opacity="0.55"
          />
          <circle
            cx="200" cy="210" r="4"
            fill={GOLD}
            opacity="0.6"
          />
          <text
            x="200" y="234"
            fill={GOLD}
            fontSize="6"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            opacity="0.45"
          >
            ORCHESTRATOR
          </text>
        </g>

        {/* ── Data packet markers — small gold diamonds travelling the paths ── */}
        {/* Simulated via small animated circles near the paths */}
        <circle cx="285" cy="160" r="2" fill={GOLD} opacity="0.7">
          <animate
            attributeName="cy"
            values="160;240;310"
            dur="3s"
            repeatCount="indefinite"
            begin="0s"
          />
          <animate
            attributeName="cx"
            values="285;185;80"
            dur="3s"
            repeatCount="indefinite"
            begin="0s"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="80" cy="310" r="2" fill={GOLD} opacity="0.7">
          <animate
            attributeName="cy"
            values="310;340;340"
            dur="3s"
            repeatCount="indefinite"
            begin="0.6s"
          />
          <animate
            attributeName="cx"
            values="80;200;320"
            dur="3s"
            repeatCount="indefinite"
            begin="0.6s"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="3s"
            repeatCount="indefinite"
            begin="0.6s"
          />
        </circle>
        <circle cx="320" cy="340" r="2" fill={GOLD} opacity="0.7">
          <animate
            attributeName="cy"
            values="340;210;80"
            dur="3s"
            repeatCount="indefinite"
            begin="1.2s"
          />
          <animate
            attributeName="cx"
            values="320;300;285"
            dur="3s"
            repeatCount="indefinite"
            begin="1.2s"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="3s"
            repeatCount="indefinite"
            begin="1.2s"
          />
        </circle>

        {/* ── Corner telemetry labels ── */}
        <text x="8" y="412" fill={GOLD} fontSize="5.5" fontFamily="'JetBrains Mono', monospace" opacity="0.3">
          AI-SOC/MESH-TOPOLOGY v2
        </text>
        <text x="392" y="412" fill={GOLD} fontSize="5.5" fontFamily="'JetBrains Mono', monospace" textAnchor="end" opacity="0.3">
          Φ 1.618
        </text>
      </svg>
    </div>
  );
}
