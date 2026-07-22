import assert from "node:assert/strict";
import { generateAdaptiveInject } from "./services/aiOrchestrationService.js";
import { getCoverageByFramework, getStandardsGraph } from "./services/mappingService.js";
import { generateAfterActionReport } from "./services/reportService.js";
import { createScenario, listScenarios } from "./services/scenarioService.js";
import { advanceSimulation, logDecision, startSimulation } from "./services/simulationService.js";
import type { UserContext } from "./types.js";

const user: UserContext = {
  sub: "usr-selftest",
  tenantId: "ten-sovereign-health",
  role: "CISO"
};

const scenario = await createScenario(user, {
  tenantId: user.tenantId,
  title: "Self-Test AI Governance and Ransomware Convergence",
  module: "AI Threat Simulation",
  difficulty: "Executive",
  durationMinutes: 90,
  standards: ["MITRE ATLAS", "NIST AI RMF"],
  roles: ["CISO", "AI Governance Officer", "Board"],
  objectives: ["Validate service implementation"]
});

assert.ok((await listScenarios(user)).some((item) => item.id === scenario.id));

const session = await startSimulation(user, scenario.id);
assert.ok(session);
assert.equal(session.status, "Live");

const generatedInject = await generateAdaptiveInject(user, scenario.id, { pressure: "regulatory", minute: 22 });
assert.ok(generatedInject);
assert.equal(generatedInject.safetyReview.approved, true);

const advanced = await advanceSimulation(user, session.id, 30);
assert.ok(advanced);
assert.equal(advanced.currentMinute, 30);

const decision = await logDecision(user, session.id, {
  injectId: generatedInject.id,
  role: "CISO",
  decision: "Suspend affected AI workflow and preserve vector evidence.",
  rationale: "Patient safety and evidence integrity take priority.",
  responseTimeSeconds: 420
});
assert.ok(decision);

const graph = await getStandardsGraph();
assert.ok(graph.nodes.length > 0);
assert.ok(graph.edges.length > 0);
assert.ok((await getCoverageByFramework()).every((item) => item.coveragePercent > 0));

const report = await generateAfterActionReport(user, scenario.id);
assert.ok(report);
assert.equal(report.decisionMetrics.decisionsLogged, 1);

console.log("API self-test passed");
