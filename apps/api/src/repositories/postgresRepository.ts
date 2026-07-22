import { pool } from "./postgresClient.js";
import type { PlatformRepository } from "./types.js";
import type { AuditEvent, Decision, FrameworkEdge, FrameworkNode, Inject, Role, Scenario, SimulationSession } from "../types.js";

const rows = <T>(result: { rows: T[] }) => result.rows;

function scenarioFromRow(row: Record<string, unknown>): Scenario {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id),
    title: String(row.title),
    module: row.module as Scenario["module"],
    difficulty: row.difficulty as Scenario["difficulty"],
    durationMinutes: Number(row.duration_minutes),
    threatActors: row.threat_actors as string[],
    standards: row.standards as string[],
    roles: row.roles as Role[],
    status: row.status as Scenario["status"],
    resilienceScore: Number(row.resilience_score)
  };
}

function injectFromRow(row: Record<string, unknown>): Inject {
  return {
    id: String(row.id),
    scenarioId: String(row.scenario_id),
    minute: Number(row.minute),
    title: String(row.title),
    channel: row.channel as Inject["channel"],
    severity: row.severity as Inject["severity"],
    decisionRequired: Boolean(row.decision_required),
    aiGenerated: Boolean(row.ai_generated)
  };
}

async function decisionsBySession(sessionId: string): Promise<Decision[]> {
  const result = await pool.query(
    "select id, session_id, inject_id, role, decision, rationale, response_time_seconds, created_at from decisions where session_id = $1 order by created_at asc",
    [sessionId]
  );
  return rows<Record<string, unknown>>(result).map((row) => ({
    id: String(row.id),
    sessionId: String(row.session_id),
    injectId: row.inject_id ? String(row.inject_id) : null,
    role: row.role as Role,
    decision: String(row.decision),
    rationale: String(row.rationale),
    responseTimeSeconds: Number(row.response_time_seconds),
    createdAt: new Date(String(row.created_at)).toISOString()
  }));
}

async function sessionFromRow(row: Record<string, unknown>): Promise<SimulationSession> {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id),
    scenarioId: String(row.scenario_id),
    status: row.status as SimulationSession["status"],
    currentMinute: Number(row.current_minute),
    startedAt: row.started_at ? new Date(String(row.started_at)).toISOString() : null,
    participants: row.participants as SimulationSession["participants"],
    riskState: row.risk_state as SimulationSession["riskState"],
    decisions: await decisionsBySession(String(row.id)),
    deliveredInjectIds: row.delivered_inject_ids as string[]
  };
}

export const postgresRepository: PlatformRepository = {
  tenants: {
    async findById(tenantId) {
      const result = await pool.query("select id, name, sector, region, plan from tenants where id = $1", [tenantId]);
      const row = result.rows[0];
      return row ? { id: row.id, name: row.name, sector: row.sector, region: row.region, plan: row.plan } : undefined;
    }
  },
  scenarios: {
    async listByTenant(tenantId) {
      const result = await pool.query("select * from scenarios where tenant_id = $1 order by created_at desc", [tenantId]);
      return rows<Record<string, unknown>>(result).map(scenarioFromRow);
    },
    async findById(scenarioId) {
      const result = await pool.query("select * from scenarios where id = $1", [scenarioId]);
      return result.rows[0] ? scenarioFromRow(result.rows[0]) : undefined;
    },
    async create(scenario) {
      await pool.query(
        `insert into scenarios (id, tenant_id, title, module, difficulty, duration_minutes, threat_actors, standards, roles, status, resilience_score)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          scenario.id,
          scenario.tenantId,
          scenario.title,
          scenario.module,
          scenario.difficulty,
          scenario.durationMinutes,
          JSON.stringify(scenario.threatActors),
          JSON.stringify(scenario.standards),
          JSON.stringify(scenario.roles),
          scenario.status,
          scenario.resilienceScore
        ]
      );
      return scenario;
    },
    async update(scenario) {
      await pool.query(
        `update scenarios set title=$2, module=$3, difficulty=$4, duration_minutes=$5, threat_actors=$6, standards=$7, roles=$8, status=$9, resilience_score=$10 where id=$1`,
        [
          scenario.id,
          scenario.title,
          scenario.module,
          scenario.difficulty,
          scenario.durationMinutes,
          JSON.stringify(scenario.threatActors),
          JSON.stringify(scenario.standards),
          JSON.stringify(scenario.roles),
          scenario.status,
          scenario.resilienceScore
        ]
      );
      return scenario;
    }
  },
  injects: {
    async listByScenario(scenarioId) {
      const result = await pool.query("select * from injects where scenario_id = $1 order by minute asc", [scenarioId]);
      return rows<Record<string, unknown>>(result).map(injectFromRow);
    },
    async create(inject) {
      await pool.query(
        `insert into injects (id, scenario_id, minute, title, channel, severity, decision_required, ai_generated)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          inject.id,
          inject.scenarioId,
          inject.minute,
          inject.title,
          inject.channel,
          inject.severity,
          inject.decisionRequired,
          inject.aiGenerated
        ]
      );
      return inject;
    }
  },
  sessions: {
    async findById(sessionId) {
      const result = await pool.query("select * from simulation_sessions where id = $1", [sessionId]);
      return result.rows[0] ? sessionFromRow(result.rows[0]) : undefined;
    },
    async listByTenant(tenantId) {
      const result = await pool.query("select * from simulation_sessions where tenant_id = $1 order by created_at desc", [tenantId]);
      return Promise.all(rows<Record<string, unknown>>(result).map(sessionFromRow));
    },
    async create(session) {
      await pool.query(
        `insert into simulation_sessions (id, tenant_id, scenario_id, status, current_minute, started_at, participants, risk_state, delivered_inject_ids)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          session.id,
          session.tenantId,
          session.scenarioId,
          session.status,
          session.currentMinute,
          session.startedAt,
          JSON.stringify(session.participants),
          JSON.stringify(session.riskState),
          JSON.stringify(session.deliveredInjectIds)
        ]
      );
      return session;
    },
    async update(session) {
      await pool.query(
        `update simulation_sessions set status=$2, current_minute=$3, started_at=$4, participants=$5, risk_state=$6, delivered_inject_ids=$7 where id=$1`,
        [
          session.id,
          session.status,
          session.currentMinute,
          session.startedAt,
          JSON.stringify(session.participants),
          JSON.stringify(session.riskState),
          JSON.stringify(session.deliveredInjectIds)
        ]
      );
      for (const decision of session.decisions) {
        await pool.query(
          `insert into decisions (id, session_id, inject_id, role, decision, rationale, response_time_seconds, created_at)
           values ($1,$2,$3,$4,$5,$6,$7,$8)
           on conflict (id) do nothing`,
          [
            decision.id,
            decision.sessionId,
            decision.injectId,
            decision.role,
            decision.decision,
            decision.rationale,
            decision.responseTimeSeconds,
            decision.createdAt
          ]
        );
      }
      return session;
    }
  },
  audit: {
    async listByTenant(tenantId) {
      const result = await pool.query("select * from audit_events where tenant_id = $1 order by created_at desc", [tenantId]);
      return rows<Record<string, unknown>>(result).map((row) => ({
        id: String(row.id),
        tenantId: String(row.tenant_id),
        actor: String(row.actor),
        action: String(row.action),
        resource: String(row.resource),
        createdAt: new Date(String(row.created_at)).toISOString(),
        metadata: row.metadata as AuditEvent["metadata"]
      }));
    },
    async append(event) {
      await pool.query(
        `insert into audit_events (id, tenant_id, actor, action, resource, metadata, created_at)
         values ($1,$2,$3,$4,$5,$6,$7)`,
        [event.id, event.tenantId, event.actor, event.action, event.resource, JSON.stringify(event.metadata), event.createdAt]
      );
      return event;
    }
  },
  analytics: {
    async scorecards(tenantId = "ten-sovereign-health") {
      const result = await pool.query("select domain, score, target, trend from scorecards where tenant_id = $1 order by id", [tenantId]);
      return result.rows.map((row) => ({ domain: row.domain, score: row.score, target: row.target, trend: row.trend }));
    },
    async mappings() {
      const result = await pool.query("select framework, covered, total, domain from framework_mappings order by id");
      return result.rows.map((row) => ({ framework: row.framework, covered: row.covered, total: row.total, domain: row.domain }));
    }
  },
  standards: {
    async graph() {
      const [nodes, edges] = await Promise.all([
        pool.query("select id, label, type, domain from framework_nodes order by id"),
        pool.query("select source, target, relationship from framework_edges order by id")
      ]);
      return {
        nodes: nodes.rows as FrameworkNode[],
        edges: edges.rows as FrameworkEdge[]
      };
    }
  }
};
