import type { AuditEvent, FrameworkEdge, FrameworkNode, Inject, Scenario, Scorecard, SimulationSession, Tenant, ThreatIntelItem, ThreatIntelCollection, ThreatIntelSource } from "../types.js";

export interface FrameworkMapping {
  framework: string;
  covered: number;
  total: number;
  domain: string;
}

export interface PlatformRepository {
  tenants: {
    findById: (tenantId: string) => Promise<Tenant | undefined>;
  };
  scenarios: {
    listByTenant: (tenantId: string) => Promise<Scenario[]>;
    findById: (scenarioId: string) => Promise<Scenario | undefined>;
    create: (scenario: Scenario) => Promise<Scenario>;
    update: (scenario: Scenario) => Promise<Scenario>;
  };
  injects: {
    listByScenario: (scenarioId: string) => Promise<Inject[]>;
    create: (inject: Inject) => Promise<Inject>;
  };
  sessions: {
    findById: (sessionId: string) => Promise<SimulationSession | undefined>;
    listByTenant: (tenantId: string) => Promise<SimulationSession[]>;
    create: (session: SimulationSession) => Promise<SimulationSession>;
    update: (session: SimulationSession) => Promise<SimulationSession>;
  };
  audit: {
    listByTenant: (tenantId: string) => Promise<AuditEvent[]>;
    append: (event: AuditEvent) => Promise<AuditEvent>;
  };
  analytics: {
    scorecards: (tenantId?: string) => Promise<Scorecard[]>;
    mappings: () => Promise<FrameworkMapping[]>;
  };
  standards: {
    graph: () => Promise<{ nodes: FrameworkNode[]; edges: FrameworkEdge[] }>;
  };
  threatIntel: {
    listByTenant: (tenantId: string, since?: string, source?: ThreatIntelSource) => Promise<ThreatIntelItem[]>;
    findById: (tenantId: string, intelId: string) => Promise<ThreatIntelItem | undefined>;
    findByExternalId: (tenantId: string, externalId: string) => Promise<ThreatIntelItem | undefined>;
    create: (item: ThreatIntelItem) => Promise<ThreatIntelItem>;
    update: (item: ThreatIntelItem) => Promise<ThreatIntelItem>;
    recordCollection: (collection: ThreatIntelCollection) => Promise<ThreatIntelCollection>;
    listCollections: () => Promise<ThreatIntelCollection[]>;
  };
}
