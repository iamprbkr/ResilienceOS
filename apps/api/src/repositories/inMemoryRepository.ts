import { auditEvents, frameworkGraph, injects, mappings, scenarios, scorecards, sessions, tenants } from "../data/seed.js";
import type { AuditEvent, Inject, Scenario, SimulationSession } from "../types.js";
import type { PlatformRepository } from "./types.js";

export const inMemoryRepository: PlatformRepository = {
  tenants: {
    findById: async (tenantId: string) => tenants.find((tenant) => tenant.id === tenantId)
  },
  scenarios: {
    listByTenant: async (tenantId: string) => scenarios.filter((scenario) => scenario.tenantId === tenantId),
    findById: async (scenarioId: string) => scenarios.find((scenario) => scenario.id === scenarioId),
    create: async (scenario: Scenario) => {
      scenarios.push(scenario);
      return scenario;
    },
    update: async (scenario: Scenario) => {
      const index = scenarios.findIndex((item) => item.id === scenario.id);
      if (index >= 0) scenarios[index] = scenario;
      return scenario;
    }
  },
  injects: {
    listByScenario: async (scenarioId: string) => injects.filter((inject) => inject.scenarioId === scenarioId),
    create: async (inject: Inject) => {
      injects.push(inject);
      return inject;
    }
  },
  sessions: {
    findById: async (sessionId: string) => sessions.find((session) => session.id === sessionId),
    listByTenant: async (tenantId: string) => sessions.filter((session) => session.tenantId === tenantId),
    create: async (session: SimulationSession) => {
      sessions.push(session);
      return session;
    },
    update: async (session: SimulationSession) => {
      const index = sessions.findIndex((item) => item.id === session.id);
      if (index >= 0) sessions[index] = session;
      return session;
    }
  },
  audit: {
    listByTenant: async (tenantId: string) => auditEvents.filter((event) => event.tenantId === tenantId),
    append: async (event: AuditEvent) => {
      auditEvents.push(event);
      return event;
    }
  },
  analytics: {
    scorecards: async () => scorecards,
    mappings: async () => mappings
  },
  standards: {
    graph: async () => frameworkGraph
  }
};
