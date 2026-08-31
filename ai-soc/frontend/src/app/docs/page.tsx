"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Sidebar nav items
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: "architecture",        label: "3-Plane Architecture",  icon: "ARCH"   },
  { id: "agent-orchestration", label: "Agent Orchestration",   icon: "ORCH"   },
  { id: "actionspec-contract", label: "ActionSpec & Policy",   icon: "SPEC"   },
  { id: "autonomy-tiers",      label: "Autonomy Tiers",        icon: "TIER"   },
  { id: "log-ingestion",       label: "Secure Ingestion",      icon: "INGST"  },
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
// 3-Plane Architecture Diagram
// ---------------------------------------------------------------------------

function ArchDiagram() {
  const planes = [
    {
      title: "1. Telemetry / Data Plane",
      items: ["Wazuh / EDR / Cloud / Network", "TLS Transport + Ingestion Bus", "Canonical Normalizer & Store"],
      color: "#60a5fa",
    },
    {
      title: "2. AI Reasoning Plane",
      items: ["Authoritative SIEM (Splunk)", "LangGraph Multi-Agent Mesh", "Structured ActionProposal"],
      color: GOLD,
    },
    {
      title: "3. Response Control Plane",
      items: ["Deterministic Policy Engine", "HITL Approval Service", "Action Broker (TTL + Rollback)"],
      color: "#34d399",
    },
  ];

  return (
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
          marginBottom: 16,
        }}
      >
        Three-Plane System Architecture
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {planes.map((p, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: 8,
              border: `1px solid ${p.color}33`,
              backgroundColor: "rgba(10,28,18,0.85)",
              padding: "16px",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: p.color, marginBottom: 10 }}>
              {p.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {p.items.map((it, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9.5,
                    color: FG_PRIMARY,
                    backgroundColor: "rgba(4,16,9,0.7)",
                    padding: "6px 10px",
                    borderRadius: 4,
                    border: "1px solid rgba(212,175,55,0.1)",
                  }}
                >
                  {it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${GOLD_DIM}`, display: "flex", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: FG_DIMMER }}>
          CROSS-CUTTING SERVICES:
        </span>
        {["Enterprise Identity & RBAC", "Secrets / KMS", "Tenant Isolation", "Immutable Audit Log", "OpenTelemetry Traces"].map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8.5,
              color: GOLD_TEXT,
              backgroundColor: "rgba(212,175,55,0.06)",
              padding: "2px 8px",
              borderRadius: 3,
              border: `1px solid ${GOLD_DIM}`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Playbook Step Row
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
    manual:    { colour: "#f87171", label: "Approval Gate" },
    hybrid:    { colour: GOLD,      label: "Policy-Gated" },
  };
  const { colour, label } = meta[status];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr 140px 110px",
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
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: "rgba(212,175,55,0.12)",
          border: `1px solid ${GOLD_MID}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 700,
          color: GOLD,
        }}
      >
        {step}
      </div>
      <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, color: FG_PRIMARY }}>
        {action}
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: FG_MUTED }}>
        {owner}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          fontWeight: 700,
          color: colour,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Autonomy Tiers Table
// ---------------------------------------------------------------------------

function AutonomyTiersTable() {
  const tiers = [
    {
      tier: "Tier 0 – Observe",
      examples: "Summarize evidence, ATT&CK mapping, case notes, query generation.",
      auth: "Automatic; read-only tools.",
      color: "#60a5fa",
    },
    {
      tier: "Tier 1 – Administrative",
      examples: "Create case ticket, add metadata tags, request enrichment, draft notification.",
      auth: "Automatic when reversible and tenant-approved.",
      color: "#34d399",
    },
    {
      tier: "Tier 2 – Bounded Containment",
      examples: "Short-lived isolation of non-critical endpoint, low-blast-radius rule.",
      auth: "Policy-governed; analyst approval in early releases, bounded auto-execution post-validation.",
      color: "#fbbf24",
    },
    {
      tier: "Tier 3 – Disruptive",
      examples: "Perimeter firewall block, disable account, isolate critical server, revoke credentials.",
      auth: "Explicit Analyst Approval Required; dual approval for critical infrastructure.",
      color: "#f97316",
    },
    {
      tier: "Tier 4 – Destructive / Irreversible",
      examples: "Terminate infrastructure, wipe endpoint, delete data, broad identity changes.",
      auth: "Never LLM-only. Requires deterministic controls, privileged workflow, and dual control.",
      color: "#f87171",
    },
  ];

  return (
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
        Autonomy Tiers & Action Authorization Matrix
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tiers.map((t) => (
          <div
            key={t.tier}
            style={{
              padding: "12px 14px",
              borderRadius: 6,
              borderLeft: `3px solid ${t.color}`,
              backgroundColor: "rgba(10,28,18,0.70)",
              display: "grid",
              gridTemplateColumns: "180px 1fr 1fr",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: t.color }}>
              {t.tier}
            </div>
            <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, color: FG_BODY }}>
              {t.examples}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: FG_PRIMARY, backgroundColor: "rgba(0,0,0,0.3)", padding: "6px 10px", borderRadius: 4 }}>
              {t.auth}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Code Snippets
// ---------------------------------------------------------------------------

const WAZUH_CODE = `# log_forwarder.py -- Secure Ingestion with TLS & Buffering
import json, requests, datetime, uuid

# Authenticated payload with idempotency key and source integrity metadata
payload = {
    "idempotency_key": f"idemp_{uuid.uuid4()}",
    "tenant_id": "tenant-acme-corp",
    "raw_log": json.dumps({
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "rule_id": 100002,
        "rule_level": 12,
        "description": "Multiple failed SSH login attempts",
        "agent": {"id": "001", "name": "prod-web-01", "ip": "10.0.1.55"},
        "data": {"srcip": "185.220.101.47", "dstport": 22, "protocol": "ssh", "attempts": 47}
    })
}

# Forwarded over mutual TLS with store-and-forward local buffering
resp = requests.post(
    "https://api.soc.internal/api/alerts/analyze",
    json=payload,
    headers={"Authorization": f"Bearer {BEARER_TOKEN}"},
    cert=("/etc/ssl/client.crt", "/etc/ssl/client.key"),
    timeout=10
)
print(resp.status_code, resp.json())`;

const SPLUNK_CODE = `# Splunk Enrichment Adapter -- Parameterized Safe Search
import ipaddress
import splunklib.client as client
import splunklib.results as results

# 1. Canonical validation: Strictly validate IP format to eliminate query injection
validated_ip = str(ipaddress.ip_address(extracted_ip))

service = client.connect(
    host="splunk.internal",
    port=8089,
    username="soc_reader",
    password=SPLUNK_TOKEN,
)

# 2. Parameterized search using validated literal to prevent search string manipulation
query = "search index=notable sourcetype=stash src_ip=$ip$ | head 5 | fields src_ip, rule_name, urgency, owner"

job = service.jobs.create(
    query,
    args={"ip": validated_ip},
    exec_mode="blocking"
)
for item in results.JSONResultsReader(job.results()):
    print(item)`;

const ACTIONSPEC_CODE = `# ActionSpec Contract Definition
ActionProposal {
  tenant_id:           "tenant-acme-corp",
  incident_id:         "INC-8802",
  action_type:         "firewall_block",
  target_type:         "ip",
  target_id:           "185.220.101.47",
  evidence_refs:       ["EVID-001", "EVID-002", "EVID-003"],
  rationale:           "Block malicious IP at perimeter firewall following 47 failed SSH attempts.",
  risk_tier:           "tier_3_disruptive",
  expected_effect:     "Terminate active credential guessing attacks immediately.",
  blast_radius:        "Single External IP Address (185.220.101.47)",
  ttl_seconds:         3600,  # 1-hour containment TTL with auto-rollback
  preconditions:       ["Target IP is not on internal asset or vendor allowlist."],
  postconditions:      ["Zero inbound connections permitted during verification."],
  rollback_action:     "firewall_unblock(185.220.101.47)",
  requested_by_agent:  "ResponseAgent_v1.2"
}

PolicyDecision {
  decision:            "REQUIRE_APPROVAL",
  policy_version:      "POL-SEC-2026-v3",
  reason_codes:        ["TIER_3_DISRUPTIVE_ACTION", "PERIMETER_FIREWALL_CONTROL"],
  required_approvers:  ["SOC_Analyst", "Security_Operator"]
}

ExecutionResult {
  executor_id:         "ActionBroker_Perimeter_FW",
  idempotency_key:     "idemp_act_001_185.220.101.47",
  status:              "success",
  verification_evidence: ["Rule #8802 active; probe verified 0 dropped packet anomalies."],
  rollback_status:     "Active (Auto-rollback after 3600s)"
}`;

const PLAYBOOK_CODE = `# playbooks/PB-001-brute-force-ssh.yaml
# Policy-Gated Playbook with Approval Step preceding Execution
id: PB-001
name: Brute Force SSH Response
version: "2.0.0"
trigger:
  event_type: failed_ssh_login
  threshold_count: 10
  window_seconds: 60

# LLM generates structured proposal; deterministic policy gates execution
steps:
  - id: 1_verify_correlation
    action: splunk_correlate
    owner: ai_scorer
    mode: automated

  - id: 2_enrich_and_propose
    action: generate_action_proposal
    target_action: firewall_block
    ttl_seconds: 3600
    owner: context_agent
    mode: automated

  - id: 3_policy_and_approval_gate
    action: await_analyst_approval
    risk_tier: tier_3_disruptive
    timeout_seconds: 900
    owner: Human SOC / Policy Engine
    mode: approval_gate  # <--- MUST APPROVE BEFORE EXECUTION

  - id: 4_execute_action_broker
    action: firewall_block
    executor: action_broker
    ttl_seconds: 3600
    auto_rollback: true
    owner: action_broker
    mode: policy_gated_execution

  - id: 5_verify_and_notify
    action: verify_and_notify_responders
    owner: orchestrator
    mode: automated

  - id: 6_post_incident_ioc_export
    action: misp_push
    owner: Analyst
    mode: hybrid`;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

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
            Technical Documentation & Control Specification
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
            Architecture, ActionSpec contract, safety release gates, and operator reference.
          </p>
        </div>
      </div>

      {/* ---- Two-column body ---- */}
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 0,
          flex: 1,
        }}
      >
        {/* ======== SIDEBAR ======== */}
        <aside
          style={{
            borderRight: `1px solid ${FOREST_DARK}`,
            paddingTop: 32,
            paddingRight: 24,
            position: "sticky",
            top: 72,
            alignSelf: "start",
            maxHeight: "calc(100vh - 72px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: FG_DIMMER,
              marginBottom: 12,
              paddingLeft: 8,
            }}
          >
            Sections
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_ITEMS.map((item) => {
              const isSelected = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: isSelected ? `1px solid ${GOLD_MID}` : "1px solid transparent",
                    backgroundColor: isSelected ? "rgba(212,175,55,0.08)" : "transparent",
                    color: isSelected ? GOLD : FG_MUTED,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: isSelected ? 700 : 400,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      opacity: isSelected ? 1 : 0.6,
                      color: isSelected ? GOLD : FG_DIMMER,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ======== MAIN CONTENT ======== */}
        <main style={{ paddingTop: 32, paddingLeft: 40, paddingBottom: 64 }}>

          {/* == Architecture == */}
          <SectionAnchor id="architecture" />
          <SectionHeading
            id="architecture-heading"
            overline="Section 01"
            title="3-Plane Architecture"
            sub="Separation of Telemetry Data Plane, AI Reasoning Plane, and Response Control Plane."
          />
          <GoldRule />

          <BodyText>
            The AI-SOC platform strictly separates telemetry processing, generative AI reasoning, and response
            execution into three discrete planes. The LLM/agent layer operates exclusively in an advisory capacity
            and is never the security boundary authorizing destructive or disruptive actions.
          </BodyText>
          <BodyText>
            Raw events ingested from Wazuh, EDR, and network flow sensors are normalized against a canonical schema
            and stamped with source integrity metadata. LangGraph multi-agent nodes synthesize context and propose
            structured <InlineCode>ActionProposal</InlineCode> objects. A deterministic policy engine and Action Broker
            govern authorization, approval, time-bounded execution, and compensating rollback.
          </BodyText>

          <ArchDiagram />

          <InfoCard colour="#60a5fa" label="Architectural Boundary">
            Every component boundary is governed by strict typed schemas. Agents never hold long-lived administrative
            credentials; the dedicated Action Broker executes approved proposals using ephemeral, scoped credentials.
          </InfoCard>

          {/* == Agent Orchestration == */}
          <SectionAnchor id="agent-orchestration" />
          <SectionHeading
            id="agent-orchestration-heading"
            overline="Section 02"
            title="Agent Orchestration & Reasoning"
            sub="LangGraph multi-agent graph with bounded tools and evidence citations."
          />
          <GoldRule />

          <BodyText>
            The orchestration mesh uses LangGraph to coordinate specialized agents. Generative reasoning is reserved
            for tasks where language inference adds real value (evidence synthesis, hypothesis generation, and ATT&CK
            candidate mapping), while parsing, correlation, and policy evaluation remain deterministic.
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
              LangGraph Multi-Agent Node Sequence
            </div>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
              {[
                { name: "Normalizer",  desc: "Canonical Schema" },
                { name: "Context Agent", desc: "Authoritative SIEM" },
                { name: "Analyst Agent", desc: "ATT&CK + Synthesis" },
                { name: "Response Agent", desc: "ActionProposal" },
                { name: "Policy Gate", desc: "Deterministic Auth" },
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

          {/* == ActionSpec & Policy == */}
          <SectionAnchor id="actionspec-contract" />
          <SectionHeading
            id="actionspec-contract-heading"
            overline="Section 03"
            title="ActionSpec Contract & Policy Broker"
            sub="Typed action schema, blast-radius calculation, and auto-rollback."
          />
          <GoldRule />

          <BodyText>
            The <InlineCode>ActionSpec</InlineCode> contract is the strict formal interface between AI agents, the policy
            engine, and execution brokers. Agents cannot generate arbitrary commands or shell strings; they select from an
            allowlisted action catalog and must provide evidence references, expected effects, blast radius, and rollback definitions.
          </BodyText>

          <CodeBlock language="TypeScript / Pydantic -- ActionSpec Contract" code={ACTIONSPEC_CODE} />

          {/* == Autonomy Tiers == */}
          <SectionAnchor id="autonomy-tiers" />
          <SectionHeading
            id="autonomy-tiers-heading"
            overline="Section 04"
            title="Autonomy Tiers & Release Gates"
            sub="Risk-calibrated authorization levels from observation to disruptive response."
          />
          <GoldRule />

          <BodyText>
            Remediation actions are categorized into 5 Autonomy Tiers to ensure disruptive operations are never executed
            without appropriate policy evaluation and human oversight.
          </BodyText>

          <AutonomyTiersTable />

          {/* == Secure Ingestion == */}
          <SectionAnchor id="log-ingestion" />
          <SectionHeading
            id="log-ingestion-heading"
            overline="Section 05"
            title="Secure Ingestion & Transport"
            sub="Authenticated TLS transport, durable buffering, idempotency, and backpressure."
          />
          <GoldRule />

          <BodyText>
            Production ingestion requires secure, authenticated transport with idempotency keys and store-and-forward buffering.
            Inbound events are validated against strict Pydantic schemas, and malformed inputs are quarantined into dead-letter queues.
          </BodyText>

          <CodeBlock language="Python -- Secure Ingestion Forwarder" code={WAZUH_CODE} />

          {/* == Splunk Enrichment == */}
          <SectionAnchor id="splunk-enrichment" />
          <SectionHeading
            id="splunk-enrichment-heading"
            overline="Section 06"
            title="Splunk Enrichment & Parameterized Queries"
            sub="Canonical IP validation eliminating search string injection."
          />
          <GoldRule />

          <BodyText>
            Enrichment connectors parse and strictly validate all input parameters (such as IP addresses and domain hashes)
            before querying external SIEMs or threat-intelligence feeds. Parameterized query construction prevents search injection attacks.
          </BodyText>

          <CodeBlock language="Python -- Safe Parameterized Splunk Query" code={SPLUNK_CODE} />

          {/* == Operator Playbooks == */}
          <SectionAnchor id="operator-playbooks" />
          <SectionHeading
            id="operator-playbooks-heading"
            overline="Section 07"
            title="Policy-Governed Operator Playbooks"
            sub="PB-001 Brute Force SSH Response: Policy-first, human-in-the-loop remediation."
          />
          <GoldRule />

          <BodyText>
            Playbooks define end-to-end response runbooks. In accordance with safety release gates, disruptive actions
            (such as perimeter firewall blocks) require explicit operator review or policy approval <em>before</em> any
            firewall rules are executed. All containment actions carry a time-to-live (1-hour TTL) and an automated rollback plan.
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
              PB-001 -- Brute Force SSH Response (Policy-Gated v2.0)
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 140px 110px",
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
            <PlaybookStep step={1} action="Verify alert via Splunk correlation & host context" owner="ai_scorer" status="automated" />
            <PlaybookStep step={2} action="Enrich source reputation & generate ActionProposal with 1h TTL" owner="context_agent" status="automated" />
            <PlaybookStep step={3} action="Deterministic Policy Decision & Await Analyst Approval" owner="Policy / Human SOC" status="manual" />
            <PlaybookStep step={4} action="Execute perimeter firewall block via Action Broker (1-hour TTL)" owner="action_broker" status="hybrid" />
            <PlaybookStep step={5} action="Verify block enforcement & notify on-call responders" owner="orchestrator" status="automated" />
            <PlaybookStep step={6} action="Post-incident review, auto-rollback after TTL & IOC export" owner="Analyst" status="hybrid" />
          </div>

          <CodeBlock language="YAML -- Policy-Gated Playbook Definition" code={PLAYBOOK_CODE} />

          <InfoCard colour="#34d399" label="Human-in-the-Loop Guarantee">
            Disruptive actions (firewall block, endpoint isolation) strictly require policy evaluation and analyst approval
            prior to execution. The LLM only proposes actions; the deterministic policy service authorizes, and the Action Broker
            executes with scoped credentials and auto-rollback TTL.
          </InfoCard>

        </main>
      </div>
    </div>
  );
}
