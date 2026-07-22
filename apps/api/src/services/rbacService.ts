import type { Role } from "../types.js";

export type Permission = "scenario:read" | "scenario:write" | "simulation:control" | "decision:write" | "report:read";

const permissions: Record<Permission, Role[]> = {
  "scenario:read": [
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
  ],
  "scenario:write": ["Admin", "CEO", "CISO", "CIO", "Risk Manager", "Compliance Officer", "AI Governance Officer"],
  "simulation:control": ["Admin", "CEO", "CISO", "CIO", "Incident Responder", "BCM Manager", "AI Governance Officer"],
  "decision:write": [
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
  ],
  "report:read": ["Admin", "CEO", "Board Chair", "CISO", "CIO", "Board", "Risk Manager", "Compliance Officer", "AI Governance Officer"]
};

export function can(role: Role, permission: Permission) {
  return permissions[permission].includes(role);
}

export function assertPermission(role: Role, permission: Permission) {
  if (!can(role, permission)) {
    const error = new Error(`Role ${role} cannot perform ${permission}`);
    error.name = "ForbiddenError";
    throw error;
  }
}
