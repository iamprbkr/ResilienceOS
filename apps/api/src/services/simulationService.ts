import { repository } from "../repositories/index.js";
import type { Decision, Role, SimulationSession, UserContext } from "../types.js";
import { recordAuditEvent } from "./auditService.js";
import { assertPermission } from "./rbacService.js";
import { calculateRiskAdjustedScore } from "./scoringService.js";

export async function startSimulation(user: UserContext, scenarioId: string) {
  assertPermission(user.role, "simulation:control");
  const scenario = await repository.scenarios.findById(scenarioId);
  if (!scenario || scenario.tenantId !== user.tenantId) return null;

  const session: SimulationSession = {
    id: `ses-${Date.now()}`,
    tenantId: scenario.tenantId,
    scenarioId: scenario.id,
    status: "Live",
    currentMinute: 0,
    startedAt: new Date().toISOString(),
    participants: scenario.roles.map((role) => ({ role, name: `${role} participant`, responseLatencySeconds: 0 })),
    riskState: {
      trustImpact: 40,
      operationalImpact: 35,
      regulatoryImpact: 30,
      containmentConfidence: 72
    },
    decisions: [],
    deliveredInjectIds: []
  };
  await repository.sessions.create(session);
  await repository.scenarios.update({ ...scenario, status: "Live" });
  await recordAuditEvent(user, "simulation.started", session.id, { scenarioId });
  return session;
}

export async function advanceSimulation(user: UserContext, sessionId: string, minutes: number) {
  assertPermission(user.role, "simulation:control");
  const session = await repository.sessions.findById(sessionId);
  if (!session || session.tenantId !== user.tenantId) return null;

  const scenarioInjects = await repository.injects.listByScenario(session.scenarioId);
  const nextMinute = Math.min(session.currentMinute + minutes, 480);
  const delivered = scenarioInjects
    .filter((inject) => inject.minute <= nextMinute)
    .map((inject) => inject.id);

  const updated = {
    ...session,
    currentMinute: nextMinute,
    deliveredInjectIds: Array.from(new Set([...session.deliveredInjectIds, ...delivered])),
    riskState: {
      trustImpact: Math.min(100, session.riskState.trustImpact + Math.round(minutes * 0.3)),
      operationalImpact: Math.min(100, session.riskState.operationalImpact + Math.round(minutes * 0.2)),
      regulatoryImpact: Math.min(100, session.riskState.regulatoryImpact + Math.round(minutes * 0.25)),
      containmentConfidence: Math.max(0, session.riskState.containmentConfidence - Math.round(minutes * 0.15))
    }
  };

  await repository.sessions.update(updated);
  await recordAuditEvent(user, "simulation.advanced", session.id, { minutes, currentMinute: updated.currentMinute });
  return updated;
}

export async function logDecision(
  user: UserContext,
  sessionId: string,
  input: { injectId?: string | null; role: Role; decision: string; rationale: string; responseTimeSeconds: number }
) {
  assertPermission(user.role, "decision:write");
  const session = await repository.sessions.findById(sessionId);
  if (!session || session.tenantId !== user.tenantId) return null;

  const decision: Decision = {
    id: `dec-${Date.now()}`,
    sessionId,
    injectId: input.injectId ?? null,
    role: input.role,
    decision: input.decision,
    rationale: input.rationale,
    responseTimeSeconds: input.responseTimeSeconds,
    createdAt: new Date().toISOString()
  };

  const updated = {
    ...session,
    decisions: [...session.decisions, decision],
    riskState: {
      ...session.riskState,
      containmentConfidence: Math.min(100, session.riskState.containmentConfidence + 6)
    }
  };
  await repository.sessions.update(updated);
  await recordAuditEvent(user, "decision.logged", decision.id, { sessionId, role: input.role });
  return decision;
}

export async function getSimulationSummary(user: UserContext, sessionId: string) {
  const session = await repository.sessions.findById(sessionId);
  if (!session || session.tenantId !== user.tenantId) return null;
  const deliveredInjects = (await repository.injects.listByScenario(session.scenarioId)).filter((inject) =>
    session.deliveredInjectIds.includes(inject.id)
  );
  return {
    ...session,
    deliveredInjects,
    calculatedScore: calculateRiskAdjustedScore(session, deliveredInjects)
  };
}
