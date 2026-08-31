import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Incident } from "@/types";

const FALLBACK_INCIDENTS: Incident[] = [
  {
    id: "INC-8802",
    tenant_id: "tenant-acme-corp",
    timestamp: new Date().toISOString(),
    source: "Wazuh Agent (prod-web-01)",
    event_type: "Multiple Failed SSH Logins (Rule 100002)",
    severity: "high",
    status: "triaging",
    description: "47 consecutive failed root & admin SSH authentication attempts within 60 seconds from external IP 185.220.101.47 targeting prod-web-01 (10.0.1.55).",
    affected_host: "prod-web-01 (10.0.1.55)",
    attck_technique: {
      id: "T1110.001",
      name: "Password Guessing",
      tactic: "Credential Access",
      confidence: 0.94,
    },
    agent_summary: "Triage Agent analyzed 47 raw authentication failure events. Context Agent correlated source IP 185.220.101.47 against Splunk notable events and VirusTotal (reputation: 92/100 malicious, Tor exit node). Host prod-web-01 is a critical payment gateway edge node.",
    agent_recommendation: "Containment proposal submitted to Policy Engine: Temporary perimeter firewall block (3600s TTL).",
    evidence_bundle: [
      {
        id: "EVID-001",
        source: "Wazuh HIDS",
        source_type: "wazuh",
        timestamp: new Date().toISOString(),
        confidence: 0.99,
        provenance: "wazuh-agent-001:events/2026-08-30/auth.log#L1042-L1089",
        summary: "47 failed SSH attempts using wordlist usernames (root, admin, deploy) in 42s.",
        raw_payload: { srcip: "185.220.101.47", dstport: 22, protocol: "ssh", attempts: 47 },
      },
      {
        id: "EVID-002",
        source: "Splunk Enterprise Security",
        source_type: "splunk",
        timestamp: new Date().toISOString(),
        confidence: 0.91,
        provenance: "splunk.internal:8089/services/search/jobs/1725027720.14",
        summary: "Source IP previously observed in 3 brute-force sweeps across DMZ subnet in last 7 days.",
        raw_payload: { src_ip: "185.220.101.47", urgency: "high", prior_incidents: 3 },
      },
      {
        id: "EVID-003",
        source: "Threat Intelligence Gateway",
        source_type: "threat_intel",
        timestamp: new Date().toISOString(),
        confidence: 0.95,
        provenance: "feed.threatintel.io:v2/iocs/ip/185.220.101.47",
        summary: "Known scanner / active Tor exit relay associated with automated brute-force botnets.",
        raw_payload: { reputation_score: 92, category: "scanner_botnet" },
      },
    ],
    proposed_action: {
      id: "ACT-001",
      tenant_id: "tenant-acme-corp",
      incident_id: "INC-8802",
      action_type: "firewall_block",
      target_type: "ip",
      target_id: "185.220.101.47",
      evidence_refs: ["EVID-001", "EVID-002", "EVID-003"],
      rationale: "Disruptive containment proposed: Drop all inbound packets from 185.220.101.47 at perimeter edge to halt credential stuffing.",
      risk_tier: "tier_3_disruptive",
      expected_effect: "Inbound SSH connection attempts terminated immediately.",
      blast_radius: "Single External IP Address (185.220.101.47)",
      ttl_seconds: 3600,
      preconditions: ["Target IP is not on internal asset or vendor allowlist.", "Perimeter firewall API is operational."],
      postconditions: ["Zero packets accepted from 185.220.101.47 during verification probe."],
      rollback_action: "firewall_unblock(185.220.101.47)",
      requested_by_agent: "ResponseAgent_v1.2",
      model_version: "claude-3-5-sonnet",
      prompt_version: "playbook_response_v2.4",
    },
    policy_decision: {
      decision: "REQUIRE_APPROVAL",
      policy_version: "POL-SEC-2026-v3",
      reason_codes: ["TIER_3_DISRUPTIVE_ACTION", "PERIMETER_FIREWALL_CONTROL", "PRODUCTION_ASSET_IMPACT"],
      required_approvers: ["SOC_Analyst", "Security_Operator"],
      decided_at: new Date().toISOString(),
    },
    execution_result: {
      executor_id: "ActionBroker_Core_v1",
      idempotency_key: "idemp_act_001_185.220.101.47",
      status: "pending",
    },
    audit_trail: [
      {
        id: "AUD-001",
        timestamp: new Date().toISOString(),
        actor: "WazuhCollector",
        event_type: "ingested",
        details: "Raw syslog ingested over TLS transport; validated against schema.",
        signature_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      },
      {
        id: "AUD-002",
        timestamp: new Date().toISOString(),
        actor: "ContextAgent",
        event_type: "enriched",
        details: "Authoritative Splunk query executed; reputation score 92 retrieved.",
        signature_hash: "sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      },
      {
        id: "AUD-003",
        timestamp: new Date().toISOString(),
        actor: "ResponseAgent",
        event_type: "agent_proposal",
        details: "Generated ActionProposal ACT-001 with 3600s TTL and rollback plan.",
        signature_hash: "sha256:326b772591605e55e8c1569472e389e023456789abcdef0123456789abcdef01",
      },
      {
        id: "AUD-004",
        timestamp: new Date().toISOString(),
        actor: "PolicyEngine",
        event_type: "policy_evaluated",
        details: "Evaluated rule POL-SEC-2026-v3: Matched REQUIRE_APPROVAL for Tier 3 action.",
        signature_hash: "sha256:7c9e3e7f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
      },
    ],
  },
  {
    id: "INC-8803",
    tenant_id: "tenant-acme-corp",
    timestamp: new Date().toISOString(),
    source: "Zeek Network Flow",
    event_type: "Unusual Outbound Data Volume (Negative Case)",
    severity: "medium",
    status: "investigating",
    description: "Outbound HTTPS transfer of 450MB from internal workstation 10.0.3.12 to cloud backup IP 52.84.122.9.",
    affected_host: "ws-finance-04 (10.0.3.12)",
    attck_technique: {
      id: "T1567",
      name: "Exfiltration Over Web Service",
      tactic: "Exfiltration",
      confidence: 0.35,
    },
    agent_summary: "AI Agent evaluated event against cloud asset inventory. Destination IP matches verified corporate OneDrive endpoint. User 'alice.finance' initiated scheduled backup sync. Evidence of adversary activity is insufficient.",
    agent_recommendation: "AI declined containment proposal due to low confidence (0.35) and benign baseline match. No action required.",
    evidence_bundle: [
      {
        id: "EVID-004",
        source: "Zeek Flow",
        source_type: "network",
        timestamp: new Date().toISOString(),
        confidence: 0.90,
        provenance: "zeek-sensor-east:conn.log#L8821",
        summary: "450MB outbound over TLS 1.3 to 52.84.122.9 (AS8075 Microsoft Corporation).",
      },
      {
        id: "EVID-005",
        source: "Corporate Asset Inventory",
        source_type: "edr",
        timestamp: new Date().toISOString(),
        confidence: 0.98,
        provenance: "cmdb.internal/assets/10.0.3.12",
        summary: "Scheduled enterprise cloud backup service active for workstation ws-finance-04.",
      },
    ],
    proposed_action: {
      id: "ACT-002",
      tenant_id: "tenant-acme-corp",
      incident_id: "INC-8803",
      action_type: "log_observation",
      target_type: "host",
      target_id: "10.0.3.12",
      evidence_refs: ["EVID-004", "EVID-005"],
      rationale: "Non-disruptive observation: Downgraded from containment because evidence indicates benign scheduled sync.",
      risk_tier: "tier_0_observe",
      expected_effect: "Case annotated; telemetry retained for baseline calibration.",
      blast_radius: "None",
      ttl_seconds: 0,
      preconditions: [],
      postconditions: [],
      rollback_action: "none",
      requested_by_agent: "TriageAgent_v1.1",
      model_version: "claude-3-5-sonnet",
      prompt_version: "playbook_response_v2.4",
    },
    policy_decision: {
      decision: "ALLOW",
      policy_version: "POL-SEC-2026-v3",
      reason_codes: ["TIER_0_OBSERVE_ALLOWED", "BENIGN_TELEMETRY_MATCH"],
      required_approvers: [],
      decided_at: new Date().toISOString(),
    },
    execution_result: {
      executor_id: "ActionBroker_Core_v1",
      idempotency_key: "idemp_act_002_10.0.3.12",
      status: "success",
      verification_evidence: ["Observation logged in incident audit trail."],
    },
    audit_trail: [
      {
        id: "AUD-005",
        timestamp: new Date().toISOString(),
        actor: "TriageAgent",
        event_type: "agent_proposal",
        details: "Evaluated exfiltration hypothesis; downgraded to benign observation.",
        signature_hash: "sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      },
    ],
  },
];

export async function GET() {
  const cookieStore = await cookies();
  const IS_PROD = process.env.NODE_ENV === "production";
  const cookieName = IS_PROD ? "__Secure-soc_session" : "soc_session";
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = process.env.API_URL ?? "http://localhost:8000";

  try {
    const res = await fetch(`${apiUrl}/api/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline: serve standalone canonical alerts
  }

  return NextResponse.json({
    total: FALLBACK_INCIDENTS.length,
    alerts: FALLBACK_INCIDENTS,
  });
}
