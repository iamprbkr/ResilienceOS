export type Role =
  | "Admin"
  | "CEO"
  | "Board Chair"
  | "General Counsel"
  | "Comms Lead"
  | "CISO"
  | "CIO"
  | "Board"
  | "SOC Analyst"
  | "Risk Manager"
  | "Compliance Officer"
  | "Incident Responder"
  | "Privacy Officer"
  | "BCM Manager"
  | "AI Governance Officer";

export type SimulationModule =
  | "Executive Tabletop Exercise"
  | "AI Threat Simulation"
  | "Cyber Resilience"
  | "GRC & Compliance"
  | "Business Continuity"
  | "Crisis Management"
  | "Data Protection"
  | "Analytics";

export interface Tenant {
  id: string;
  name: string;
  sector: string;
  region: string;
  plan: "Launch" | "Scale" | "Sovereign";
}

export interface PlatformUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Invited" | "Suspended";
}

export interface NotificationItem {
  id: string;
  tenantId: string;
  title: string;
  detail: string;
  severity: "Info" | "Warning" | "Critical";
  read: boolean;
  createdAt: string;
}

export interface Scenario {
  id: string;
  tenantId: string;
  title: string;
  module: SimulationModule;
  difficulty: "Executive" | "Operational" | "Technical" | "Board";
  durationMinutes: number;
  threatActors: string[];
  standards: string[];
  roles: Role[];
  status: "Draft" | "Scheduled" | "Live" | "Completed";
  resilienceScore: number;
}

export interface ScenarioCreateInput {
  tenantId: string;
  title: string;
  module: SimulationModule;
  difficulty: "Executive" | "Operational" | "Technical" | "Board";
  durationMinutes: number;
  standards: string[];
  roles: Role[];
  objectives: string[];
}

export interface Inject {
  id: string;
  scenarioId: string;
  minute: number;
  title: string;
  channel: "SOC" | "Executive" | "Regulator" | "Media" | "AI Governance" | "Cloud Ops";
  severity: "Low" | "Medium" | "High" | "Critical";
  decisionRequired: boolean;
  aiGenerated: boolean;
}

export interface Scorecard {
  domain: string;
  score: number;
  target: number;
  trend: number;
}

export interface SimulationSession {
  id: string;
  tenantId: string;
  scenarioId: string;
  status: "Scheduled" | "Live" | "Paused" | "Completed";
  currentMinute: number;
  startedAt: string | null;
  participants: Array<{ role: Role; name: string; responseLatencySeconds: number }>;
  riskState: {
    trustImpact: number;
    operationalImpact: number;
    regulatoryImpact: number;
    containmentConfidence: number;
  };
  decisions: Decision[];
  deliveredInjectIds: string[];
}

export interface Decision {
  id: string;
  sessionId: string;
  injectId: string | null;
  role: Role;
  decision: string;
  rationale: string;
  responseTimeSeconds: number;
  createdAt: string;
}

export interface FrameworkNode {
  id: string;
  label: string;
  type: "standard" | "technique" | "control" | "business-service" | "ai-risk" | "scenario";
  domain: string;
}

export interface FrameworkEdge {
  source: string;
  target: string;
  relationship: "MAPS_TO" | "MITIGATES" | "EXERCISES" | "AFFECTS" | "EVIDENCES";
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  actor: string;
  action: string;
  resource: string;
  createdAt: string;
  metadata: Record<string, string | number | boolean>;
}

export interface UserContext {
  sub: string;
  tenantId: string;
  role: Role;
}

export interface GeneratedInject extends Inject {
  rationale: string;
  safetyReview: {
    approved: boolean;
    blockedTerms: string[];
    redactionsApplied: number;
  };
}

export interface AfterActionReport {
  scenarioId: string;
  title: string;
  executiveSummary: string;
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  mappedStandards: string[];
  decisionMetrics: {
    decisionsLogged: number;
    averageResponseSeconds: number;
  };
}

export type ThreatIntelSource = "cve" | "mitre-attack" | "otx" | "rss";

export interface ThreatIntelItem {
  id: string;
  tenantId: string;
  source: ThreatIntelSource;
  externalId: string;
  title: string;
  description: string;
  publishedAt: string;
  collectedAt: string;
  severity: "None" | "Low" | "Medium" | "High" | "Critical";
  ttpMappings: string[];
  affectedSectors: string[];
  relatedFrameworks: string[];
  rawData: Record<string, unknown>;
  processed: boolean;
}

export interface ThreatIntelCollection {
  id: string;
  startedAt: string;
  completedAt: string | null;
  source: ThreatIntelSource;
  itemsCollected: number;
  itemsNew: number;
  status: "running" | "completed" | "failed";
  error: string | null;
}

export interface GeneratedScenario extends Scenario {
  sourceIntelId: string;
  injects: Array<{
    title: string;
    channel: Inject["channel"];
    severity: Inject["severity"];
    minute: number;
    decisionRequired: boolean;
  }>;
}
