import type { AuditEvent, FrameworkEdge, FrameworkNode, Inject, NotificationItem, PlatformUser, Scenario, Scorecard, SimulationSession, Tenant } from "../types.js";

export const tenants: Tenant[] = [
  {
    id: "ten-sovereign-health",
    name: "Sovereign Health Network",
    sector: "Healthcare",
    region: "APAC",
    plan: "Sovereign"
  }
];

export const users: PlatformUser[] = [
  { id: "usr-admin", tenantId: "ten-sovereign-health", name: "Platform Admin", email: "admin@demo.local", role: "Admin", status: "Active" },
  { id: "usr-ceo", tenantId: "ten-sovereign-health", name: "Asha Menon", email: "ceo@demo.local", role: "CEO", status: "Active" },
  { id: "usr-ciso", tenantId: "ten-sovereign-health", name: "Maya Rao", email: "ciso@demo.local", role: "CISO", status: "Active" },
  { id: "usr-board", tenantId: "ten-sovereign-health", name: "Executive Committee", email: "board@demo.local", role: "Board", status: "Active" }
];

export const notifications: NotificationItem[] = [
  {
    id: "ntf-001",
    tenantId: "ten-sovereign-health",
    title: "Regulator inject pending",
    detail: "Evidence response window closes in 24 minutes.",
    severity: "Critical",
    read: false,
    createdAt: "2026-06-30T04:10:00.000Z"
  },
  {
    id: "ntf-002",
    tenantId: "ten-sovereign-health",
    title: "CEO decision required",
    detail: "Approve public statement and operating posture.",
    severity: "Warning",
    read: false,
    createdAt: "2026-06-30T04:18:00.000Z"
  },
  {
    id: "ntf-003",
    tenantId: "ten-sovereign-health",
    title: "Tabletop module ready",
    detail: "Executive scenario pack is available for launch.",
    severity: "Info",
    read: true,
    createdAt: "2026-06-30T04:22:00.000Z"
  }
];

export const scenarios: Scenario[] = [
  {
    id: "scn-exec-tabletop",
    tenantId: "ten-sovereign-health",
    title: "CEO and Board AI-Cyber Crisis Tabletop",
    module: "Executive Tabletop Exercise",
    difficulty: "Executive",
    durationMinutes: 120,
    threatActors: ["Regulator pressure", "Media escalation", "AI trust boundary failure"],
    standards: ["NIST CSF 2.0", "NIST AI RMF", "ISO 27001", "ISO 42001", "DORA"],
    roles: ["CEO", "Board Chair", "CISO", "CIO", "General Counsel", "Comms Lead", "Privacy Officer"],
    status: "Scheduled",
    resilienceScore: 76
  },
  {
    id: "scn-ai-rag-poisoning",
    tenantId: "ten-sovereign-health",
    title: "RAG Poisoning Triggers Clinical AI Governance Crisis",
    module: "AI Threat Simulation",
    difficulty: "Executive",
    durationMinutes: 120,
    threatActors: ["Synthetic identity cell", "Autonomous prompt-injection agent"],
    standards: ["MITRE ATLAS", "OWASP LLM Top 10", "NIST AI RMF", "ISO 42001", "HIPAA"],
    roles: ["CISO", "CIO", "Board", "AI Governance Officer", "Privacy Officer"],
    status: "Live",
    resilienceScore: 78
  },
  {
    id: "scn-ransomware-cross-cloud",
    tenantId: "ten-sovereign-health",
    title: "Cross-Cloud Ransomware and Recovery Sequencing Exercise",
    module: "Business Continuity",
    difficulty: "Operational",
    durationMinutes: 180,
    threatActors: ["Ransomware affiliate", "Insider access broker"],
    standards: ["MITRE ATT&CK", "NIST CSF 2.0", "ISO 22301", "DORA"],
    roles: ["CISO", "SOC Analyst", "Incident Responder", "BCM Manager"],
    status: "Scheduled",
    resilienceScore: 72
  },
  {
    id: "scn-deepfake-board",
    tenantId: "ten-sovereign-health",
    title: "Deepfake CFO Fraud, Media Escalation, and Regulator Pressure",
    module: "Crisis Management",
    difficulty: "Board",
    durationMinutes: 90,
    threatActors: ["Deepfake fraud crew", "Misinformation network"],
    standards: ["WEF Digital Trust", "GDPR", "DPDP", "ISO 27001"],
    roles: ["Board", "CISO", "Compliance Officer", "Risk Manager"],
    status: "Draft",
    resilienceScore: 65
  }
];

export const injects: Inject[] = [
  {
    id: "inj-001",
    scenarioId: "scn-ai-rag-poisoning",
    minute: 0,
    title: "Clinician reports inconsistent AI discharge guidance across two hospitals.",
    channel: "AI Governance",
    severity: "High",
    decisionRequired: true,
    aiGenerated: true
  },
  {
    id: "inj-002",
    scenarioId: "scn-ai-rag-poisoning",
    minute: 18,
    title: "Threat intel flags poisoned vector documents in a third-party knowledge connector.",
    channel: "SOC",
    severity: "Critical",
    decisionRequired: true,
    aiGenerated: true
  },
  {
    id: "inj-003",
    scenarioId: "scn-ai-rag-poisoning",
    minute: 41,
    title: "Regulator asks whether AI clinical recommendations were used in patient care.",
    channel: "Regulator",
    severity: "Critical",
    decisionRequired: true,
    aiGenerated: false
  },
  {
    id: "inj-004",
    scenarioId: "scn-ai-rag-poisoning",
    minute: 75,
    title: "Local media publishes leaked screenshots alleging unsafe autonomous diagnosis.",
    channel: "Media",
    severity: "High",
    decisionRequired: true,
    aiGenerated: true
  }
];

export const scorecards: Scorecard[] = [
  { domain: "AI Governance", score: 74, target: 88, trend: 6 },
  { domain: "Cyber Defense", score: 82, target: 90, trend: 4 },
  { domain: "Crisis Comms", score: 69, target: 84, trend: -2 },
  { domain: "Recovery", score: 77, target: 92, trend: 8 },
  { domain: "Privacy", score: 71, target: 86, trend: 3 },
  { domain: "Board Decisions", score: 63, target: 80, trend: 5 }
];

export const mappings = [
  { framework: "MITRE ATLAS", covered: 24, total: 31, domain: "AI Threats" },
  { framework: "OWASP LLM Top 10", covered: 9, total: 10, domain: "AI AppSec" },
  { framework: "NIST AI RMF", covered: 18, total: 22, domain: "AI Governance" },
  { framework: "MITRE ATT&CK", covered: 66, total: 112, domain: "Cyber" },
  { framework: "NIST CSF 2.0", covered: 33, total: 42, domain: "Resilience" },
  { framework: "ISO 42001", covered: 21, total: 28, domain: "AI Management" },
  { framework: "DORA", covered: 15, total: 19, domain: "Operational Resilience" }
];

export const sessions: SimulationSession[] = [
  {
    id: "ses-live-rag-001",
    tenantId: "ten-sovereign-health",
    scenarioId: "scn-ai-rag-poisoning",
    status: "Live",
    currentMinute: 41,
    startedAt: "2026-06-30T03:15:00.000Z",
    participants: [
      { role: "CISO", name: "Maya Rao", responseLatencySeconds: 188 },
      { role: "AI Governance Officer", name: "Dr. Ian Cho", responseLatencySeconds: 241 },
      { role: "Privacy Officer", name: "Leena Shah", responseLatencySeconds: 312 },
      { role: "Board", name: "Executive Committee", responseLatencySeconds: 498 }
    ],
    riskState: {
      trustImpact: 76,
      operationalImpact: 58,
      regulatoryImpact: 82,
      containmentConfidence: 64
    },
    decisions: [],
    deliveredInjectIds: ["inj-001", "inj-002", "inj-003"]
  }
];

export const frameworkGraph: { nodes: FrameworkNode[]; edges: FrameworkEdge[] } = {
  nodes: [
    { id: "atlas", label: "MITRE ATLAS", type: "standard", domain: "AI Threats" },
    { id: "owasp-llm", label: "OWASP LLM Top 10", type: "standard", domain: "AI AppSec" },
    { id: "nist-ai-rmf", label: "NIST AI RMF", type: "standard", domain: "AI Governance" },
    { id: "rag-poisoning", label: "RAG Poisoning", type: "technique", domain: "AI Threats" },
    { id: "prompt-injection", label: "Prompt Injection", type: "technique", domain: "AI Threats" },
    { id: "vector-integrity", label: "Vector Store Integrity Control", type: "control", domain: "AI Governance" },
    { id: "clinical-ai", label: "Clinical AI Decision Support", type: "business-service", domain: "Healthcare" },
    { id: "trust-collapse", label: "Human-AI Trust Boundary Failure", type: "ai-risk", domain: "Operational Resilience" },
    { id: "scn-ai-rag-poisoning", label: "RAG Poisoning Clinical Crisis", type: "scenario", domain: "Simulation" }
  ],
  edges: [
    { source: "rag-poisoning", target: "atlas", relationship: "MAPS_TO" },
    { source: "prompt-injection", target: "owasp-llm", relationship: "MAPS_TO" },
    { source: "vector-integrity", target: "rag-poisoning", relationship: "MITIGATES" },
    { source: "clinical-ai", target: "trust-collapse", relationship: "AFFECTS" },
    { source: "scn-ai-rag-poisoning", target: "nist-ai-rmf", relationship: "EVIDENCES" }
  ]
};

export const auditEvents: AuditEvent[] = [
  {
    id: "aud-001",
    tenantId: "ten-sovereign-health",
    actor: "usr-demo",
    action: "simulation.started",
    resource: "ses-live-rag-001",
    createdAt: "2026-06-30T03:15:00.000Z",
    metadata: { scenarioId: "scn-ai-rag-poisoning" }
  },
  {
    id: "aud-002",
    tenantId: "ten-sovereign-health",
    actor: "ai-facilitator",
    action: "inject.generated",
    resource: "inj-002",
    createdAt: "2026-06-30T03:33:00.000Z",
    metadata: { severity: "Critical", standard: "OWASP LLM Top 10" }
  }
];
