import { repository } from "../repositories/index.js";
import type { AfterActionReport, UserContext } from "../types.js";
import { assertPermission } from "./rbacService.js";
import { calculateAverageResponseSeconds, calculateRiskAdjustedScore } from "./scoringService.js";

export async function generateAfterActionReport(user: UserContext, scenarioId: string): Promise<AfterActionReport | null> {
  assertPermission(user.role, "report:read");
  const scenario = await repository.scenarios.findById(scenarioId);
  if (!scenario || scenario.tenantId !== user.tenantId) return null;

  const session = (await repository.sessions.listByTenant(user.tenantId)).find((item) => item.scenarioId === scenario.id);
  const deliveredInjects = session
    ? (await repository.injects.listByScenario(scenario.id)).filter((inject) => session.deliveredInjectIds.includes(inject.id))
    : [];
  const score = session ? calculateRiskAdjustedScore(session, deliveredInjects) : scenario.resilienceScore;
  const averageResponseSeconds = session ? calculateAverageResponseSeconds(session.decisions) : 0;

  return {
    scenarioId: scenario.id,
    title: scenario.title,
    executiveSummary:
      "The exercise tested cyber, AI governance, continuity, privacy, and executive response under converged operational pressure.",
    score,
    strengths: ["Cross-functional escalation", "Technical triage", "Standards-aware decision logging"],
    gaps: ["Evidence preservation timing", "Regulator communications", "Human-AI trust boundary ownership"],
    recommendations: [
      "Assign an AI incident commander for every high-risk model workflow",
      "Add vector-store integrity monitoring and rollback procedures",
      "Run quarterly executive deepfake and regulator-pressure simulations"
    ],
    mappedStandards: scenario.standards,
    decisionMetrics: {
      decisionsLogged: session?.decisions.length ?? 0,
      averageResponseSeconds
    }
  };
}
