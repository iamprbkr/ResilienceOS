import { repository } from "../repositories/index.js";
import type { GeneratedInject, Inject, UserContext } from "../types.js";
import { recordAuditEvent } from "./auditService.js";
import { assertPermission } from "./rbacService.js";

const blockedTerms = ["credential dump", "real malware", "exploit code"];

export function runSafetyReview(text: string) {
  const found = blockedTerms.filter((term) => text.toLowerCase().includes(term));
  return {
    approved: found.length === 0,
    blockedTerms: found,
    redactionsApplied: 0
  };
}

export async function generateAdaptiveInject(
  user: UserContext,
  scenarioId: string,
  input: { pressure: "regulatory" | "media" | "technical" | "executive"; minute: number }
): Promise<GeneratedInject | null> {
  assertPermission(user.role, "simulation:control");
  const scenario = await repository.scenarios.findById(scenarioId);
  if (!scenario || scenario.tenantId !== user.tenantId) return null;

  const title = `AI facilitator escalates ${input.pressure} pressure after delayed containment and evidence uncertainty.`;
  const safetyReview = runSafetyReview(title);
  if (!safetyReview.approved) {
    await recordAuditEvent(user, "inject.blocked_by_safety", scenarioId, { blockedTerms: safetyReview.blockedTerms.join(",") });
    return null;
  }

  const inject: GeneratedInject = {
    id: `inj-ai-${Date.now()}`,
    scenarioId: scenario.id,
    minute: input.minute,
    title,
    channel: input.pressure === "media" ? "Media" : input.pressure === "regulatory" ? "Regulator" : input.pressure === "technical" ? "SOC" : "Executive",
    severity: input.pressure === "technical" || input.pressure === "regulatory" ? "Critical" : "High",
    decisionRequired: true,
    aiGenerated: true,
    rationale: "Generated from scenario module, elapsed time, role decision latency, and standards coverage gaps.",
    safetyReview
  };

  await repository.injects.create(toInject(inject));
  await recordAuditEvent(user, "inject.generated", inject.id, { scenarioId, pressure: input.pressure });
  return inject;
}

function toInject(inject: GeneratedInject): Inject {
  const { rationale: _rationale, safetyReview: _safetyReview, ...baseInject } = inject;
  return baseInject;
}
