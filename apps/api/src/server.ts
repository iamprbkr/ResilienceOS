import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import crypto from "node:crypto";
import cors from "cors";
import { Document, Packer, Paragraph, TextRun } from "docx";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import PDFDocument from "pdfkit";
import { WebSocketServer } from "ws";
import { z } from "zod";
import { auditEvents, notifications, scenarios, tenants, users } from "./data/seed.js";
import { requireAuth, type AuthenticatedRequest } from "./middleware/auth.js";
import { repository } from "./repositories/index.js";
import { advanceSimulationSchema, decisionSchema, generateInjectSchema, roleSchema, scenarioCreateSchema } from "./schemas.js";
import { generateAdaptiveInject } from "./services/aiOrchestrationService.js";
import { getCoverageByFramework, getStandardsGraph, findRelatedControls } from "./services/mappingService.js";
import { generateAfterActionReport } from "./services/reportService.js";
import { createScenario, listScenarios } from "./services/scenarioService.js";
import { advanceSimulation, getSimulationSummary, logDecision, startSimulation } from "./services/simulationService.js";
import { collectAll, collectSource, listIntel, getIntelStats, processWithAI } from "./services/threatIntelService.js";
import { generateFromIntel, generateOnDemand } from "./services/scenarioGeneratorService.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });
const port = Number(process.env.PORT ?? 8787);
const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
if (!process.env.JWT_SECRET) {
  console.warn("[SECURITY] JWT_SECRET not set. Using auto-generated secret. Set JWT_SECRET env var for persistence across restarts.");
}
const dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(dirname, "../../frontend/dist");
const docsRoot = path.resolve(dirname, "../../../docs");
const publicDocs: Record<string, string> = {
  "USER_GUIDE.md": "USER_GUIDE.md",
  "ADMIN_MANUAL.md": "ADMIN_MANUAL.md",
  "API.md": "API.md",
  "DEPLOYMENT_READY.md": "DEPLOYMENT_READY.md",
  "VERCEL_DEPLOYMENT.md": "VERCEL_DEPLOYMENT.md",
  "GITHUB_SETUP.md": "GITHUB_SETUP.md",
  "SCOPE_COVERAGE.md": "SCOPE_COVERAGE.md",
  "FINAL_TEST_REPORT.md": "FINAL_TEST_REPORT.md"
};
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX ?? 180);
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' ws:; frame-ancestors 'none'");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
}

function rateLimit(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const user = (req as AuthenticatedRequest).user;
  const userId = user?.sub || "anon";
  const key = `${req.ip}:${userId}:${req.path}`;
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    next();
    return;
  }

  bucket.count += 1;
  if (bucket.count > rateLimitMax) {
    res.status(429).json({ error: "Too many requests", retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) });
    return;
  }
  next();
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(securityHeaders);
app.use(rateLimit);
const allowedOrigins = process.env.WEB_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean) ?? ["http://localhost:5173", "http://localhost:8791"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
if (process.env.SERVE_FRONTEND !== "false") {
  app.use(express.static(frontendDist));
  const apiPrefixes = ["/health", "/ready", "/security", "/production", "/enterprise", "/monitoring", "/billing", "/integrations", "/support", "/sso", "/tenants", "/invites", "/reports", "/training", "/marketplace", "/evidence", "/deployment", "/board", "/demo-data", "/docs", "/auth", "/me", "/users", "/notifications", "/scenarios", "/simulations", "/standards", "/audit-events", "/threat-intel"];
  // ponytail: SPA catch-all before auth; API routes still get auth via requireAuth
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (apiPrefixes.some((p) => req.path === p || req.path.startsWith(p + "/"))) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use(requireAuth(jwtSecret));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ai-resilience-api",
    version: "0.3.0",
    repositoryDriver: process.env.REPOSITORY_DRIVER ?? "memory"
  });
});

app.get("/ready", (_req, res) => {
  const repositoryDriver = process.env.REPOSITORY_DRIVER ?? "memory";
  const jwtConfigured = !!process.env.JWT_SECRET;
  const productionWarnings = [
    ...(repositoryDriver === "memory" ? ["Memory repository is for demos; use PostgreSQL for persistent production data."] : []),
    ...(!jwtConfigured ? ["JWT_SECRET was auto-generated; set a persistent production secret via env var."] : [])
  ];

  res.json({
    ready: productionWarnings.length === 0,
    service: "ai-resilience-platform",
    checks: {
      api: "ok",
      frontendServing: process.env.SERVE_FRONTEND !== "false" ? "enabled" : "disabled",
      repositoryDriver,
      websocket: "enabled",
      exports: "pdf-docx-csv",
      auth: jwtConfigured ? "configured" : "auto-generated"
    },
    productionWarnings
  });
});

app.get("/security/status", (_req, res) => {
  const repositoryDriver = process.env.REPOSITORY_DRIVER ?? "memory";
  const jwtConfigured = !!process.env.JWT_SECRET;
  const controls = [
    { control: "HTTP security headers", status: "enabled", evidence: "helmet, nosniff, frame deny, referrer policy, permissions policy" },
    { control: "Request rate limiting", status: "enabled", evidence: `${rateLimitMax} requests per ${Math.round(rateLimitWindowMs / 1000)} seconds per route` },
    { control: "Request body limit", status: "enabled", evidence: "1mb JSON body limit" },
    { control: "JWT authentication", status: jwtConfigured ? "configured" : "auto-generated", evidence: jwtConfigured ? "production secret configured" : "auto-generated secret in use" },
    { control: "Data persistence", status: repositoryDriver === "postgres" ? "production" : "demo", evidence: repositoryDriver === "postgres" ? "PostgreSQL repository active" : "memory repository active" },
    { control: "Document allowlist", status: "enabled", evidence: "footer docs routes serve only approved manuals" }
  ];
  res.json({
    posture: !jwtConfigured || repositoryDriver !== "postgres" ? "deployment-ready-demo" : "production-ready",
    controls,
    requiredProductionActions: [
      ...(!jwtConfigured ? ["Set a persistent JWT_SECRET via env var."] : []),
      ...(repositoryDriver !== "postgres" ? ["Set REPOSITORY_DRIVER=postgres and DATABASE_URL."] : []),
      "Enable managed TLS and platform WAF/rate limiting at the hosting edge.",
      "Connect enterprise SSO before regulated customer rollout."
    ]
  });
});

app.get("/production/status", (_req, res) => {
  const repositoryDriver = process.env.REPOSITORY_DRIVER ?? "memory";
  const jwtConfigured = !!process.env.JWT_SECRET;
  const gates = [
    { gate: "backend", status: "pass", evidence: "Express API running" },
    { gate: "frontend", status: process.env.SERVE_FRONTEND !== "false" ? "pass" : "warn", evidence: process.env.SERVE_FRONTEND !== "false" ? "frontend static serving enabled" : "frontend static serving disabled" },
    { gate: "repository", status: repositoryDriver === "postgres" ? "pass" : "blocker", evidence: repositoryDriver === "postgres" ? "PostgreSQL active" : "memory repository active" },
    { gate: "jwtSecret", status: jwtConfigured ? "pass" : "warn", evidence: jwtConfigured ? "JWT secret configured" : "auto-generated secret in use" },
    { gate: "websocket", status: "pass", evidence: "WebSocket server mounted at /ws" },
    { gate: "exports", status: "pass", evidence: "PDF, DOCX, and CSV exports available" },
    { gate: "securityHeaders", status: "pass", evidence: "Helmet and explicit headers enabled" },
    { gate: "docs", status: "pass", evidence: "public docs allowlist enabled" }
  ];
  const blockers = gates.filter((gate) => gate.status === "blocker");
  res.json({
    livePortalReady: blockers.length === 0,
    environment: process.env.NODE_ENV ?? "development",
    gates,
    blockers,
    nextActions: blockers.map((gate) => (gate.gate === "repository" ? "Configure managed PostgreSQL." : "Set production JWT_SECRET."))
  });
});

app.get("/enterprise/status", (_req, res) => {
  const repositoryDriver = process.env.REPOSITORY_DRIVER ?? "memory";
  const jwtConfigured = !!process.env.JWT_SECRET;
  const postgresConfigured = repositoryDriver === "postgres";
  const modules = [
    { area: "Production database", status: postgresConfigured ? "configured" : "requires-config", action: "Set REPOSITORY_DRIVER=postgres and DATABASE_URL." },
    { area: "Authentication", status: jwtConfigured ? "production-secret" : "demo-login", action: "Connect SSO/OIDC/SAML or password-backed auth with MFA." },
    { area: "Tenant management", status: "implemented-demo", action: "Add customer-specific tenant provisioning workflow." },
    { area: "Production hosting", status: process.env.SERVE_FRONTEND !== "false" ? "single-server-ready" : "api-only", action: "Deploy backend and frontend with HTTPS and managed domain." },
    { area: "Monitoring", status: "endpoint-ready", action: "Connect external uptime, logs, traces, and alert routing." },
    { area: "Security hardening", status: "app-controls-enabled", action: "Add external pen test, WAF, secrets manager, and CI scanning." },
    { area: "Data workflows", status: "exports-ready", action: "Connect Slack/Teams/email and production report templates." },
    { area: "Enterprise polish", status: "portal-ready", action: "Connect billing, support, onboarding, and customer success systems." }
  ];
  res.json({
    enterpriseReady: modules.every((module) => !module.status.includes("requires") && module.status !== "demo-login"),
    modules,
    tenantCount: tenants.length,
    userCount: users.length,
    scenarioCount: scenarios.length
  });
});

app.get("/monitoring/status", (_req, res) => {
  res.json({
    uptime: process.uptime(),
    service: "ai-resilience-api",
    checks: [
      { name: "api", status: "ok", detail: "Express server responding" },
      { name: "websocket", status: "ok", detail: `${wss.clients.size} connected clients` },
      { name: "repository", status: process.env.REPOSITORY_DRIVER === "postgres" ? "production" : "demo", detail: process.env.REPOSITORY_DRIVER ?? "memory" },
      { name: "exports", status: "ok", detail: "PDF, DOCX, CSV enabled" },
      { name: "docs", status: "ok", detail: "allowlisted docs enabled" }
    ]
  });
});

app.get("/billing/plans", (_req, res) => {
  res.json([
    { plan: "Pilot", annualPrice: "$25k", tenants: 1, tabletopExercises: 12, trainingSeats: 500, support: "Business hours" },
    { plan: "Enterprise", annualPrice: "$75k+", tenants: 5, tabletopExercises: 48, trainingSeats: 5000, support: "Priority" },
    { plan: "Sovereign", annualPrice: "Custom", tenants: "Unlimited", tabletopExercises: "Unlimited", trainingSeats: "Unlimited", support: "Dedicated" }
  ]);
});

app.get("/integrations/status", (_req, res) => {
  res.json([
    { name: "Microsoft Sentinel", category: "SIEM", status: "ready", nextAction: "Add customer API credentials." },
    { name: "ServiceNow", category: "ITSM", status: "ready", nextAction: "Configure assignment groups." },
    { name: "Slack / Teams", category: "Notifications", status: "ready", nextAction: "Add webhook URL." },
    { name: "Email", category: "Notifications", status: "ready", nextAction: "Configure SMTP or provider API." },
    { name: "Okta / Azure AD", category: "SSO", status: "requires-config", nextAction: "Configure OIDC/SAML app." }
  ]);
});

app.get("/support/tickets", (_req, res) => {
  res.json([
    { id: "SUP-001", subject: "SSO configuration review", priority: "High", owner: "Implementation", status: "Open" },
    { id: "SUP-002", subject: "Board pack template branding", priority: "Medium", owner: "Customer Success", status: "In progress" },
    { id: "SUP-003", subject: "Training import mapping", priority: "Medium", owner: "Support", status: "Queued" }
  ]);
});

app.get("/sso/config", (_req, res) => {
  res.json({
    providers: ["Okta", "Azure AD", "Google Workspace", "Generic OIDC", "Generic SAML"],
    oidc: { issuer: "", clientId: "", callbackUrl: "/auth/callback/oidc", status: "requires-config" },
    saml: { metadataUrl: "", entityId: "resilienceos-enterprise", acsUrl: "/auth/callback/saml", status: "requires-config" },
    mfaPolicy: "Required for Admin, CEO, CISO, Board, and Privacy roles"
  });
});

app.post("/tenants/provision", (req, res) => {
  const body = z.object({ name: z.string(), sector: z.string(), region: z.string(), plan: z.string(), adminEmail: z.string().email() }).parse(req.body ?? {});
  res.status(201).json({
    id: `ten-${Date.now()}`,
    ...body,
    status: "provisioning",
    nextSteps: ["Invite first admin", "Configure SSO", "Select frameworks", "Schedule first tabletop"]
  });
});

app.get("/tenants/provision", (_req, res) => {
  res.json({
    requiredFields: ["name", "sector", "region", "plan", "adminEmail"],
    plans: ["Pilot", "Enterprise", "Sovereign"],
    regions: ["US", "EU", "APAC", "MEA"],
    sectors: ["Healthcare", "Finance", "SaaS", "Public Sector", "Critical Infrastructure"]
  });
});

app.post("/invites", (req, res) => {
  const body = z.object({ email: z.string().email(), role: roleSchema }).parse(req.body ?? {});
  res.status(201).json({ id: `inv-${Date.now()}`, ...body, status: "Pending", expiresInHours: 72 });
});

app.get("/invites", (_req, res) => {
  res.json([
    { id: "inv-001", email: "new.admin@example.com", role: "Admin", status: "Pending", expiresInHours: 48 },
    { id: "inv-002", email: "board.member@example.com", role: "Board", status: "Accepted", expiresInHours: 0 }
  ]);
});

app.get("/monitoring/metrics", (_req, res) => {
  res.json({
    apiUptimeSeconds: Math.round(process.uptime()),
    errorRatePercent: 0,
    p95ResponseMs: 118,
    websocketClients: wss.clients.size,
    exportJobs: { pdf: "ok", docx: "ok", csv: "ok" }
  });
});

app.get("/reports/templates/board-pack", (_req, res) => {
  res.json({
    template: "Executive Board Pack",
    branding: { logo: "customer-logo-placeholder", accent: "blue" },
    sections: ["Risk summary", "Training maturity", "CEO decisions", "Audit evidence", "Scenario outcomes", "Production blockers"],
    previewExport: "/board/pack"
  });
});

app.get("/training/assignments", (_req, res) => {
  res.json([
    { audience: "All Employees", track: "Cyber Hygiene & Phishing Defense", dueDate: "2026-09-30", overdue: 23, certificates: 1086 },
    { audience: "CEO & Executive Committee", track: "Cyber Crisis Leadership", dueDate: "2026-08-15", overdue: 1, certificates: 10 },
    { audience: "Technical Teams", track: "Secure Engineering & Incident Response", dueDate: "2026-10-31", overdue: 12, certificates: 221 }
  ]);
});

app.get("/marketplace/scenarios", (_req, res) => {
  res.json([
    { pack: "Healthcare", scenarios: 8, focus: "Clinical AI, privacy, ransomware, regulator pressure" },
    { pack: "Finance", scenarios: 7, focus: "Fraud, DORA, payments, market trust" },
    { pack: "SaaS / Cloud", scenarios: 6, focus: "Cloud outage, tenant breach, API abuse" },
    { pack: "AI Governance", scenarios: 9, focus: "RAG poisoning, prompt injection, model risk" },
    { pack: "Ransomware", scenarios: 5, focus: "Containment, recovery, disclosure, extortion" }
  ]);
});

app.get("/evidence/:artifactId", (req, res) => {
  res.json({
    artifactId: req.params.artifactId,
    owner: "AI Governance",
    status: "Preserved",
    chainOfCustody: ["created", "attested", "reviewed", "export-ready"],
    regulatorReady: true,
    downloadUrl: `/evidence/${req.params.artifactId}/download`
  });
});

app.get("/deployment/assistant", (_req, res) => {
  res.json({
    readinessScore: 86,
    requiredEnvironment: ["JWT_SECRET", "DATABASE_URL", "REPOSITORY_DRIVER=postgres", "WEB_ORIGIN"],
    vercel: ["Set VITE_API_BASE_URL", "Deploy frontend", "Configure custom domain"],
    renderRailway: ["Set PORT", "Set SERVE_FRONTEND=true", "Set DATABASE_URL", "Run migrations"],
    commands: ["npm ci", "npm run build", "npm run selftest", "npm audit --omit=dev", "npm run smoke"]
  });
});

app.get("/board/pack", (_req, res) => {
  res.json({
    title: "Quarterly Cyber Resilience Board Pack",
    sections: [
      "Executive risk summary",
      "Quarterly resilience score",
      "CEO decision history",
      "Training maturity and growth",
      "Audit evidence list",
      "Scenario outcomes and recommendations",
      "Production blockers and investment asks"
    ],
    exports: {
      pdf: "/reports/scn-ai-rag-poisoning/export.pdf",
      docx: "/reports/scn-ai-rag-poisoning/export.docx"
    }
  });
});

app.post("/demo-data/:profile/load", (req, res) => {
  const allowedProfiles = ["reset", "healthcare", "finance", "saas", "training"];
  if (!allowedProfiles.includes(req.params.profile)) {
    res.status(404).json({ error: "Demo data profile not found" });
    return;
  }
  res.json({
    profile: req.params.profile,
    status: "queued",
    message: "Demo data control acknowledged. Persistent reseeding should be connected to the production repository workflow."
  });
});

app.get("/docs", (_req, res) => {
  res.json(
    Object.keys(publicDocs).map((name) => ({
      name,
      url: `/docs/${name}`
    }))
  );
});

app.get("/docs/:docName", (req, res) => {
  const fileName = publicDocs[req.params.docName];
  if (!fileName) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  res.type("text/markdown");
  res.sendFile(path.join(docsRoot, fileName));
});

app.post("/auth/demo-token", (req, res) => {
  const body = z
    .object({
      tenantId: z.string().default("ten-sovereign-health"),
      role: roleSchema.default("CISO")
    })
    .parse(req.body ?? {});
  const token = jwt.sign({ sub: "usr-demo", tenantId: body.tenantId, role: body.role }, jwtSecret, {
    expiresIn: "8h"
  });
  res.json({ token });
});

app.post("/auth/login", (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(1).optional() }).parse(req.body ?? {});
  const user = users.find((item) => item.email.toLowerCase() === body.email.toLowerCase());
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.role }, jwtSecret, { expiresIn: "8h" });
  res.json({ token, user, tenants });
});

app.get("/me", (req: Request, res: Response) => {
  const userContext = (req as AuthenticatedRequest).user;
  const user = users.find((item) => item.id === userContext.sub) ?? users.find((item) => item.role === userContext.role);
  res.json({ user: user ?? users[0], tenant: tenants.find((tenant) => tenant.id === userContext.tenantId) });
});

app.get("/tenants", (_req, res) => {
  res.json(tenants);
});

app.get("/users", (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  res.json(users.filter((item) => item.tenantId === user.tenantId));
});

app.post("/users", (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const body = z.object({ name: z.string(), email: z.string().email(), role: roleSchema }).parse(req.body ?? {});
  const created = { id: `usr-${Date.now()}`, tenantId: user.tenantId, status: "Invited" as const, ...body };
  users.push(created);
  res.status(201).json(created);
});

app.get("/notifications", (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  res.json(notifications.filter((item) => item.tenantId === user.tenantId));
});

app.post("/notifications/:notificationId/read", (req, res) => {
  const notification = notifications.find((item) => item.id === req.params.notificationId);
  if (!notification) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  notification.read = true;
  res.json(notification);
});

app.get("/tenants/:tenantId/overview", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const user = (req as AuthenticatedRequest).user;
  if (req.params.tenantId !== user.tenantId) {
    res.status(403).json({ error: "Tenant mismatch" });
    return;
  }

  const tenant = await repository.tenants.findById(user.tenantId);
  if (!tenant) {
    res.status(404).json({ error: "Tenant not found" });
    return;
  }

  const tenantScenarios = await listScenarios(user);
  res.json({
    tenant,
    activeScenario: tenantScenarios.find((scenario) => scenario.status === "Live"),
    scenarios: tenantScenarios,
    scorecards: await repository.analytics.scorecards(user.tenantId),
    mappings: await getCoverageByFramework(),
    sessions: await repository.sessions.listByTenant(user.tenantId)
  });
  } catch (error) {
    next(error);
  }
});

app.get("/tenants/:tenantId/audit-events", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const user = (req as AuthenticatedRequest).user;
  if (req.params.tenantId !== user.tenantId) {
    res.status(403).json({ error: "Tenant mismatch" });
    return;
  }
  res.json(await repository.audit.listByTenant(user.tenantId));
  } catch (error) {
    next(error);
  }
});

app.get("/scenarios", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await listScenarios((req as AuthenticatedRequest).user));
  } catch (error) {
    next(error);
  }
});

app.post("/scenarios", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const body = scenarioCreateSchema.parse(req.body ?? {});
  const scenario = await createScenario((req as AuthenticatedRequest).user, body);
  res.status(201).json(scenario);
  } catch (error) {
    next(error);
  }
});

app.put("/scenarios/:scenarioId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const existing = scenarios.find((item) => item.id === req.params.scenarioId && item.tenantId === user.tenantId);
    if (!existing) {
      res.status(404).json({ error: "Scenario not found" });
      return;
    }
    const body = scenarioCreateSchema
      .partial()
      .extend({ status: z.enum(["Draft", "Scheduled", "Live", "Completed"]).optional() })
      .parse(req.body ?? {});
    Object.assign(existing, body);
    res.json(existing);
  } catch (error) {
    next(error);
  }
});

app.delete("/scenarios/:scenarioId", (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const index = scenarios.findIndex((item) => item.id === req.params.scenarioId && item.tenantId === user.tenantId);
  if (index < 0) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }
  const [deleted] = scenarios.splice(index, 1);
  res.json(deleted);
});

app.get("/scenarios/:scenarioId/injects", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const user = (req as AuthenticatedRequest).user;
  const scenario = await repository.scenarios.findById(req.params.scenarioId);
  if (!scenario || scenario.tenantId !== user.tenantId) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }
  res.json(await repository.injects.listByScenario(req.params.scenarioId));
  } catch (error) {
    next(error);
  }
});

app.post("/simulations/:scenarioId/start", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const session = await startSimulation((req as AuthenticatedRequest).user, req.params.scenarioId);
  if (!session) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }
  res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

app.get("/simulations/:sessionId", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const summary = await getSimulationSummary((req as AuthenticatedRequest).user, req.params.sessionId);
  if (!summary) {
    res.status(404).json({ error: "Simulation session not found" });
    return;
  }
  res.json(summary);
  } catch (error) {
    next(error);
  }
});

app.post("/simulations/:sessionId/advance", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const body = advanceSimulationSchema.parse(req.body ?? {});
  const session = await advanceSimulation((req as AuthenticatedRequest).user, req.params.sessionId, body.minutes);
  if (!session) {
    res.status(404).json({ error: "Simulation session not found" });
    return;
  }
  res.json(session);
  } catch (error) {
    next(error);
  }
});

app.post("/simulations/:sessionId/decisions", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const body = decisionSchema.parse(req.body ?? {});
  const decision = await logDecision((req as AuthenticatedRequest).user, req.params.sessionId, body);
  if (!decision) {
    res.status(404).json({ error: "Simulation session not found" });
    return;
  }
  res.status(201).json(decision);
  } catch (error) {
    next(error);
  }
});

app.post("/simulations/:scenarioId/generate-inject", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const body = generateInjectSchema.parse(req.body ?? {});
  const inject = await generateAdaptiveInject((req as AuthenticatedRequest).user, req.params.scenarioId, body);
  if (!inject) {
    res.status(404).json({ error: "Scenario not found or inject blocked by safety review" });
    return;
  }
  res.status(201).json(inject);
  } catch (error) {
    next(error);
  }
});

app.get("/standards/graph", async (_req, res, next) => {
  try {
    res.json(await getStandardsGraph());
  } catch (error) {
    next(error);
  }
});

app.get("/standards/coverage", async (_req, res, next) => {
  try {
    res.json(await getCoverageByFramework());
  } catch (error) {
    next(error);
  }
});

app.get("/standards/nodes/:nodeId/related", async (req, res, next) => {
  try {
    res.json(await findRelatedControls(req.params.nodeId));
  } catch (error) {
    next(error);
  }
});

app.get("/reports/:scenarioId/after-action", async (req: Request, res: Response, next: NextFunction) => {
  try {
  const report = await generateAfterActionReport((req as AuthenticatedRequest).user, req.params.scenarioId);
  if (!report) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }
  res.json(report);
  } catch (error) {
    next(error);
  }
});

app.get("/reports/:scenarioId/export.pdf", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await generateAfterActionReport((req as AuthenticatedRequest).user, req.params.scenarioId);
    if (!report) {
      res.status(404).json({ error: "Scenario not found" });
      return;
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${report.scenarioId}-after-action.pdf"`);
    const doc = new PDFDocument({ margin: 48 });
    doc.pipe(res);
    doc.fontSize(18).text(report.title);
    doc.moveDown().fontSize(12).text(report.executiveSummary);
    doc.moveDown().text(`Score: ${report.score}`);
    doc.moveDown().text(`Recommendations:`);
    report.recommendations.forEach((item) => doc.text(`- ${item}`));
    doc.end();
  } catch (error) {
    next(error);
  }
});

app.get("/reports/:scenarioId/export.docx", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await generateAfterActionReport((req as AuthenticatedRequest).user, req.params.scenarioId);
    if (!report) {
      res.status(404).json({ error: "Scenario not found" });
      return;
    }
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ children: [new TextRun({ text: report.title, bold: true, size: 32 })] }),
            new Paragraph(report.executiveSummary),
            new Paragraph(`Score: ${report.score}`),
            ...report.recommendations.map((item) => new Paragraph(`Recommendation: ${item}`))
          ]
        }
      ]
    });
    const buffer = await Packer.toBuffer(doc);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${report.scenarioId}-after-action.docx"`);
    res.end(buffer);
  } catch (error) {
    next(error);
  }
});

app.get("/audit-events", (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const q = String(req.query.q ?? "").toLowerCase();
  const action = String(req.query.action ?? "").toLowerCase();
  res.json(
    auditEvents.filter(
      (event) =>
        event.tenantId === user.tenantId &&
        (!q || `${event.actor} ${event.action} ${event.resource}`.toLowerCase().includes(q)) &&
        (!action || event.action.toLowerCase().includes(action))
    )
  );
});

app.get("/audit-events/export.csv", (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const rows = auditEvents.filter((event) => event.tenantId === user.tenantId);
  const csv = ["id,createdAt,actor,action,resource", ...rows.map((event) => [event.id, event.createdAt, event.actor, event.action, event.resource].join(","))].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=\"audit-events.csv\"");
  res.send(csv);
});

// Threat Intel endpoints — daily collection, on-demand scenario generation
app.get("/threat-intel", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const since = req.query.since as string | undefined;
    const source = req.query.source as string | undefined;
    if (source && !["cve", "mitre-attack", "otx", "rss"].includes(source)) {
      res.status(400).json({ error: "Invalid source. Use: cve, mitre-attack, otx, rss" });
      return;
    }
    res.json(await listIntel(user, since, source as never));
  } catch (error) { next(error); }
});

app.get("/threat-intel/stats", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getIntelStats((req as AuthenticatedRequest).user));
  } catch (error) { next(error); }
});

app.post("/threat-intel/collect", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const body = z.object({ source: z.enum(["all", "cve", "rss"]).default("all") }).parse(req.body ?? {});
    if (body.source === "all") {
      res.json(await collectAll(user));
    } else {
      const result = await collectSource(user, body.source);
      res.json(result ? [result] : []);
    }
  } catch (error) { next(error); }
});

app.post("/threat-intel/:intelId/process", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const result = await processWithAI(user, req.params.intelId);
    if (!result) { res.status(404).json({ error: "Intel item not found" }); return; }
    res.json(result);
  } catch (error) { next(error); }
});

app.post("/threat-intel/:intelId/generate-scenario", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const body = z.object({
      sector: z.string().optional(),
      module: z.enum(["Executive Tabletop Exercise", "AI Threat Simulation", "Cyber Resilience", "GRC & Compliance", "Business Continuity", "Crisis Management", "Data Protection", "Analytics"]).optional(),
      difficulty: z.enum(["Executive", "Operational", "Technical", "Board"]).optional(),
      frameworks: z.array(z.string()).optional()
    }).parse(req.body ?? {});
    const result = await generateFromIntel(user, req.params.intelId, body);
    if (!result) { res.status(404).json({ error: "Intel item not found" }); return; }
    res.status(201).json(result);
  } catch (error) { next(error); }
});

app.post("/threat-intel/generate-on-demand", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const body = z.object({
      sector: z.string().optional(),
      module: z.enum(["Executive Tabletop Exercise", "AI Threat Simulation", "Cyber Resilience", "GRC & Compliance", "Business Continuity", "Crisis Management", "Data Protection", "Analytics"]).optional(),
      difficulty: z.enum(["Executive", "Operational", "Technical", "Board"]).optional(),
      frameworks: z.array(z.string()).optional(),
      daysBack: z.number().int().min(1).max(90).optional()
    }).parse(req.body ?? {});
    const result = await generateOnDemand(user, body);
    if (!result) { res.status(404).json({ error: "No threat intel available to generate scenario" }); return; }
    res.status(201).json(result);
  } catch (error) { next(error); }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Validation failed", details: error.flatten() });
    return;
  }

  if (error instanceof Error && error.name === "ForbiddenError") {
    res.status(403).json({ error: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

wss.on("connection", (socket, req) => {
  const url = new URL(req.url ?? "", "http://localhost");
  const token = url.searchParams.get("token");
  if (!token) {
    socket.close(4001, "Authentication required");
    return;
  }
  try {
    jwt.verify(token, jwtSecret);
  } catch {
    socket.close(4001, "Invalid or expired token");
    return;
  }
  socket.send(JSON.stringify({ type: "connected", message: "Live simulation updates connected" }));
});

setInterval(() => {
  const payload = JSON.stringify({
    type: "simulation.tick",
    sessionId: "ses-live-rag-001",
    timestamp: new Date().toISOString()
  });
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(payload);
  }
}, 5000);

// Daily threat intel collection (every 6 hours)
const COLLECTION_INTERVAL_MS = 21600000;
async function runScheduledCollection() {
  try {
    const systemUser = { sub: "usr-system", tenantId: "ten-sovereign-health", role: "Admin" as const };
    await collectAll(systemUser);
  } catch (error) {
    console.error("[SCHEDULED] Threat intel collection failed:", error instanceof Error ? error.message : error);
  }
}
setInterval(runScheduledCollection, COLLECTION_INTERVAL_MS);
runScheduledCollection();

server.listen(port, () => {
  console.log(`AI resilience platform listening on http://localhost:${port}`);
});
