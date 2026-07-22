import { repository } from "../repositories/index.js";
import type { Scenario, ScenarioCreateInput, UserContext } from "../types.js";
import { recordAuditEvent } from "./auditService.js";
import { assertPermission } from "./rbacService.js";

export async function listScenarios(user: UserContext) {
  assertPermission(user.role, "scenario:read");
  return repository.scenarios.listByTenant(user.tenantId);
}

export async function getScenarioForTenant(user: UserContext, scenarioId: string) {
  assertPermission(user.role, "scenario:read");
  const scenario = await repository.scenarios.findById(scenarioId);
  if (!scenario || scenario.tenantId !== user.tenantId) return null;
  return scenario;
}

export async function createScenario(user: UserContext, input: ScenarioCreateInput) {
  assertPermission(user.role, "scenario:write");
  if (input.tenantId !== user.tenantId) {
    const error = new Error("Tenant mismatch");
    error.name = "ForbiddenError";
    throw error;
  }

  const scenario: Scenario = {
    id: `scn-${Date.now()}`,
    tenantId: input.tenantId,
    title: input.title,
    module: input.module,
    difficulty: input.difficulty,
    durationMinutes: input.durationMinutes,
    threatActors: inferThreatActors(input.module),
    standards: input.standards,
    roles: input.roles,
    status: "Draft",
    resilienceScore: 0
  };

  await repository.scenarios.create(scenario);
  await recordAuditEvent(user, "scenario.created", scenario.id, { module: scenario.module, difficulty: scenario.difficulty });
  return scenario;
}

function inferThreatActors(module: Scenario["module"]) {
  const actors: Record<Scenario["module"], string[]> = {
    "Executive Tabletop Exercise": ["Regulator pressure", "Media escalation", "Executive decision paralysis"],
    "AI Threat Simulation": ["Autonomous AI attacker agent", "Synthetic identity operator"],
    "Cyber Resilience": ["Ransomware affiliate", "Cloud access broker"],
    "GRC & Compliance": ["Regulatory escalation", "Third-party risk failure"],
    "Business Continuity": ["SaaS dependency outage", "Cross-region disruption"],
    "Crisis Management": ["Misinformation network", "Deepfake impersonation crew"],
    "Data Protection": ["Insider data misuse", "Cross-border privacy incident"],
    Analytics: ["Control coverage drift", "Resilience scoring anomaly"]
  };
  return actors[module];
}
