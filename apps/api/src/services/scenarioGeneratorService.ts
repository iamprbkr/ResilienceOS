import { repository } from "../repositories/index.js";
import { recordAuditEvent } from "./auditService.js";
import { assertPermission } from "./rbacService.js";
import { generateText, isAvailable } from "./aiProviderService.js";
import type { UserContext, ThreatIntelItem, GeneratedScenario, SimulationModule, Role } from "../types.js";

const DIFFICULTY_OPTIONS = ["Executive", "Operational", "Technical", "Board"] as const;
const MODULE_OPTIONS: SimulationModule[] = [
  "Executive Tabletop Exercise", "AI Threat Simulation", "Cyber Resilience",
  "GRC & Compliance", "Business Continuity", "Crisis Management", "Data Protection", "Analytics"
];

interface GenerateScenarioInput {
  intelId?: string;
  sector?: string;
  module?: SimulationModule;
  difficulty?: typeof DIFFICULTY_OPTIONS[number];
  frameworks?: string[];
}

const SECTOR_MODULES: Record<string, SimulationModule> = {
  Healthcare: "Executive Tabletop Exercise",
  Finance: "GRC & Compliance",
  "Critical Infrastructure": "Business Continuity",
  Government: "Crisis Management",
  Technology: "AI Threat Simulation",
  Telecom: "Cyber Resilience"
};

function generateInjects(difficulty: string): GeneratedScenario["injects"] {
  const base: GeneratedScenario["injects"] = [
    { title: "Initial incident report received from frontline team.", channel: "SOC", severity: "High", minute: 0, decisionRequired: true },
    { title: "Legal counsel advises on regulatory disclosure obligations.", channel: "Regulator", severity: "High", minute: 15, decisionRequired: true },
    { title: "Media inquiries begin; draft public statement needed.", channel: "Media", severity: "Medium", minute: 30, decisionRequired: true }
  ];
  if (difficulty === "Executive" || difficulty === "Board") {
    base.push(
      { title: "Board demands immediate briefing and action plan.", channel: "Executive", severity: "Critical", minute: 45, decisionRequired: true },
      { title: "Regulator escalates to formal investigation.", channel: "Regulator", severity: "Critical", minute: 60, decisionRequired: true }
    );
  }
  if (difficulty === "Operational" || difficulty === "Technical") {
    base.push(
      { title: "Backup systems show signs of compromise.", channel: "SOC", severity: "Critical", minute: 45, decisionRequired: true },
      { title: "Containment team reports lateral movement detected.", channel: "SOC", severity: "High", minute: 60, decisionRequired: true }
    );
  }
  return base;
}

function sectorRoles(sector?: string): Role[] {
  const base: Role[] = ["CISO", "CEO", "General Counsel"];
  const map: Record<string, Role[]> = {
    Healthcare: ["Privacy Officer", "AI Governance Officer"],
    Finance: ["Risk Manager", "Compliance Officer"],
    "Critical Infrastructure": ["BCM Manager", "Incident Responder"],
    Government: ["Board", "Compliance Officer"],
    Technology: ["AI Governance Officer", "SOC Analyst"],
    Telecom: ["Board", "Risk Manager"]
  };
  return [...base, ...(sector ? map[sector] ?? [] : [])];
}

function sectorFrameworks(sector?: string): string[] {
  const defaults = ["NIST CSF 2.0", "ISO 27001"];
  const map: Record<string, string[]> = {
    Healthcare: ["HIPAA", "HITRUST", "NIST CSF 2.0"],
    Finance: ["PCI DSS", "SOX", "DORA", "NIST CSF 2.0"],
    "Critical Infrastructure": ["NERC CIP", "TSA SD", "NIST CSF 2.0"],
    Government: ["FedRAMP", "NIST 800-53", "NIST CSF 2.0"],
    Technology: ["SOC 2", "ISO 27001", "EU AI Act", "NIST CSF 2.0"],
    Telecom: ["ISO 27001", "GDPR", "NIST CSF 2.0"]
  };
  return sector ? map[sector] ?? defaults : defaults;
}

function enrichWithIntel(item: ThreatIntelItem, sector?: string): {
  title: string;
  description: string;
  threatActors: string[];
  injects: GeneratedScenario["injects"];
  frameworks: string[];
} {
  const frameworks = item.relatedFrameworks.length > 0 ? item.relatedFrameworks : sectorFrameworks(sector);
  const ttpStr = item.ttpMappings.length > 0 ? ` (TTPs: ${item.ttpMappings.join(", ")})` : "";
  const title = `Exercise: ${item.title}${ttpStr}`;
  const desc = `Scenario generated from real threat intelligence: ${item.title}. ${item.description.slice(0, 500)}`;
  const threatActors = item.source === "cve" ? ["Exploit developer", "Opportunistic attacker"] : ["Advanced persistent threat", "Cybercrime group"];
  const injects = generateInjects("Executive");
  return { title, description: desc, threatActors, injects, frameworks };
}

function inferModuleFromIntel(item: ThreatIntelItem, preferred?: SimulationModule): SimulationModule {
  if (preferred) return preferred;
  if (item.affectedSectors.length > 0) {
    const mapped = SECTOR_MODULES[item.affectedSectors[0]];
    if (mapped) return mapped;
  }
  if (item.severity === "Critical" || item.severity === "High") return "Crisis Management";
  if (item.source === "cve") return "Cyber Resilience";
  return "Executive Tabletop Exercise";
}

export async function generateFromIntel(
  user: UserContext,
  intelId: string,
  input?: GenerateScenarioInput
): Promise<GeneratedScenario | null> {
  assertPermission(user.role, "scenario:write");
  const item = await repository.threatIntel.findById(user.tenantId, intelId);
  if (!item) return null;

  const aiAvail = await isAvailable();
  let scenario: GeneratedScenario;

  if (aiAvail) {
    scenario = await generateWithAI(user, item, input);
  } else {
    scenario = generateWithTemplates(user, item, input);
  }

  await repository.scenarios.create(scenario);
  for (const inj of scenario.injects) {
    await repository.injects.create({
      id: `inj-gen-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      scenarioId: scenario.id,
      minute: inj.minute,
      title: inj.title,
      channel: inj.channel,
      severity: inj.severity,
      decisionRequired: inj.decisionRequired,
      aiGenerated: true
    });
  }
  await recordAuditEvent(user, "scenario.generated_from_intel", scenario.id, { intelId, title: scenario.title });
  return scenario;
}

async function generateWithAI(user: UserContext, item: ThreatIntelItem, input?: GenerateScenarioInput): Promise<GeneratedScenario> {
  const module = input?.module ?? inferModuleFromIntel(item);
  const sector = input?.sector ?? item.affectedSectors[0] ?? "Technology";
  const difficulty = input?.difficulty ?? "Executive";
  const frameworks = input?.frameworks?.length ? input.frameworks : item.relatedFrameworks.length ? item.relatedFrameworks : sectorFrameworks(sector);

  const prompt = `You are an exercise scenario designer. Create a tabletop exercise scenario based on this real threat intelligence:

THREAT: ${item.title}
DESCRIPTION: ${item.description.slice(0, 1000)}
SOURCE: ${item.source}
SEVERITY: ${item.severity}
TTPs: ${item.ttpMappings.join(", ")}
SECTORS: ${item.affectedSectors.join(", ")}

Generate a scenario with:
- A compelling title (max 100 chars)
- A scenario summary (max 300 chars)  
- 3-5 decision injects (each with title, channel, severity, minute offset)

Return ONLY valid JSON with keys: title, summary, injects (array of {title, channel, severity, minute})

Channels: SOC, Executive, Regulator, Media
Severities: Low, Medium, High, Critical`;

  const system = "You are a tabletop exercise designer. Generate realistic, adaptive scenarios from threat intelligence. Return ONLY valid JSON.";
  const response = await generateText(prompt, system);

  let aiTitle = `Exercise: ${item.title}`;
  let aiSummary = `Scenario generated from ${item.source} threat intel: ${item.title}`;
  let aiInjects = generateInjects(difficulty);

  try {
    const parsed = JSON.parse(response) as { title?: string; summary?: string; injects?: Array<{ title: string; channel: string; severity: string; minute: number }> };
    if (parsed.title) aiTitle = parsed.title.slice(0, 100);
    if (parsed.summary) aiSummary = parsed.summary.slice(0, 300);
    if (parsed.injects?.length) {
      aiInjects = parsed.injects.map((inj, i) => ({
        title: inj.title,
        channel: (["SOC", "Executive", "Regulator", "Media"].includes(inj.channel) ? inj.channel : "Executive") as GeneratedScenario["injects"][0]["channel"],
        severity: (["Low", "Medium", "High", "Critical"].includes(inj.severity) ? inj.severity : "Medium") as GeneratedScenario["injects"][0]["severity"],
        minute: typeof inj.minute === "number" ? inj.minute : i * 20,
        decisionRequired: true
      }));
    }
  } catch { /* use template defaults */ }

  const threatActors = item.source === "cve" ? ["Exploit developer", "Opportunistic attacker"] : ["Advanced persistent threat", "Cybercrime group"];
  return {
    id: `scn-gen-${Date.now()}`,
    tenantId: user.tenantId,
    title: aiTitle,
    module: module ?? "Executive Tabletop Exercise",
    difficulty,
    durationMinutes: 90,
    threatActors,
    standards: frameworks,
    roles: sectorRoles(sector),
    status: "Draft",
    resilienceScore: 50,
    sourceIntelId: item.id,
    injects: aiInjects
  };
}

function generateWithTemplates(user: UserContext, item: ThreatIntelItem, input?: GenerateScenarioInput): GeneratedScenario {
  const module = input?.module ?? inferModuleFromIntel(item);
  const sector = input?.sector ?? item.affectedSectors[0] ?? "Technology";
  const difficulty = input?.difficulty ?? "Executive";
  const enriched = enrichWithIntel(item, sector);

  return {
    id: `scn-gen-${Date.now()}`,
    tenantId: user.tenantId,
    title: enriched.title.slice(0, 100),
    module,
    difficulty,
    durationMinutes: 90,
    threatActors: enriched.threatActors,
    standards: enriched.frameworks,
    roles: sectorRoles(sector),
    status: "Draft",
    resilienceScore: 50,
    sourceIntelId: item.id,
    injects: enriched.injects
  };
}

export async function generateOnDemand(user: UserContext, input: GenerateScenarioInput & { daysBack?: number }): Promise<GeneratedScenario | null> {
  const daysBack = input.daysBack ?? 7;
  const since = new Date(Date.now() - daysBack * 86400000).toISOString();
  const allIntel = await repository.threatIntel.listByTenant(user.tenantId, since);
  const unprocessed = allIntel.filter((item) => !item.processed);

  const base = unprocessed.length > 0 ? unprocessed : allIntel;
  if (base.length === 0) return null;

  const sector = input.sector ?? "Technology";
  const candidate = base.find((item) => item.affectedSectors.includes(sector)) ?? base[0];
  return generateFromIntel(user, candidate.id, input);
}
