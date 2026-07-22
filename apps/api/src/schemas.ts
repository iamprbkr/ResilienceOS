import { z } from "zod";

export const roleSchema = z.enum([
  "Admin",
  "CEO",
  "Board Chair",
  "General Counsel",
  "Comms Lead",
  "CISO",
  "CIO",
  "Board",
  "SOC Analyst",
  "Risk Manager",
  "Compliance Officer",
  "Incident Responder",
  "Privacy Officer",
  "BCM Manager",
  "AI Governance Officer"
]);

export const scenarioCreateSchema = z.object({
  tenantId: z.string().default("ten-sovereign-health"),
  title: z.string().min(8),
  module: z.enum([
    "Executive Tabletop Exercise",
    "AI Threat Simulation",
    "Cyber Resilience",
    "GRC & Compliance",
    "Business Continuity",
    "Crisis Management",
    "Data Protection",
    "Analytics"
  ]),
  difficulty: z.enum(["Executive", "Operational", "Technical", "Board"]),
  durationMinutes: z.number().int().min(15).max(480).default(90),
  standards: z.array(z.string()).default(["NIST CSF 2.0"]),
  roles: z.array(roleSchema).default(["CISO"]),
  objectives: z.array(z.string()).default([])
});

export const generateInjectSchema = z.object({
  pressure: z.enum(["regulatory", "media", "technical", "executive"]).default("executive"),
  minute: z.number().int().min(0).default(90)
});

export const advanceSimulationSchema = z.object({
  minutes: z.number().int().min(1).max(120).default(15)
});

export const decisionSchema = z.object({
  injectId: z.string().nullable().optional(),
  role: roleSchema,
  decision: z.string().min(3),
  rationale: z.string().default(""),
  responseTimeSeconds: z.number().int().min(0).max(86400)
});
