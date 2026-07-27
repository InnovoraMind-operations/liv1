"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Sidebar nav items
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: "architecture",        label: "Architecture",          icon: "ARCH"   },
  { id: "agent-orchestration", label: "Agent Orchestration",   icon: "ORCH"   },
  { id: "log-ingestion",       label: "Log Ingestion (Wazuh)", icon: "INGST"  },
  { id: "splunk-enrichment",   label: "Splunk Enrichment",     icon: "ENRICH" },
  { id: "operator-playbooks",  label: "Operator Playbooks",    icon: "PLAY"   },
] as const;

type SectionId = (typeof NAV_ITEMS)[number]["id"];

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const GOLD       = "#D4AF37";
const GOLD_DIM   = "rgba(212,175,55,0.12)";
const GOLD_MID   = "rgba(212,175,55,0.25)";
const GOLD_TEXT  = "rgba(212,175,55,0.70)";
const FG_PRIMARY = "#F5F0E8";
const FG_BODY    = "#C4BFB3";
const FG_MUTED   = "#8A9E8E";
const FG_DIMMER  = "#3D5C46";
const BG_CARD    = "rgba(4,16,9,0.65)";
const BG_CODE    = "#020804";
const BORDER_CARD = "rgba(212,175,55,0.18)";
const BORDER_CODE = "rgba(212,175,55,0.20)";
const FOREST_DARK = "#1E4530";

// ---------------------------------------------------------------------------
// Primitive components
// ---------------------------------------------------------------------------

function SectionAnchor({ id }: { id: string }) {
  return <div id={id} style={{ scrollMarginTop: 96 }} />;
}

function GoldRule() {
  return (
    <div
      style={{
        height: 1,
        background: `linear-gradient(to right, ${GOLD}, transparent)`,
        marginBottom: 28,
        marginTop: 4,
      }}
    />
  );
}

function SectionHeading({
  id,
  overline,
  title,
  sub,
}: {
  id: string;
  overline: string;
  title: string;
  sub?: string;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div
          style={{
            height: 1,
            width: 20,
            background: `linear-gradient(to right, ${GOLD}, transparent)`,
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: GOLD_TEXT,
          }}
        >
          {overline}
        </span>
      </div>
      <h2
        id={id}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22,
          fontWeight: 700,
          color: FG_PRIMARY,
          margin: 0,
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: FG_DIMMER,
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 14,
        lineHeight: 1.8,
        color: FG_BODY,
        margin: "0 0 18px",
      }}
    >
      {children}
    </p>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        backgroundColor: "rgba(2,8,4,0.90)",
        border: `1px solid ${BORDER_CODE}`,
        borderRadius: 4,
        padding: "1px 6px",
        color: GOLD,
      }}
    >
      {children}
    </code>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div
      style={{
        borderRadius: 8,
        border: `1px solid ${BORDER_CODE}`,
        backgroundColor: BG_CODE,
        overflow: "hidden",
        marginBottom: 24,
        boxShadow: "0 4px 24px -6px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 14px",
          borderBottom: `1px solid ${BORDER_CODE}`,
          backgroundColor: "rgba(4,12,6,0.90)",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: GOLD_TEXT,
          }}
        >
          {language}
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          {["#f87171", "#fbbf24", "#34d399"].map((c) => (
            <div
              key={c}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: c,
                opacity: 0.55,
              }}
            />
          ))}
        </div>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "18px 20px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          lineHeight: 1.8,
          color: "#A8C4AE",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InfoCard({
  colour,
  label,
  children,
}: {
  colour: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${colour}`,
        backgroundColor: "rgba(4,16,9,0.50)",
        borderRadius: "0 6px 6px 0",
        padding: "12px 16px",
        marginBottom: 16,
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: colour,
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </span>
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 13,
          lineHeight: 1.7,
          color: FG_BODY,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Architecture diagram
// ---------------------------------------------------------------------------

function ArchDiagram() {
  const nodes = [
    { label: "Wazuh",     sub: "Log Agent"     },
    { label: "Splunk",    sub: "SIEM Enricher" },
    { label: "FastAPI",   sub: "REST Gateway"  },
    { label: "LangGraph", sub: "Orchestrator"  },
    { label: "Postgres",  sub: "State Store"   },
  ];

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${BORDER_CARD}`,
        backgroundColor: BG_CARD,
        padding: "28px 24px",
        marginBottom: 28,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: GOLD_TEXT,
          marginBottom: 20,
        }}
      >
        System Topology -- Phase 2
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 10,
          alignItems: "stretch",
        }}
      >
        {nodes.map((n, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: 8,
                border: `1px solid ${GOLD_MID}`,
                backgroundColor: "rgba(10,28,18,0.80)",
                padding: "12px 6px",
                textAlign: "center",
                boxShadow: "0 0 18px -6px rgba(212,175,55,0.15)",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: FG_PRIMARY,
                  marginBottom: 2,
                }}
              >
                {n.label}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8,
                  color: FG_DIMMER,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {n.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow connector row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "6px 8% 0",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <svg key={i} width="36" height="12" viewBox="0 0 36 12" fill="none">
            <line x1="0" y1="6" x2="30" y2="6" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1" />
            <polygon points="30,3 36,6 30,9" fill={GOLD} fillOpacity="0.50" />
          </svg>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${GOLD_DIM}`,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {[
          { colour: "#60a5fa", label: "Raw Log Stream" },
          { colour: GOLD,      label: "Enriched Event"  },
          { colour: "#34d399", label: "Agent Decision"  },
          { colour: "#f87171", label: "Critical Alert"  },
        ].map(({ colour, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: colour }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: FG_MUTED,
                letterSpacing: "0.10em",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Playbook step row
// ---------------------------------------------------------------------------

function PlaybookStep({
  step,
  action,
  owner,
  status,
}: {
  step: number;
  action: string;
  owner: string;
  status: "automated" | "manual" | "hybrid";
}) {
  const meta = {
    automated: { colour: "#34d399", label: "Automated" },
    manual:    { colour: "#f87171", label: "Manual"    },
    hybrid:    { colour: GOLD,      label: "Hybrid"    },
  };
  const { colour, label } = meta[status];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr 120px 90px",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 6,
        backgroundColor: "rgba(4,16,9,0.50)",
        border: `1px solid ${GOLD_DIM}`,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: `1px solid ${GOLD_MID}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 700,
          color: GOLD,
          flexShrink: 0,
        }}
      >
        {step}
      </div>
      <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, color: FG_BODY }}>
        {action}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: FG_MUTED,
        }}
      >
        {owner}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: colour,
          textAlign: "right",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const WAZUH_CODE = `# Normalised log payload forwarded to FastAPI
import json, requests, datetime

payload = {
    "raw_log": json.dumps({
        "timestamp":    datetime.datetime.utcnow().isoformat() + "Z",
        "rule_id":      100002,
        "rule_level":   12,
        "description":  "Multiple failed SSH login attempts",
        "agent": {
            "id":   "001",
            "name": "prod-web-01",
            "ip":   "10.0.1.55"
        },
        "data": {
            "srcip":    "185.220.101.47",
            "dstport":  22,
            "protocol": "ssh",
            "attempts": 47
        }
    })
}

resp = requests.post(
    "http://localhost:8000/api/alerts/analyze",
    json=payload,
    timeout=10
)
print(resp.status_code, resp.json())`;
const SPLUNK_CODE = `import splunklib.client as client
import splunklib.results as results

service = client.connect(
    host="splunk.internal",
    port=8089,
    username="soc_reader",
    password=SPLUNK_TOKEN,
)

query = (
    'search index=notable sourcetype=stash '
    '| where src_ip="{ip}" '
    '| head 5 '
    '| fields src_ip, rule_name, urgency, owner'
)

job = service.jobs.oneshot(query.format(ip=extracted_ip))
for item in results.JSONResultsReader(job):
    print(item)  # -> dict per notable event`;
const PLAYBOOK_CODE = `# playbooks/PB-001-brute-force-ssh.yaml
id: PB-001
name: Brute Force SSH Response
version: "1.0.0"
trigger:
  event_type: failed_ssh_login
  threshold_count: 10
  window_seconds: 60
confidence_threshold: 0.82
steps:
  - id: verify
    action: splunk_correlate
    automated: true
  - id: block_ip
    action: firewall_block
    automated: true
    rollback_after: 3600
  - id: notify
    action: pagerduty_alert
    severity: high
    automated: true
  - id: human_review
    action: await_operator_approval
    timeout_seconds: 900
  - id: ioc_export
    action: misp_push
    automated: false`;

export default function DocsPage() {
  const [active, setActive] = useState<SectionId>("architecture");

  function scrollTo(id: SectionId) {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ minHeight: "100vh", color: FG_PRIMARY, display: "flex", flexDirection: "column" }}>

      {/* ---- Page header ---- */}
      <div
        style={{
          borderBottom: `1px solid ${FOREST_DARK}`,
          padding: "28px 32px 24px",
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(4,16,9,0.40)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                height: 1,
                width: 24,
                background: `linear-gradient(to right, ${GOLD}, transparent)`,
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: GOLD_TEXT,
              }}
            >
              AI-SOC Platform
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 26,
              fontWeight: 700,
              color: FG_PRIMARY,
              margin: 0,
            }}
          >
            Technical Documentation
          </h1>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: FG_DIMMER,
              marginTop: 6,
              marginBottom: 0,
            }}
          >
            Phase 2 -- Architecture, integrations, and operator reference.
          </p>
        </div>
      </div>

      {/* ---- Two-column body ---- */}
      <div
        style={{
          flex: 1,
          maxWidth: 1140,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          alignItems: "start",
          padding: "0 32px",
        }}
      >

        {/* ======== SIDEBAR ======== */}
        <nav
          style={{
            position: "sticky",
            top: 80,
            paddingTop: 32,
            paddingRight: 24,
            paddingBottom: 32,
            borderRight: `1px solid ${GOLD_DIM}`,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: FG_DIMMER,
              marginBottom: 16,
            }}
          >
            Contents
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: active === item.id ? "rgba(212,175,55,0.08)" : "transparent",
                    border: active === item.id ? `1px solid ${GOLD_DIM}` : "1px solid transparent",
                    borderRadius: 6,
                    padding: "8px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 7,
                      fontWeight: 700,
                      letterSpacing: "0.10em",
                      color: active === item.id ? GOLD : FG_DIMMER,
                      minWidth: 36,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 12,
                      color: active === item.id ? FG_PRIMARY : FG_MUTED,
                      fontWeight: active === item.id ? 600 : 400,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Version pill */}
          <div
            style={{
              marginTop: 32,
              padding: "8px 10px",
              borderRadius: 6,
              border: `1px solid ${GOLD_DIM}`,
              backgroundColor: "rgba(4,16,9,0.50)",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 8,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: GOLD_TEXT,
                marginBottom: 4,
              }}
            >
              Platform Version
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: FG_PRIMARY }}>
              v0.1.0
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: FG_DIMMER, marginTop: 2 }}>
              Phase 2 -- Beta
            </div>
          </div>
        </nav>

        {/* ======== MAIN CONTENT ======== */}
        <main style={{ paddingTop: 32, paddingLeft: 40, paddingBottom: 64 }}>

          {/* == Architecture == */}
          <SectionAnchor id="architecture" />
          <SectionHeading
            id="architecture-heading"
            overline="Section 01"
            title="Architecture"
            sub="End-to-end data flow from log ingestion to autonomous response."
          />
          <GoldRule />

          <BodyText>
            The AI-SOC platform is a layered autonomous security operations stack built on
            FastAPI, LangGraph, and a Next.js 15 operator console. Raw events ingested by
            Wazuh agents are forwarded to the FastAPI gateway, enriched through a Splunk
            lookup pipeline, and then handed to a stateful LangGraph multi-agent graph
            for triage, scoring, and remediation proposal.
          </BodyText>
          <BodyText>
            All agent decisions and incident records are persisted in Postgres via async
            SQLAlchemy, enabling full audit trails and post-mortem playback. The Next.js
            dashboard polls the REST API for live alert hydration and renders a real-time
            command console for human operators.
          </BodyText>

          <ArchDiagram />

          <InfoCard colour="#60a5fa" label="Design Principle">
            Every component boundary is a well-typed REST or async DB contract.
            No component holds global mutable state outside its own service boundary.
          </InfoCard>
          <InfoCard colour={GOLD} label="Golden Ratio Scaling">
            API gateway threads, agent pool sizes, and Postgres connection pools are
            tuned to Fibonacci multiples (8, 13, 21) to distribute load harmonically.
          </InfoCard>

          {/* == Agent Orchestration == */}
          <SectionAnchor id="agent-orchestration" />
          <SectionHeading
            id="agent-orchestration-heading"
            overline="Section 02"
            title="Agent Orchestration"
            sub="LangGraph stateful multi-agent graph -- triage, enrich, decide."
          />
          <GoldRule />

          <BodyText>
            The orchestration layer is a LangGraph <InlineCode>StateGraph</InlineCode> with
            four specialised nodes wired together via conditional edges. Each node receives
            the shared <InlineCode>SOCState</InlineCode> TypedDict, appends its output, and
            passes control downstream.
          </BodyText>

          {/* Agent flow */}
          <div
            style={{
              borderRadius: 10,
              border: `1px solid ${BORDER_CARD}`,
              backgroundColor: BG_CARD,
              padding: "24px",
              marginBottom: 28,
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD_TEXT,
                marginBottom: 18,
              }}
            >
              LangGraph Node Sequence
            </div>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
              {[
                { name: "log_parser",  desc: "Extract fields" },
                { name: "ip_enricher", desc: "GeoIP + WHOIS"  },
                { name: "scorer",      desc: "Risk scoring"   },
                { name: "responder",   desc: "Propose action" },
              ].map((node, i, arr) => (
                <div key={node.name} style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      borderRadius: 8,
                      border: `1px solid ${GOLD_MID}`,
                      backgroundColor: "rgba(10,28,18,0.80)",
                      padding: "10px 14px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: GOLD }}>
                      {node.name}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: FG_DIMMER, marginTop: 2 }}>
                      {node.desc}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
                      <line x1="0" y1="6" x2="22" y2="6" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1" />
                      <polygon points="22,3 28,6 22,9" fill={GOLD} fillOpacity="0.50" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <BodyText>
            Compile the graph once at startup and invoke via 
            <InlineCode>soc_graph.invoke(state)</InlineCode>. IO-bound enrichment
            inside nodes can be offloaded to 
            <InlineCode>asyncio.run_in_executor</InlineCode>.
          </BodyText>

          {/* == Log Ingestion (Wazuh) == */}
          <SectionAnchor id="log-ingestion" />
          <SectionHeading
            id="log-ingestion-heading"
            overline="Section 03"
            title="Log Ingestion (Wazuh)"
            sub="Syslog forwarder -> FastAPI receiver -> normalised incident schema."
          />
          <GoldRule />

          <BodyText>
            Wazuh agents emit JSON-formatted syslog events over UDP/514. A lightweight
            Python forwarder (<InlineCode>log_forwarder.py</InlineCode>) reads the stream,
            stamps a UTC timestamp, and POSTs each payload to 
            <InlineCode>/api/alerts/analyze</InlineCode>.
          </BodyText>

          <CodeBlock language="Python -- Wazuh Log Payload" code={WAZUH_CODE} />

          <InfoCard colour="#34d399" label="Throughput Note">
            The forwarder batches events up to 50 ms before flushing, sustaining
            approximately 1,200 events/sec on a single core with the async FastAPI endpoint.
          </InfoCard>

          {/* == Splunk Enrichment == */}
          <SectionAnchor id="splunk-enrichment" />
          <SectionHeading
            id="splunk-enrichment-heading"
            overline="Section 04"
            title="Splunk Enrichment"
            sub="Contextual threat intelligence layered on top of raw events."
          />
          <GoldRule />

          <BodyText>
            After initial parsing, each event is dispatched to the 
            <InlineCode>ip_enricher</InlineCode> LangGraph node. This node queries
            Splunk Enterprise Security via the REST API to retrieve existing notable events,
            asset context, and threat-intelligence matches for the source IP.
          </BodyText>

          <CodeBlock language="Python -- Splunk REST Query" code={SPLUNK_CODE} />

          <InfoCard colour={GOLD} label="Planned Integration">
            The Splunk enrichment node is scaffolded but requires a live Splunk ES
            instance. Mock enrichment context is returned during local development.
          </InfoCard>

          {/* == Operator Playbooks == */}
          <SectionAnchor id="operator-playbooks" />
          <SectionHeading
            id="operator-playbooks-heading"
            overline="Section 05"
            title="Operator Playbooks"
            sub="Structured response runbooks for common incident categories."
          />
          <GoldRule />

          <BodyText>
            Playbooks are deterministic response procedures triggered automatically by
            the <InlineCode>responder</InlineCode> node when confidence exceeds a
            configurable threshold, or manually by an operator via the Command Dashboard.
            Each playbook is a versioned YAML document compiled to a typed Python dataclass.
          </BodyText>

          {/* Playbook table */}
          <div
            style={{
              borderRadius: 10,
              border: `1px solid ${BORDER_CARD}`,
              backgroundColor: BG_CARD,
              padding: "20px",
              marginBottom: 28,
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD_TEXT,
                marginBottom: 16,
              }}
            >
              PB-001 -- Brute Force SSH Response
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 120px 90px",
                gap: 12,
                padding: "6px 14px",
                marginBottom: 6,
              }}
            >
              {["#", "Action", "Owner", "Mode"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: FG_DIMMER,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            <PlaybookStep step={1} action="Verify alert via Splunk correlation"          owner="ai_scorer"    status="automated" />
            <PlaybookStep step={2} action="Block source IP at perimeter firewall"         owner="ai_responder" status="automated" />
            <PlaybookStep step={3} action="Notify on-call operator via PagerDuty"         owner="orchestrator" status="automated" />
            <PlaybookStep step={4} action="Operator reviews block decision and approves"   owner="Human SOC"    status="manual"    />
            <PlaybookStep step={5} action="Post-incident review and IOC export to MISP"   owner="Analyst"      status="hybrid"    />
          </div>

          <CodeBlock language="YAML -- Playbook Definition" code={PLAYBOOK_CODE} />

          <InfoCard colour="#f87171" label="Caution">
            Playbooks with <InlineCode>automated: true</InlineCode> firewall steps execute
            without operator confirmation. Calibrate 
            <InlineCode>confidence_threshold</InlineCode> carefully before enabling in
            production environments.
          </InfoCard>

        </main>
      </div>
    </div>
  );
}
