import { repository } from "../repositories/index.js";
import type { AuditEvent, UserContext } from "../types.js";

export function recordAuditEvent(
  user: UserContext,
  action: string,
  resource: string,
  metadata: AuditEvent["metadata"] = {}
) {
  return repository.audit.append({
    id: `aud-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    tenantId: user.tenantId,
    actor: user.sub,
    action,
    resource,
    createdAt: new Date().toISOString(),
    metadata
  });
}
