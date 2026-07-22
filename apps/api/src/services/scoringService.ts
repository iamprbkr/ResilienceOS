import type { Decision, Inject, SimulationSession } from "../types.js";

export function calculateAverageResponseSeconds(decisions: Decision[]) {
  if (decisions.length === 0) return 0;
  return Math.round(decisions.reduce((sum, decision) => sum + decision.responseTimeSeconds, 0) / decisions.length);
}

export function calculateRiskAdjustedScore(session: SimulationSession, deliveredInjects: Inject[]) {
  const severityPenalty = deliveredInjects.reduce((sum, inject) => {
    const weights = { Low: 1, Medium: 2, High: 4, Critical: 7 };
    return sum + weights[inject.severity];
  }, 0);
  const responseBonus = Math.min(session.decisions.length * 4, 20);
  const confidenceBonus = Math.round(session.riskState.containmentConfidence * 0.22);
  const impactPenalty = Math.round(
    (session.riskState.trustImpact + session.riskState.operationalImpact + session.riskState.regulatoryImpact) * 0.08
  );

  return Math.max(0, Math.min(100, 72 + responseBonus + confidenceBonus - severityPenalty - impactPenalty));
}

export function calculateDomainScore(domain: string, score: number, target: number) {
  return {
    domain,
    score,
    target,
    gap: Math.max(0, target - score),
    status: score >= target ? "On Target" : score >= target - 10 ? "Watch" : "Needs Action"
  };
}
