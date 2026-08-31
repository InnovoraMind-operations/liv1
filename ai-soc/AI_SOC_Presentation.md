---
marp: true
theme: default
class: lead
backgroundColor: #f8f9fa
---

# AI-SOC
## Autonomous Security Operations Center
### Next-Generation Threat Detection & Response Architecture
#### InnovoraMind LLC · Architectural & Engineering Review Edition

---

## Executive Summary

- **The Vision**: Revolutionize security operations by transitioning from manual triage to AI-assisted and policy-governed autonomy.
- **The Mission**: Designed to reduce analyst triage and response time; quantify MTTR and MTTD impact through pilot measurements.
- **The Approach**: A highly scalable, event-driven architecture paired with a bounded Multi-Agent LLM orchestration engine to automate threat correlation, hypothesis generation, and proposed remediation.
- **The Result**: Human analysts focus on strategic decisions (Human-in-the-Loop) while deterministic policy gates and automated action brokers safely execute time-bounded containment.

---

## The Problem: Traditional SOC Limitations

- **Alert Fatigue**: Tier 1 analysts are overwhelmed by massive volumes of false positives and noisy telemetry.
- **Manual Triage Bottlenecks**: Correlating logs across disparate systems manually leads to unacceptable response delays.
- **Cognitive Overload & Burnout**: High turnover rates due to repetitive, low-level investigative tasks.
- **Fragmented Tooling**: Lack of unified platforms that seamlessly connect detection to policy-authorized remediation playbooks.

---

## The Solution: AI-SOC

A scalable, policy-governed SOC platform designed for modern threat landscapes.

**Core Pillars:**
1. **High-Throughput Telemetry**: Ingestion across integrated telemetry sources and supported environments.
2. **AI-Assisted Reasoning**: Multi-agent orchestration for context enrichment, hypothesis generation, and evidence synthesis.
3. **Policy-Governed Playbooks**: Constrained remediation proposals executed only via deterministic action authorization.
4. **Operator Command Center**: Low-latency single pane of glass for human-in-the-loop investigation and approval.

---

## Three-Plane System Architecture

AI-SOC strictly separates the **Data Plane**, **AI Reasoning Plane**, and **Response Control Plane**:

```
[Telemetry Sources: Wazuh / EDR / Identity / Syslog]
                     │ (Authenticated + TLS)
                     ▼
[Data Plane]         Durable Ingestion Bus ──▶ Normalizer ──▶ Canonical Incident Schema
                                                                      │
                                     ┌────────────────────────────────┤
                                     ▼                                ▼
[AI Reasoning Plane]         Authoritative SIEM/TI Connectors    LangGraph Multi-Agent Mesh
                             (Splunk / VirusTotal / Asset DB)    (Triage, Context, Response)
                                                                      │
                                                                      ▼ (Structured ActionProposal)
[Response Control Plane]                                         Deterministic Policy Engine
                                                                      │ (Require Approval / Deny / Allow)
                                                                      ▼
                                                                 HITL Analyst Approval Gate
                                                                      │
                                                                      ▼
                                                                 Action Broker & Executor
                                                                 (Firewall / EDR / IAM / ITSM)
                                                                 [Time-Bounded TTL + Rollback]

[Cross-Cutting Services] Identity & RBAC │ Secrets/KMS │ Tenant Isolation │ Immutable Audit │ Observability
```

---

## Deep Dive: The Operator Dashboard

The presentation layer designed for minimal cognitive load and rigorous operational safety:

- **Purpose-Built UI**: Next.js 15 App Router providing a seamless, low-latency command experience.
- **Real-Time Telemetry & Health**: Alert Queues with visual severity indicators, distinguishing runtime service health from feature readiness.
- **Evidence & Provenance Timeline**: Chronological raw/normalized evidence, source provenance, pivots, and model notes.
- **Action-Oriented HITL**: Built strictly for Human-in-the-Loop interventions, allowing analysts to review `ActionProposal` blast radius and TTL before approving containment.
- **Persistent Sandbox Labeling**: Clear simulation and sandbox banners so test events are never confused with live production changes.

---

## Deep Dive: The Core Engine & Data Plane

The high-performance API nerve center driving the platform:

- **Asynchronous Processing**: Python FastAPI designed specifically for non-blocking I/O during high-throughput log ingestion.
- **Strict Data Integrity**: Pydantic v2 schemas validate all inbound sensor traffic, validating payloads against typed schemas and rejecting/quarantining malformed input.
- **Optimized Data Layer**: PostgreSQL and TimescaleDB integration, optimized for time-series querying by human operators and analytical services.
- **Durable Event Pipeline**: Designed for buffered transport, idempotency keys, deduplication, and backpressure handling.

---

## Deep Dive: Multi-Agent AI & ActionSpec Contract

The "Brain" of the AI-SOC converts reasoning into constrained, typed proposals:

- **Triage Node**: Ingests normalized telemetry, summarizes events with citations, and filters out noise.
- **Context Agent**: Queries authoritative SIEM (Splunk) and threat intelligence feeds to build verified evidence bundles.
- **Response Agent**: Maps validated threats to MITRE ATT&CK TTPs and generates a structured `ActionProposal`.
- **Policy & Action Broker Boundary**:
  - *The LLM only proposes actions; it NEVER holds direct administrative credentials or executes commands.*
  - The deterministic **Policy Engine** assesses blast radius, asset criticality, and requires explicit analyst approval for disruptive actions (Tier 3/4).
  - The **Action Broker** executes approved actions with scoped short-lived credentials and a 1-hour auto-rollback TTL.

---

## Endpoint & Network Telemetry Layer

Corroborating host and network telemetry to strengthen investigation:

- **Windows Event Log Ingestion (Roadmap/Dev)**: Lightweight edge collectors tailing Security (4625, 4672, 4688), System, and Application logs with identity context.
- **Network Telemetry & Flow Analytics (Roadmap/Dev)**: Flow/metadata analytics (Zeek/NetFlow) paired with selective packet capture for C2 beaconing and exfiltration corroboration.
- **Corroborating Evidence**: Network and host observations are correlated in the evidence bundle to validate ATT&CK candidate retrieval without unprovable "irrefutable" claims.

---

## Enterprise Identity & Extensibility (Roadmap)

Enabling enterprise trust and ecosystem integration:

- **Enterprise Identity**: OIDC/SAML Single Sign-On, phishing-resistant MFA, Role-Based Access Control (RBAC), and step-up authentication for privileged actions.
- **API Key Architecture (Planned)**: Secure API key lifecycle management including scoping, hashing, storage, rotation, rate limiting, and audit logging before public exposure.
- **Ecosystem Connectors**: Standardized connector adapters with caching, timeouts, circuit breakers, and degraded-mode resilience for third-party SIEMs and ITSM tools.

---

## Current Build vs. Roadmap Matrix

Explicit mapping of demonstrated capabilities versus staged/planned features:

| Capability / Area | Status | Evidence in Build | Target Horizon |
|:---|:---|:---|:---|
| **Dashboard Shell & UI** | **Demonstrated** | Next.js 15 App Router, Navigation, Executive Dark Theme | Current (v0.1.0) |
| **REST API Core** | **Demonstrated** | FastAPI backend, Pydantic schemas, Health telemetry | Current (v0.1.0) |
| **ActionSpec & Policy Schemas** | **Demonstrated** | Structured `ActionProposal`, `PolicyDecision`, `ExecutionResult` | Current (v0.1.0) |
| **Alert Queue & Evidence View** | **Beta / Staging** | Seeded synthetic incidents, ATT&CK mapping, audit timeline | Current (v0.1.0) |
| **Multi-Agent LangGraph Core** | **Development** | Node state graphs, Triage & Context agent workflows | 61–90 days |
| **Action Broker & HITL Approval** | **Staging / Beta** | Policy decision engine, analyst approval gate, TTL rollback | 3–6 months |
| **Windows & Network Sensors** | **Development** | Event tailing and flow collector prototypes | 31–60 days |
| **Enterprise SSO & API Keys** | **Planned** | OIDC/SAML integration, scoped API key lifecycle | 3–6 months |

---

## Commercialization: Deployment Models

Flexible architectures to meet strict compliance and operational requirements:

- **SaaS / Managed Cloud**: Multi-tenant cloud with tenant ID isolation, row/partition security, per-tenant keys/quotas, and isolated agent memory.
- **On-Premise / Air-Gapped**: Self-contained appliance deployments with offline-capable models, local threat-intel bundles, and zero mandatory cloud callback.
- **Hybrid Edge**: Localized edge collection and store-and-forward processing with mutual TLS device authentication.

---

## Strategic Roadmap & Phased Execution

Reordered around cybersecurity safety, verification, and release gates:

- 🛡️ **Horizon 1 (0–30 Days): Product & Security Foundation**
  - Reconcile capability registry; canonical event schemas; ActionSpec contract; policy approval gate; fix PB-001 approval order.
- 🔄 **Horizon 2 (31–60 Days): Reliable Evidence Pipeline**
  - Durable event bus; normalization & deduplication; connector abstractions (Splunk/Wazuh); OpenTelemetry tracing.
- 🤖 **Horizon 3 (61–90 Days): Bounded Agentic Assistance**
  - Read-only Analyst Agent; evidence verifier; model gateway with cost/token budgets; OWASP/NIST AI test suite; shadow-mode action proposals.
- ⚖️ **Horizon 4 (3–6 Months): Controlled Response Pilot**
  - HITL approval service; Action Broker with scoped credentials and auto-rollback TTL; Enterprise SSO/MFA; tenant isolation pilot.
- 🏢 **Horizon 5 (6–12 Months): Enterprise Hardening & Commercialization**
  - HA/DR, air-gap packaging, SOC 2 / ISO 27001 evidence, SBOM/signing, agent red-teaming, and design-partner ROI analytics.

---

## Autonomy Tiers & Action Governance

Strict risk-calibrated authorization matrix for all platform actions:

- **Tier 0 – Observe**: Summarize evidence, ATT&CK mapping, case notes. *(Automatic; read-only)*
- **Tier 1 – Administrative**: Create ticket, add tag, request enrichment, draft notification. *(Automatic when reversible)*
- **Tier 2 – Bounded Containment**: Short-lived isolation of non-critical endpoint, low-blast-radius rule. *(Policy-governed with approval)*
- **Tier 3 – Disruptive**: Perimeter firewall block, disable account, isolate critical server. *(Explicit Analyst Approval Required)*
- **Tier 4 – Destructive / Irreversible**: Terminate infrastructure, wipe endpoint. *(Never LLM-only; strict dual control)*

---

## Conclusion & Next Steps

**AI-SOC represents a paradigm shift toward safe, evidence-grounded, policy-controlled security operations.**

**Immediate Action Items:**
1. **Safety Controls**: Enforce the deterministic policy gate before all disruptive remediation actions.
2. **Architecture**: Implement the 3-plane model (Data, AI Reasoning, Response Control) and canonical ActionSpec contract.
3. **Validation**: Execute end-to-end sandbox testing with complete evidence traceability and measurable MTTR/MTTD metrics.

---

## Q&A

**Thank You.**
*AI-SOC Engineering & Product Team · InnovoraMind LLC*
