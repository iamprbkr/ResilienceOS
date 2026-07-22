import { repository } from "../repositories/index.js";

export function getStandardsGraph() {
  return repository.standards.graph();
}

export async function getCoverageByFramework() {
  const frameworkMappings = await repository.analytics.mappings();
  return frameworkMappings.map((mapping) => ({
    ...mapping,
    coveragePercent: Math.round((mapping.covered / mapping.total) * 100),
    gap: mapping.total - mapping.covered
  }));
}

export async function findRelatedControls(nodeId: string) {
  const graph = await repository.standards.graph();
  const relatedEdges = graph.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
  const relatedIds = new Set(relatedEdges.flatMap((edge) => [edge.source, edge.target]));
  return graph.nodes.filter((node) => relatedIds.has(node.id));
}
