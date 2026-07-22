import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Clock3,
  Database,
  FileCheck2,
  GitFork,
  GraduationCap,
  Moon,
  Play,
  RadioTower,
  ShieldAlert,
  Siren,
  Sparkles,
  SunMedium,
  UserCog,
  Workflow
} from "lucide-react";
import { platformApi, WS_URL, type NotificationItem, type PlatformUser } from "./api/client";
import { CoverageBars, ResilienceRadar } from "./components/Charts";
import { Shell, type ViewKey } from "./components/Shell";
import {
  auditTrail,
  advancedAuditFilters,
  boardPackSections,
  boardPortalMetrics,
  complianceReadiness,
  demoDataControls,
  decisions,
  enterpriseKpis,
  enterpriseBuildout,
  enterpriseOutcomes,
  enterpriseRunbooks,
  executiveSecurityQueue,
  executiveRoles,
  evidenceVault,
  graphNodes,
  integrations,
  integrationConfig,
  livePortalKpis,
  liveRiskState,
  monitoringSignals,
  modules,
  onboardingChecklist,
  onboardingWizard,
  productionChecklist,
  productionGates,
  scenarioBlueprints,
  scorecards,
  securityPosture,
  settingsCatalog,
  socIncidents,
  subscriptionPlans,
  supportTickets,
  tabletopPhases,
  tenantOperations,
  timeline,
  trainingGrowthMatrix,
  trainingPrograms,
  trainingYearlyTracking
} from "./data/platform";
import { usePlatformData } from "./hooks/usePlatformData";

function Stat({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="panel min-h-28">
      <p className="text-sm text-ink/60 dark:text-white/60">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <strong className="text-3xl font-semibold">{value}</strong>
        <span className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<PlatformUser | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? (JSON.parse(saved) as PlatformUser) : null;
  });
  const [activeView, setActiveView] = useState<ViewKey>(() => (window.location.pathname.toLowerCase().startsWith("/admin") ? "Admin" : "Command"));
  const [actionStatus, setActionStatus] = useState("Ready");
  const [reportSummary, setReportSummary] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [wsStatus, setWsStatus] = useState("Disconnected");
  const { overview, simulation, auditEvents, status, refresh } = usePlatformData();

  const activeScenario = overview?.activeScenario;
  const scenarioId = activeScenario?.id ?? "scn-ai-rag-poisoning";
  const sessionId = simulation?.id ?? "ses-live-rag-001";
  const displayScore = simulation?.calculatedScore ?? activeScenario?.resilienceScore ?? 78;
  const displayMinute = simulation?.currentMinute ?? 41;
  const displayRoles = activeScenario?.roles.length ?? 9;
  const displayRiskState = simulation
    ? [
        { label: "Trust Impact", value: simulation.riskState.trustImpact, color: "bg-ember" },
        { label: "Operational Impact", value: simulation.riskState.operationalImpact, color: "bg-iris" },
        { label: "Regulatory Impact", value: simulation.riskState.regulatoryImpact, color: "bg-ember" },
        { label: "Containment Confidence", value: simulation.riskState.containmentConfidence, color: "bg-signal" }
      ]
    : liveRiskState;
  const displayAuditTrail =
    auditEvents.length > 0
      ? auditEvents.map((event) => ({
          time: new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actor: event.actor,
          action: event.action,
          resource: event.resource
        }))
      : auditTrail;

  useEffect(() => {
    const onAuthExpired = () => { localStorage.removeItem("authToken"); localStorage.removeItem("currentUser"); setUser(null); };
    window.addEventListener("auth:expired", onAuthExpired);
    if (!user) return;
    platformApi.notifications().then(setNotifications).catch(() => setNotifications([]));
    platformApi.users().then(setUsers).catch(() => setUsers([]));
    return () => window.removeEventListener("auth:expired", onAuthExpired);
  }, [user, actionStatus]);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("authToken");
    const wsUrl = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => setWsStatus("Connected");
    ws.onmessage = (event) => setActionStatus(`Live update: ${JSON.parse(event.data).type}`);
    ws.onclose = () => setWsStatus("Disconnected");
    return () => ws.close();
  }, [user]);

  async function login(email: string, role: string) {
    const result = await platformApi.login(email, role);
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("currentUser", JSON.stringify(result.user));
    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
  }

  async function runAction(label: string, action: () => Promise<unknown>) {
    setActionStatus(`${label}...`);
    try {
      await action();
      await refresh();
      setActionStatus(`${label} complete`);
    } catch (error) {
      setActionStatus(error instanceof Error ? error.message : "Action failed");
    }
  }

  const actionBar = (
    <>
      <div className="mt-4 rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-ink/65 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/65">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Data mode: <span className="font-semibold text-signal">{status === "live" ? "connected API" : status}</span>
            <span className="ml-3 text-ink/50 dark:text-white/50">{actionStatus}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            <button className="toolbar-button" onClick={() => runAction("Advancing simulation", () => platformApi.advanceSimulation(sessionId, 15))}>
              <Play size={15} />
              Advance
            </button>
            <button className="toolbar-button" onClick={() => runAction("Generating inject", () => platformApi.generateInject(scenarioId))}>
              <Sparkles size={15} />
              Inject
            </button>
            <button
              className="toolbar-button"
              onClick={() =>
                runAction("Logging decision", () =>
                  platformApi.logDecision(sessionId, simulation?.deliveredInjects.at(-1)?.id ?? null, "Suspend affected workflow and notify regulator.")
                )
              }
            >
              <FileCheck2 size={15} />
              Decision
            </button>
            <button
              className="toolbar-button"
              onClick={() =>
                runAction("Generating report", async () => {
                  const report = await platformApi.afterActionReport(scenarioId);
                  setReportSummary(`${report.title}: score ${report.score}, ${report.recommendations.length} recommendations`);
                })
              }
            >
              <ShieldAlert size={15} />
              Report
            </button>
          </div>
        </div>
      </div>
      {reportSummary ? <div className="mt-3 rounded-lg border border-signal/30 bg-signal/10 px-4 py-3 text-sm">{reportSummary}</div> : null}
    </>
  );

  if (!user) {
    return <LoginLanding onLogin={login} />;
  }

  return (
    <Shell
      activeView={activeView}
      onViewChange={setActiveView}
      notifications={notifications}
      onMarkNotificationRead={(id) => platformApi.markNotificationRead(id).then(() => platformApi.notifications().then(setNotifications))}
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-white/[0.06]">
          <span>
            Signed in as <strong>{user.name}</strong> ({user.role}) - WebSocket: <strong className="text-signal">{wsStatus}</strong>
          </span>
          <button className="toolbar-button" onClick={logout}>Logout</button>
        </div>
        {activeView === "Command" ? (
          <CommandView
            activeScenarioTitle={activeScenario?.title}
            displayScore={displayScore}
            displayMinute={displayMinute}
            displayRoles={displayRoles}
            displayRiskState={displayRiskState}
            displayAuditTrail={displayAuditTrail}
            actionBar={actionBar}
          />
        ) : null}
        {activeView === "Live Ops" ? <LiveOpsView status={status} scenarioCount={overview?.scenarios.length ?? 0} sessionCount={overview?.sessions.length ?? 0} userCount={users.length} /> : null}
        {activeView === "Onboarding" ? <OnboardingView /> : null}
        {activeView === "Board" ? <BoardPortalView scenarioId={scenarioId} /> : null}
        {activeView === "SOC Ops" ? <SocOpsView /> : null}
        {activeView === "Integrations" ? <IntegrationsView /> : null}
        {activeView === "Support" ? <SupportView /> : null}
        {activeView === "Settings" ? <SettingsView /> : null}
        {activeView === "Tabletop" ? <TabletopView scenarioId={scenarioId} sessionId={sessionId} runAction={runAction} /> : null}
        {activeView === "Scenarios" ? <ScenariosView scenarioId={scenarioId} scenarios={overview?.scenarios ?? []} runAction={runAction} refresh={refresh} /> : null}
        {activeView === "Threat AI" ? <ThreatAiView scenarioId={scenarioId} runAction={runAction} actionBar={actionBar} /> : null}
        {activeView === "Training" ? <TrainingView /> : null}
        {activeView === "Standards" ? <StandardsView /> : null}
        {activeView === "Reports" ? <ReportsView scenarioId={scenarioId} runAction={runAction} reportSummary={reportSummary} setReportSummary={setReportSummary} /> : null}
        {activeView === "Admin" ? <AdminView status={status} scenarioCount={overview?.scenarios.length ?? 0} sessionId={sessionId} users={users} /> : null}
      </div>
    </Shell>
  );
}

function LoginLanding({ onLogin }: { onLogin: (email: string, role: string) => Promise<void> }) {
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("admin@demo.local");
  const [error, setError] = useState("");
  const [siteTheme, setSiteTheme] = useState<"dark" | "light">("light");
  const isDarkSite = siteTheme === "dark";
  const roles = ["Admin", "CEO", "CISO", "Board", "AI Governance Officer", "Privacy Officer"];
  const websiteModules = [
    { title: "Executive Tabletop", text: "CEO, board, legal, privacy, communications, and cyber leadership exercises." },
    { title: "AI Threat Simulation", text: "Adaptive injects for RAG poisoning, model abuse, privacy incidents, and cyber disruption." },
    { title: "Cybersecurity Training", text: "Annual cyber training, executive readiness, employee completion, and growth matrix tracking." },
    { title: "Governance Evidence", text: "Mapped controls, audit trail, after-action reports, and standards coverage." },
    { title: "Tenant Operations", text: "Admin console, users, notifications, scenarios, and export-ready operating records." }
  ];
  const buyerOutcomes = ["Board-ready resilience score", "Regulatory evidence packs", "Live crisis facilitation", "Multi-tenant SaaS control"];
  const buyerCards = [
    { title: "For CEOs", text: "Know what to decide, when to disclose, and how to protect public trust during a cyber or AI crisis." },
    { title: "For CISOs", text: "Run realistic simulations, record evidence, and show measurable readiness improvement to leadership." },
    { title: "For Boards", text: "Review oversight evidence, risk acceptance, training maturity, and annual resilience posture." },
    { title: "For GRC Teams", text: "Map exercises to frameworks, export reports, and maintain audit-ready records across tenants." }
  ];
  const workflowSteps = [
    ["01", "Design scenario", "Pick a cyber, AI, privacy, fraud, continuity, or executive exercise blueprint."],
    ["02", "Run live exercise", "Advance time, generate injects, capture decisions, and monitor risk movement."],
    ["03", "Train workforce", "Track employees, CEO, board, managers, and technical teams across annual cycles."],
    ["04", "Export evidence", "Produce PDF, DOCX, CSV, audit logs, standards coverage, and growth reports."]
  ];
  const trustItems = ["NIST CSF", "ISO 27001", "SOC 2", "MITRE ATT&CK", "MITRE ATLAS", "AI RMF", "ISO 42001", "DORA"];
  const implementationItems = [
    "Vercel-ready frontend package",
    "Render and Railway backend guides",
    "PostgreSQL repository adapter",
    "Dockerfile and production config",
    "Admin manual and user guide",
    "Final testing and smoke checklist"
  ];
  const footerColumns = [
    {
      title: "Platform",
      links: [
        ["Command Center", "#platform"],
        ["Executive Tabletop", "#tabletop"],
        ["Cyber Training", "#training"],
        ["AI Threat Simulation", "#platform"]
      ]
    },
    {
      title: "Governance",
      links: [
        ["Standards Matrix", "#standards"],
        ["Audit Exports", "/docs/API.md"],
        ["After-Action Reports", "/docs/USER_GUIDE.md"],
        ["Scope Coverage", "/docs/SCOPE_COVERAGE.md"]
      ]
    },
    {
      title: "Deployment",
      links: [
        ["Deployment Ready", "/docs/DEPLOYMENT_READY.md"],
        ["Vercel Guide", "/docs/VERCEL_DEPLOYMENT.md"],
        ["GitHub Setup", "/docs/GITHUB_SETUP.md"],
        ["Final Test Report", "/docs/FINAL_TEST_REPORT.md"]
      ]
    },
    {
      title: "Manuals",
      links: [
        ["User Manual", "/docs/USER_GUIDE.md"],
        ["Admin Manual", "/docs/ADMIN_MANUAL.md"],
        ["API Docs", "/docs/API.md"],
        ["All Docs Index", "/docs"]
      ]
    }
  ];
  const docsCards = [
    ["User Manual", "Role-based guide for Command, Tabletop, Training, Standards, Reports, and Admin.", "/docs/USER_GUIDE.md"],
    ["Admin Manual", "Admin URL, user control, audit exports, repository mode, and tenant operations.", "/docs/ADMIN_MANUAL.md"],
    ["Deployment Guide", "Production deployment readiness for frontend, backend, environment variables, and hosting.", "/docs/DEPLOYMENT_READY.md"],
    ["Final Test Report", "Latest build, smoke, security audit, and route verification status.", "/docs/FINAL_TEST_REPORT.md"]
  ];
  return (
    <main className={`min-h-screen ${isDarkSite ? "site-dark bg-ink text-white" : "site-light bg-cloud text-ink"}`}>
      <header className="border-b border-white/10 px-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-signal">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">ResilienceOS</p>
              <p className="text-xs text-white/55">Cyber, AI, GRC Simulation SaaS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-6 text-sm text-white/65 lg:flex">
              <a href="#platform" className="hover:text-signal">Platform</a>
              <a href="#buyers" className="hover:text-signal">Buyers</a>
              <a href="#training" className="hover:text-signal">Training</a>
              <a href="#tabletop" className="hover:text-signal">Tabletop</a>
              <a href="#standards" className="hover:text-signal">Standards</a>
              <a href="#login" className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/10">Sign in</a>
            </nav>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] transition hover:border-signal hover:text-signal"
              title="Toggle website theme"
              onClick={() => setSiteTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              {isDarkSite ? <SunMedium size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-4 text-sm text-white/65 lg:hidden">
          {["Platform", "Buyers", "Training", "Tabletop", "Standards", "Manuals", "Login"].map((item) => (
            <a key={item} href={item === "Login" ? "#login" : `#${item.toLowerCase()}`} className="shrink-0 rounded-lg border border-white/10 px-3 py-2">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex min-h-[560px] flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-signal">AI-Native Enterprise Resilience Platform</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
              Cyber, AI governance, and executive tabletop simulation platform
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
              Run CEO and board exercises, adaptive AI threat simulations, standards mapping, reports, notifications, and operational resilience analytics from one live workspace.
            </p>
            <div className="mt-7 grid max-w-3xl gap-3 sm:grid-cols-2">
              {buyerOutcomes.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
                  <FileCheck2 size={16} className="text-signal" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#login" className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-sm font-semibold text-white">
                Enter live MVP
                <ArrowRight size={16} />
              </a>
              <a href="#platform" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                View modules
              </a>
            </div>
          </div>

          <div className="grid content-center gap-4">
            <section id="login" className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Sign in to platform</h2>
                  <p className="mt-1 text-sm text-white/60">Choose a role to open the connected SaaS workspace.</p>
                </div>
                <div className="rounded-lg bg-blue-500/15 px-3 py-2 text-xs font-semibold text-blue-200">Live API</div>
              </div>
              <label className="mt-5 block text-sm">Role</label>
              <select className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-3 py-3 text-white" value={role} onChange={(event) => setRole(event.target.value)}>
                {roles.map((item) => <option key={item}>{item}</option>)}
              </select>
              <label className="mt-4 block text-sm">Email</label>
              <input className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-3 py-3 text-white" value={email} onChange={(event) => setEmail(event.target.value)} />
              {error ? <p className="mt-3 text-sm text-ember">{error}</p> : null}
              <button
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-signal px-4 py-3 text-sm font-semibold text-white"
                onClick={() => onLogin(email, role).catch((err) => setError(err instanceof Error ? err.message : "Login failed"))}
              >
                Enter Platform
                <ArrowRight size={16} />
              </button>
            </section>

            <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Live Enterprise Signal</p>
                  <p className="mt-1 text-xs text-white/55">Connected product workflow across simulation, training, reports, and governance.</p>
                </div>
                <RadioTower size={20} className="text-signal" />
              </div>
              <div className="mt-5 grid gap-3">
                {["Model output drift detected", "Board notification window opened", "Evidence package generated"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg bg-ink/70 p-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-white/10 text-sm font-semibold">{index + 1}</div>
                    <div>
                      <p className="text-sm font-semibold">{item}</p>
                      <p className="text-xs text-white/50">Simulation minute {15 + index * 20}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  ["89%", "Training"],
                  ["92", "Score"],
                  ["4%", "Phishing risk"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-lg font-semibold">{value}</p>
                    <p className="mt-1 text-white/45">{label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section id="platform" className="mx-auto max-w-7xl border-t border-white/10 py-10">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">Enterprise Operating System</p>
              <h2 className="mt-3 text-3xl font-semibold">One connected workspace for crisis readiness</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/60">
              The homepage connects directly into the same authenticated app used for scenarios, notifications, reports, and tenant administration.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {websiteModules.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-5 grid size-10 place-items-center rounded-lg bg-white/10">
                  <Workflow size={18} className="text-signal" />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="buyers" className="mx-auto max-w-7xl border-t border-white/10 py-10">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">Built For Enterprise Buyers</p>
              <h2 className="mt-3 text-3xl font-semibold">A single product story for leadership, security, GRC, and the workforce</h2>
              <p className="mt-4 text-sm leading-6 text-white/60">
                The site now explains the full platform before login, then sends users directly into the live role-based command center.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {buyerCards.map((item) => (
                <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <BrainCircuit className="mb-4 text-signal" size={19} />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl border-t border-white/10 py-10">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">How It Works</p>
              <h2 className="mt-3 text-3xl font-semibold">From scenario design to board-ready evidence</h2>
            </div>
            <a href="#login" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/10">
              Open live workspace
              <ArrowRight size={16} />
            </a>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map(([step, title, text]) => (
              <article key={title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-semibold text-signal">{step}</p>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="training" className="mx-auto grid max-w-7xl gap-4 border-t border-white/10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">Cybersecurity Training</p>
            <h2 className="mt-3 text-3xl font-semibold">Annual training, executive readiness, and employee growth tracking</h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Track security awareness for all employees, CEO crisis leadership, board oversight, manager continuity, and technical response labs in one module.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["1,701", "Learners enrolled"],
                ["89%", "Current completion"],
                ["31%", "Reporting growth"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <strong className="text-3xl font-semibold">{value}</strong>
                  <p className="mt-2 text-sm text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-2">
              <GraduationCap size={19} className="text-signal" />
              <h3 className="font-semibold">Training Growth Matrix</h3>
            </div>
            <div className="mt-4 space-y-3">
              {["Awareness: Managed to Optimized", "Executive Readiness: Practiced to Board assured", "Secure Engineering: Defined to Embedded", "Recovery Behavior: Repeatable to Resilient"].map((item, index) => (
                <div key={item} className="rounded-lg bg-ink/60 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{item}</p>
                    <span className="text-xs text-signal">+{18 + index * 3}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-signal" style={{ width: `${62 + index * 8}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tabletop" className="mx-auto grid max-w-7xl gap-4 border-t border-white/10 py-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">$25k Launch-Tier Ready</p>
            <h2 className="mt-3 text-3xl font-semibold">Built for executive buyers and implementation teams</h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              The package includes the live SaaS MVP, source code, deployment guides, API docs, admin manual, testing checklist, and deployment-ready configuration.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["92", "Resilience score"],
              ["8", "Frameworks mapped"],
              ["24/7", "Live signal center"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <strong className="text-3xl font-semibold">{value}</strong>
                <p className="mt-2 text-sm text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="standards" className="mx-auto max-w-7xl border-t border-white/10 py-10">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">Trust And Standards</p>
              <h2 className="mt-3 text-3xl font-semibold">Mapped for security, privacy, AI governance, and resilience evidence</h2>
              <p className="mt-4 text-sm leading-6 text-white/60">
                Standards coverage is presented in the website and available inside the app through the graph, matrix, reports, and audit exports.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trustItems.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl border-t border-white/10 py-10">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <Database className="mb-4 text-signal" size={20} />
              <h2 className="text-2xl font-semibold">Deployment-ready implementation</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                The project includes local preview, production server mode, PostgreSQL adapter, Docker, deployment configs, and manuals for GitHub and Vercel workflows.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {implementationItems.map((item) => (
                  <div key={item} className="rounded-lg bg-ink/60 px-3 py-2 text-sm text-white/70">{item}</div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-signal/30 bg-signal/10 p-6">
              <Sparkles className="mb-4 text-signal" size={20} />
              <h2 className="text-2xl font-semibold">Enterprise launch package</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Use the live MVP for customer demos, investor walkthroughs, internal pilots, cyber training programs, and board tabletop facilitation.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="#login" className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-sm font-semibold text-white">
                  Sign in now
                  <ArrowRight size={16} />
                </a>
                <a href="#platform" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  Review platform
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="manuals" className="mx-auto max-w-7xl border-t border-white/10 py-10">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">Manuals And Documentation</p>
              <h2 className="mt-3 text-3xl font-semibold">Full working docs linked from the website footer</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
                Visitors can open the user manual, admin manual, deployment guide, API docs, scope coverage, and final test report directly from the live app.
              </p>
            </div>
            <a href="/docs" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/10">
              Open docs index
              <ArrowRight size={16} />
            </a>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {docsCards.map(([title, text, href]) => (
              <a key={title} href={href} className="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:border-signal">
                <FileCheck2 className="mb-4 text-signal" size={19} />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
              </a>
            ))}
          </div>
        </section>
      </section>

      <footer className="border-t border-white/10 px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg bg-signal text-white">
                <ShieldAlert size={21} />
              </div>
              <div>
                <p className="font-semibold">ResilienceOS</p>
                <p className="text-sm text-white/55">AI-native cyber resilience and governance simulation platform.</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
              Built for executive crisis readiness, cybersecurity training, standards evidence, and deployable enterprise SaaS operations.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#login" className="inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-3 text-sm font-semibold text-white">
                Enter platform
                <ArrowRight size={16} />
              </a>
              <a href="#standards" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                View standards
              </a>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold">{column.title}</p>
                <div className="mt-3 grid gap-2 text-sm text-white/55">
                  {column.links.map(([label, href]) => (
                    <a key={label} href={href} className="hover:text-signal">{label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 ResilienceOS. Enterprise cyber resilience MVP package.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#login" className="hover:text-signal">Admin login</a>
            <a href="#training" className="hover:text-signal">Training module</a>
            <a href="#manuals" className="hover:text-signal">User manuals</a>
            <a href="#standards" className="hover:text-signal">Compliance coverage</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function TabletopView({
  scenarioId,
  sessionId,
  runAction
}: {
  scenarioId: string;
  sessionId: string;
  runAction: (label: string, action: () => Promise<unknown>) => Promise<void>;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="panel">
        <div className="section-title">
          <UserCog size={19} />
          <h2>Executive Tabletop Exercise</h2>
        </div>
        <p className="mt-4 text-sm leading-6 text-ink/70 dark:text-white/70">
          Company leadership exercise for CEO, board chair, CISO, CIO, legal, communications, privacy, and AI governance teams. This module drives decision-making under cyber, AI, regulatory, media, and operational pressure.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="toolbar-button" onClick={() => runAction("Advancing tabletop", () => platformApi.advanceSimulation(sessionId, 15))}>
            <Play size={15} />
            Advance Phase
          </button>
          <button className="toolbar-button" onClick={() => runAction("Generating CEO inject", () => platformApi.generateInject(scenarioId))}>
            <Sparkles size={15} />
            CEO Inject
          </button>
          <button
            className="toolbar-button"
            onClick={() =>
              runAction("Logging CEO decision", () =>
                platformApi.logDecision(sessionId, null, "CEO approves regulator notification, customer safety posture, and public trust response.")
              )
            }
          >
            <FileCheck2 size={15} />
            CEO Decision
          </button>
        </div>
        <div className="mt-5 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-cloud text-xs uppercase text-ink/55 dark:bg-white/10 dark:text-white/55">
              <tr>
                <th className="px-3 py-3">Minute</th>
                <th className="px-3 py-3">Phase</th>
                <th className="px-3 py-3">Owner</th>
                <th className="px-3 py-3">Decision</th>
              </tr>
            </thead>
            <tbody>
              {tabletopPhases.map((phase) => (
                <tr key={phase.phase} className="border-t border-black/10 dark:border-white/10">
                  <td className="px-3 py-3 font-semibold">{phase.minute}</td>
                  <td className="px-3 py-3">{phase.phase}</td>
                  <td className="px-3 py-3">{phase.owner}</td>
                  <td className="px-3 py-3 text-ink/65 dark:text-white/65">{phase.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="panel">
          <div className="section-title">
            <UserCog size={19} />
            <h2>Executive Roles</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {executiveRoles.map((role) => (
              <div key={role.role} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <p className="text-sm font-semibold">{role.role}</p>
                <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{role.focus}</p>
              </div>
            ))}
          </div>
        </div>
        <DecisionQueue />
      </div>
    </section>
  );
}

function LiveOpsView({ status, scenarioCount, sessionCount, userCount }: { status: string; scenarioCount: number; sessionCount: number; userCount: number }) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel">
          <div className="section-title">
            <Database size={19} />
            <h2>Enterprise Live Portal</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/70 dark:text-white/70">
            Production operations cockpit for tenant readiness, platform hardening, launch gates, security controls, runbooks, and deployment status. This separates real enterprise readiness from demo-only functionality.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {livePortalKpis.map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-black/10 bg-cloud p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs text-ink/55 dark:text-white/55">{kpi.label}</p>
                <p className="mt-3 text-2xl font-semibold">{kpi.value}</p>
                <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{kpi.detail}</p>
                <p className={kpi.status === "Open" || kpi.status === "Action required" ? "mt-2 text-xs font-semibold text-ember" : "mt-2 text-xs font-semibold text-signal"}>{kpi.status}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <Stat label="API mode" value={status === "live" ? "Live" : status} accent="bg-signal" />
            <Stat label="Users" value={userCount} accent="bg-iris" />
            <Stat label="Scenarios" value={scenarioCount} accent="bg-ember" />
            <Stat label="Sessions" value={sessionCount} accent="bg-signal" />
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <ShieldAlert size={19} />
            <h2>Production Gate Status</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {productionGates.map((gate) => (
              <div key={gate.gate} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{gate.gate}</p>
                  <span className={gate.state === "Required" ? "rounded-md bg-ember/10 px-2 py-1 text-xs font-semibold text-ember" : "rounded-md bg-signal/10 px-2 py-1 text-xs font-semibold text-signal"}>{gate.state}</span>
                </div>
                <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{gate.owner}</p>
                <p className="mt-2 text-xs leading-5 text-ink/65 dark:text-white/65">{gate.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="panel">
          <div className="section-title">
            <Activity size={19} />
            <h2>Tenant Operations Readiness</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {tenantOperations.map((item) => (
              <div key={item.area} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{item.area}</p>
                  <span className="text-xs font-semibold text-signal">{item.readiness}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div className="h-full rounded-full bg-signal" style={{ width: `${item.readiness}%` }} />
                </div>
                <p className="mt-2 text-xs text-ink/55 dark:text-white/55">{item.capability}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <FileCheck2 size={19} />
            <h2>Enterprise Runbooks</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {enterpriseRunbooks.map((item) => (
              <div key={item.runbook} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <p className="text-sm font-semibold">{item.runbook}</p>
                <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/60">{item.steps}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="toolbar-button" href="/ready" target="_blank">Readiness API</a>
            <a className="toolbar-button" href="/production/status" target="_blank">Production Gates</a>
            <a className="toolbar-button" href="/security/status" target="_blank">Security API</a>
            <a className="toolbar-button" href="/docs/DEPLOYMENT_READY.md" target="_blank">Deployment Guide</a>
            <a className="toolbar-button" href="/docs/FINAL_TEST_REPORT.md" target="_blank">Test Report</a>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel">
          <div className="section-title">
            <Workflow size={19} />
            <h2>8-Part Enterprise Buildout</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {enterpriseBuildout.map((item) => (
              <div key={item.area} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{item.area}</p>
                  <span className={item.state.includes("Requires") || item.state.includes("Demo") ? "rounded-md bg-ember/10 px-2 py-1 text-xs font-semibold text-ember" : "rounded-md bg-signal/10 px-2 py-1 text-xs font-semibold text-signal"}>{item.state}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/60">{item.capability}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <UserCog size={19} />
            <h2>Customer Onboarding</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {onboardingChecklist.map((item) => (
              <div key={item.step} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{item.step}</p>
                  <span className={item.status.includes("Requires") ? "text-xs font-semibold text-ember" : "text-xs font-semibold text-signal"}>{item.status}</span>
                </div>
                <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{item.owner}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel">
          <div className="section-title">
            <RadioTower size={19} />
            <h2>Monitoring Signals</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {monitoringSignals.map((item) => (
              <div key={item.signal} className="flex items-center justify-between gap-3 rounded-lg border border-black/10 p-3 dark:border-white/10">
                <div>
                  <p className="text-sm font-semibold">{item.signal}</p>
                  <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{item.detail}</p>
                </div>
                <span className={item.value === "Warn" ? "text-sm font-semibold text-ember" : "text-sm font-semibold text-signal"}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="toolbar-button" href="/monitoring/status" target="_blank">Monitoring API</a>
            <a className="toolbar-button" href="/monitoring/metrics" target="_blank">Metrics API</a>
            <a className="toolbar-button" href="/enterprise/status" target="_blank">Enterprise API</a>
            <a className="toolbar-button" href="/integrations/status" target="_blank">Integrations API</a>
            <a className="toolbar-button" href="/deployment/assistant" target="_blank">Deploy Assistant</a>
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <FileCheck2 size={19} />
            <h2>Plans And Commercial Readiness</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {subscriptionPlans.map((item) => (
              <div key={item.plan} className="rounded-lg border border-black/10 p-4 dark:border-white/10">
                <p className="text-sm font-semibold">{item.plan}</p>
                <p className="mt-3 text-2xl font-semibold">{item.price}</p>
                <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/60">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="toolbar-button" href="/billing/plans" target="_blank">Billing API</a>
            <a className="toolbar-button" href="/docs/ADMIN_MANUAL.md" target="_blank">Admin Manual</a>
            <a className="toolbar-button" href="/docs/USER_GUIDE.md" target="_blank">User Manual</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SettingsView() {
  return (
    <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="panel">
        <div className="section-title"><UserCog size={19} /><h2>Organization Settings</h2></div>
        <div className="mt-4 grid gap-3">
          {settingsCatalog.map((item) => (
            <div key={`${item.group}-${item.setting}`} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{item.setting}</p>
                <span className="rounded-md bg-signal/10 px-2 py-1 text-xs font-semibold text-signal">{item.group}</span>
              </div>
              <p className="mt-2 text-sm text-ink/70 dark:text-white/70">{item.value}</p>
              <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        <div className="panel">
          <div className="section-title"><ShieldAlert size={19} /><h2>Production Checklist</h2></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {productionChecklist.map((item) => (
              <div key={item.check} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{item.check}</p>
                  <span className={item.status === "Required" ? "text-xs font-semibold text-ember" : "text-xs font-semibold text-signal"}>{item.status}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/60">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="toolbar-button" href="/sso/config" target="_blank">SSO Config</a>
            <a className="toolbar-button" href="/deployment/assistant" target="_blank">Deployment Assistant</a>
          </div>
        </div>
        <div className="panel">
          <div className="section-title"><Database size={19} /><h2>Demo Data Controls</h2></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {demoDataControls.map((item) => (
              <button key={item.action} className="decision-row" onClick={() => undefined}>
                <span><strong>{item.action}</strong><span className="mt-1 block text-xs font-normal text-ink/55 dark:text-white/55">{item.detail}</span></span>
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OnboardingView() {
  return (
    <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="panel">
        <div className="section-title"><Workflow size={19} /><h2>Customer Onboarding Wizard</h2></div>
        <p className="mt-4 text-sm leading-6 text-ink/70 dark:text-white/70">Step-by-step enterprise onboarding from tenant setup to production readiness and first tabletop exercise.</p>
        <div className="mt-5 grid gap-3">
          {onboardingWizard.map((item) => (
            <div key={item.step} className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{item.step}. {item.title}</p>
                <span className={item.status.includes("Requires") ? "rounded-md bg-ember/10 px-2 py-1 text-xs font-semibold text-ember" : "rounded-md bg-signal/10 px-2 py-1 text-xs font-semibold text-signal"}>{item.status}</span>
              </div>
              <p className="mt-2 text-xs text-ink/55 dark:text-white/55">{item.owner}</p>
              <p className="mt-2 text-sm leading-6 text-ink/65 dark:text-white/65">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        <div className="panel">
          <div className="section-title"><GraduationCap size={19} /><h2>Training Launch Plan</h2></div>
          <div className="mt-4 grid gap-3">{trainingPrograms.slice(0, 4).map((program) => <div key={program.audience} className="rounded-lg bg-cloud p-3 dark:bg-white/5"><p className="text-sm font-semibold">{program.audience}</p><p className="mt-1 text-xs text-ink/55 dark:text-white/55">{program.track} - {program.completion}% complete</p></div>)}</div>
        </div>
        <div className="panel">
          <div className="section-title"><FileCheck2 size={19} /><h2>Launch Evidence</h2></div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="toolbar-button" href="/docs/USER_GUIDE.md" target="_blank">User Manual</a>
            <a className="toolbar-button" href="/docs/ADMIN_MANUAL.md" target="_blank">Admin Manual</a>
            <a className="toolbar-button" href="/production/status" target="_blank">Production Status</a>
            <a className="toolbar-button" href="/tenants/provision" target="_blank">Tenant API</a>
            <a className="toolbar-button" href="/sso/config" target="_blank">SSO Setup</a>
            <a className="toolbar-button" href="/invites" target="_blank">Invite API</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function BoardPortalView({ scenarioId }: { scenarioId: string }) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-4">{boardPortalMetrics.map((item) => <Stat key={item.label} label={item.label} value={item.value} accent="bg-signal" />)}</div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="panel">
          <div className="section-title"><ShieldAlert size={19} /><h2>Executive Board Portal</h2></div>
          <p className="mt-4 text-sm leading-6 text-ink/70 dark:text-white/70">Board-ready view of risk score, CEO decisions, training maturity, audit evidence, scenario outcomes, and production blockers.</p>
          <div className="mt-4 grid gap-2">{enterpriseOutcomes.map((item) => <div key={item} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">{item}</div>)}</div>
        </div>
        <div className="panel">
          <div className="section-title"><FileCheck2 size={19} /><h2>Board Pack Export</h2></div>
          <div className="mt-4 grid gap-2">{boardPackSections.map((item) => <div key={item} className="rounded-lg bg-cloud p-3 text-sm dark:bg-white/5">{item}</div>)}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="toolbar-button" href={platformApi.reportPdfUrl(scenarioId)} target="_blank">Export Board PDF</a>
            <a className="toolbar-button" href={platformApi.reportDocxUrl(scenarioId)} target="_blank">Export Board DOCX</a>
            <a className="toolbar-button" href="/reports/templates/board-pack" target="_blank">Template API</a>
            <a className="toolbar-button" href="/board/pack" target="_blank">Board Pack API</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocOpsView() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="panel">
        <div className="section-title"><RadioTower size={19} /><h2>SOC / Security Operations</h2></div>
        <div className="mt-4 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-cloud text-xs uppercase text-ink/55 dark:bg-white/10 dark:text-white/55"><tr><th className="px-3 py-3">Incident</th><th className="px-3 py-3">Severity</th><th className="px-3 py-3">SLA</th><th className="px-3 py-3">Status</th></tr></thead>
            <tbody>{socIncidents.map((item) => <tr key={item.id} className="border-t border-black/10 dark:border-white/10"><td className="px-3 py-3"><p className="font-semibold">{item.id}</p><p className="text-xs text-ink/55 dark:text-white/55">{item.title}</p></td><td className="px-3 py-3">{item.severity}</td><td className="px-3 py-3">{item.sla}</td><td className="px-3 py-3">{item.status}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <div className="grid gap-4">
        <TimelinePanel />
        <EvidenceVault />
        <div className="panel">
          <div className="section-title"><FileCheck2 size={19} /><h2>Evidence Detail APIs</h2></div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="toolbar-button" href="/evidence/vector-store-export" target="_blank">Vector Evidence</a>
            <a className="toolbar-button" href="/evidence/regulator-notification" target="_blank">Regulator Evidence</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntegrationsView() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
      <div className="panel">
        <div className="section-title"><GitFork size={19} /><h2>Integration Config UI</h2></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {integrationConfig.map((item) => (
            <div key={item.name} className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{item.name}</p>
                <span className={item.status.includes("Requires") ? "text-xs font-semibold text-ember" : "text-xs font-semibold text-signal"}>{item.status}</span>
              </div>
              <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{item.type}</p>
              <p className="mt-3 text-xs leading-5 text-ink/65 dark:text-white/65">{item.fields}</p>
              <button className="toolbar-button mt-3">Test connection</button>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="section-title"><Database size={19} /><h2>Integration APIs</h2></div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a className="toolbar-button" href="/integrations/status" target="_blank">Status API</a>
          <a className="toolbar-button" href="/docs/API.md" target="_blank">API Docs</a>
          <a className="toolbar-button" href="/enterprise/status" target="_blank">Enterprise Status</a>
          <a className="toolbar-button" href="/sso/config" target="_blank">SSO Config</a>
        </div>
      </div>
    </section>
  );
}

function SupportView() {
  return (
    <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="panel">
        <div className="section-title"><UserCog size={19} /><h2>Support / Customer Success</h2></div>
        <div className="mt-4 grid gap-3">{supportTickets.map((item) => <div key={item.id} className="rounded-lg border border-black/10 p-3 dark:border-white/10"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">{item.id}</p><span className="text-xs text-signal">{item.status}</span></div><p className="mt-2 text-sm">{item.subject}</p><p className="mt-1 text-xs text-ink/55 dark:text-white/55">{item.owner} - {item.priority}</p></div>)}</div>
      </div>
      <div className="panel">
        <div className="section-title"><FileCheck2 size={19} /><h2>Advanced Audit Center</h2></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">{advancedAuditFilters.map((item) => <div key={item} className="rounded-lg bg-cloud p-3 text-sm font-semibold dark:bg-white/5">{item}</div>)}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a className="toolbar-button" href={platformApi.auditCsvUrl()} target="_blank">Export Audit CSV</a>
          <a className="toolbar-button" href="/support/tickets" target="_blank">Tickets API</a>
          <a className="toolbar-button" href="/docs/ADMIN_MANUAL.md" target="_blank">Admin Manual</a>
        </div>
      </div>
    </section>
  );
}

function CommandView(props: {
  activeScenarioTitle?: string;
  displayScore: number;
  displayMinute: number;
  displayRoles: number;
  displayRiskState: Array<{ label: string; value: number; color: string }>;
  displayAuditTrail: Array<{ time: string; actor: string; action: string; resource: string }>;
  actionBar: JSX.Element;
}) {
  return (
    <>
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-lg border border-black/10 bg-ink text-white shadow-xl dark:border-white/10">
          <div className="grid min-h-[360px] gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-white/80">
                  <RadioTower size={16} />
                  Live adaptive exercise
                </div>
                <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                  {props.activeScenarioTitle ?? "RAG Poisoning Triggers Clinical AI Governance Crisis"}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
                  Autonomous prompt-injection agents, poisoned retrieval content, regulator escalation, and public-trust pressure are converging across executive and technical teams.
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div><p className="text-xs uppercase tracking-[0.18em] text-white/45">Score</p><p className="text-2xl font-semibold text-limecore">{props.displayScore}</p></div>
                <div><p className="text-xs uppercase tracking-[0.18em] text-white/45">Elapsed</p><p className="text-2xl font-semibold">00:{String(props.displayMinute).padStart(2, "0")}</p></div>
                <div><p className="text-xs uppercase tracking-[0.18em] text-white/45">Roles</p><p className="text-2xl font-semibold">{props.displayRoles}</p></div>
              </div>
            </div>
            <div className="relative min-h-64 rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <div className="absolute inset-4 rounded-full border border-signal/35" />
              <div className="absolute inset-12 rounded-full border border-ember/35" />
              <div className="absolute left-[44%] top-[38%] h-14 w-14 rounded-lg bg-signal shadow-[0_0_60px_rgba(37,99,235,0.55)]" />
              <div className="absolute right-[18%] top-[18%] h-6 w-6 rounded-full bg-ember" />
              <div className="absolute bottom-[22%] left-[16%] h-5 w-5 rounded-full bg-iris" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/60">
                <span>Cloud EHR</span><span>Vector DB</span><span>Regulator</span>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Stat label="AI governance maturity" value="74%" accent="bg-signal" />
          <Stat label="Critical injects active" value="03" accent="bg-ember" />
          <Stat label="Mapped controls" value="186" accent="bg-iris" />
        </div>
      </section>
      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {enterpriseKpis.map((kpi) => (
          <div key={kpi.label} className="panel">
            <p className="text-xs text-ink/55 dark:text-white/55">{kpi.label}</p>
            <p className="mt-2 text-2xl font-semibold">{kpi.value}</p>
            <p className="mt-1 text-xs text-signal">{kpi.detail}</p>
          </div>
        ))}
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SecurityPosturePanel />
        <ExecutiveSecurityQueue />
      </section>
      {props.actionBar}
      <section className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <TimelinePanel />
        <div className="panel"><div className="section-title"><Activity size={19} /><h2>Resilience Analytics</h2></div><ResilienceRadar /></div>
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <div className="panel"><div className="section-title"><ShieldAlert size={19} /><h2>Standards Mapping Coverage</h2></div><CoverageBars /></div>
        <DecisionQueue />
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <RiskPanel risks={props.displayRiskState} />
        <AuditPanel events={props.displayAuditTrail} />
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <EvidenceVault />
        <EnterpriseOutcomes />
      </section>
    </>
  );
}

function EvidenceVault() {
  return (
    <div className="panel">
      <div className="section-title"><Database size={19} /><h2>Evidence Vault</h2></div>
      <div className="mt-4 space-y-3">
        {evidenceVault.map((item) => (
          <div key={item.artifact} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.artifact}</p>
                <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{item.owner}</p>
              </div>
              <span className="rounded-md bg-signal/10 px-2 py-1 text-xs font-semibold text-signal">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityPosturePanel() {
  const average = Math.round(securityPosture.reduce((sum, item) => sum + item.maturity, 0) / securityPosture.length);
  return (
    <div className="panel">
      <div className="section-title">
        <ShieldAlert size={19} />
        <h2>Enterprise Security Posture</h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-lg border border-black/10 bg-cloud p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs text-ink/55 dark:text-white/55">Production readiness</p>
          <p className="mt-3 text-4xl font-semibold">{average}%</p>
          <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/60">Security headers, API controls, audit evidence, deployment boundary, and data posture.</p>
        </div>
        <div className="grid gap-2">
          {securityPosture.slice(0, 4).map((item) => (
            <div key={item.control} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{item.control}</p>
                <span className="rounded-md bg-signal/10 px-2 py-1 text-xs font-semibold text-signal">{item.status}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div className="h-full rounded-full bg-signal" style={{ width: `${item.maturity}%` }} />
              </div>
              <p className="mt-2 text-xs text-ink/55 dark:text-white/55">{item.evidence}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExecutiveSecurityQueue() {
  return (
    <div className="panel">
      <div className="section-title">
        <FileCheck2 size={19} />
        <h2>Launch Hardening Queue</h2>
      </div>
      <div className="mt-4 grid gap-2">
        {executiveSecurityQueue.map((item) => (
          <div key={item.item} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <span className={item.priority === "P1" ? "rounded-md bg-ember/10 px-2 py-1 text-xs font-semibold text-ember" : "rounded-md bg-signal/10 px-2 py-1 text-xs font-semibold text-signal"}>{item.priority}</span>
              <span className="text-xs text-ink/55 dark:text-white/55">{item.due}</span>
            </div>
            <p className="mt-2 text-sm font-semibold">{item.item}</p>
            <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{item.owner}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnterpriseOutcomes() {
  return (
    <div className="panel">
      <div className="section-title"><ShieldAlert size={19} /><h2>Enterprise Outcomes</h2></div>
      <div className="mt-4 grid gap-3">
        {enterpriseOutcomes.map((outcome) => (
          <div key={outcome} className="flex gap-3 rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
            <span className="mt-1 h-2 w-2 rounded-full bg-signal" />
            <span>{outcome}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelinePanel() {
  return (
    <div className="panel">
      <div className="section-title"><BrainCircuit size={19} /><h2>Simulation Timeline</h2></div>
      <div className="mt-5 space-y-4">
        {timeline.map((item) => (
          <div key={`${item.minute}-${item.label}`} className="grid grid-cols-[52px_1fr_auto] items-center gap-3">
            <span className="rounded-md bg-ink px-2 py-1 text-center text-sm font-semibold text-white dark:bg-white dark:text-ink">{item.minute}</span>
            <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-ink/55 dark:text-white/55">{item.lane}</p></div>
            <span className="rounded-md border border-black/10 px-2 py-1 text-xs dark:border-white/10">{item.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DecisionQueue() {
  return (
    <div className="panel">
      <div className="section-title"><Siren size={19} /><h2>Executive Decision Queue</h2></div>
      <div className="mt-4 space-y-3">
        {decisions.map((decision) => <button key={decision} className="decision-row"><span>{decision}</span><ArrowRight size={16} /></button>)}
      </div>
    </div>
  );
}

function RiskPanel({ risks }: { risks: Array<{ label: string; value: number; color: string }> }) {
  return (
    <div className="panel">
      <div className="section-title"><FileCheck2 size={19} /><h2>Live Risk State</h2></div>
      <div className="mt-5 space-y-4">
        {risks.map((risk) => (
          <div key={risk.label}>
            <div className="mb-2 flex justify-between text-sm"><span>{risk.label}</span><span className="font-semibold">{risk.value}%</span></div>
            <div className="h-2 rounded-full bg-black/10 dark:bg-white/10"><div className={`h-2 rounded-full ${risk.color}`} style={{ width: `${risk.value}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditPanel({ events }: { events: Array<{ time: string; actor: string; action: string; resource: string }> }) {
  return (
    <div className="panel">
      <div className="section-title"><ShieldAlert size={19} /><h2>Audit Evidence Trail</h2></div>
      <div className="mt-4 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-cloud text-xs uppercase text-ink/55 dark:bg-white/10 dark:text-white/55"><tr><th className="px-3 py-3">Time</th><th className="px-3 py-3">Actor</th><th className="px-3 py-3">Action</th><th className="px-3 py-3">Resource</th></tr></thead>
          <tbody>{events.map((event) => <tr key={`${event.time}-${event.action}-${event.resource}`} className="border-t border-black/10 dark:border-white/10"><td className="px-3 py-3 font-semibold">{event.time}</td><td className="px-3 py-3">{event.actor}</td><td className="px-3 py-3">{event.action}</td><td className="px-3 py-3 text-ink/60 dark:text-white/60">{event.resource}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function ScenariosView({
  scenarioId,
  scenarios,
  runAction,
  refresh
}: {
  scenarioId: string;
  scenarios: Array<{ id: string; title: string; module: string; status: string; resilienceScore: number; durationMinutes?: number }>;
  runAction: (label: string, action: () => Promise<unknown>) => Promise<void>;
  refresh: () => void;
}) {
  const [title, setTitle] = useState("New Executive Tabletop Exercise");
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="panel">
        <div className="section-title"><Workflow size={19} /><h2>Scenario Builder</h2></div>
        <div className="mt-4 rounded-lg border border-black/10 p-3 dark:border-white/10">
          <input className="w-full rounded-lg border border-black/10 bg-cloud px-3 py-2 text-sm dark:border-white/10 dark:bg-white/10" value={title} onChange={(event) => setTitle(event.target.value)} />
          <button className="toolbar-button mt-3" onClick={() => runAction("Creating scenario", () => platformApi.createScenario({ title, module: "Executive Tabletop Exercise", difficulty: "Executive", durationMinutes: 120, standards: ["NIST CSF 2.0", "NIST AI RMF"], roles: ["CEO", "CISO", "Board"] }).then(refresh))}>Create Scenario</button>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-cloud text-xs uppercase text-ink/55 dark:bg-white/10 dark:text-white/55"><tr><th className="px-3 py-3">Scenario</th><th className="px-3 py-3">Module</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actions</th></tr></thead>
            <tbody>{scenarios.map((scenario) => <tr key={scenario.id} className="border-t border-black/10 dark:border-white/10"><td className="px-3 py-3 font-semibold">{scenario.title}</td><td className="px-3 py-3">{scenario.module}</td><td className="px-3 py-3">{scenario.status}</td><td className="px-3 py-3"><button className="text-signal" onClick={() => runAction("Editing scenario", () => platformApi.updateScenario(scenario.id, { status: "Scheduled" }).then(refresh))}>Edit</button><button className="ml-3 text-ember" onClick={() => runAction("Deleting scenario", () => platformApi.deleteScenario(scenario.id).then(refresh))}>Delete</button></td></tr>)}</tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3">
          {scenarioBlueprints.map((scenario) => (
            <div key={scenario.title} className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-sm font-semibold">{scenario.title}</p><p className="mt-1 text-xs text-ink/55 dark:text-white/55">{scenario.module}</p></div>
                <button className="toolbar-button" onClick={() => runAction("Generating scenario inject", () => platformApi.generateInject(scenarioId))}><Sparkles size={15} />Generate</button>
              </div>
              <p className="mt-3 text-sm text-ink/70 dark:text-white/70">{scenario.objective}</p>
              <div className="mt-3 flex flex-wrap gap-2">{scenario.standards.map((standard) => <span key={standard} className="rounded-md bg-cloud px-2 py-1 text-xs dark:bg-white/10">{standard}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-black/10 p-4 dark:border-white/10">
          <div className="section-title"><GitFork size={19} /><h2>Scenario Marketplace</h2></div>
          <p className="mt-3 text-sm text-ink/65 dark:text-white/65">Healthcare, Finance, SaaS, AI governance, and ransomware packs are available through the marketplace API.</p>
          <a className="toolbar-button mt-3" href="/marketplace/scenarios" target="_blank">Open Marketplace API</a>
        </div>
      </div>
      <div className="grid gap-4">
        <TimelinePanel />
        <DecisionQueue />
      </div>
    </section>
  );
}

function ThreatAiView({ scenarioId, runAction, actionBar }: { scenarioId: string; runAction: (label: string, action: () => Promise<unknown>) => Promise<void>; actionBar: JSX.Element }) {
  return (
    <>
      {actionBar}
      <section className="mt-4 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="panel">
          <div className="section-title"><Sparkles size={19} /><h2>AI Orchestration</h2></div>
          <div className="mt-4 space-y-3 text-sm text-ink/70 dark:text-white/70">
            <p>Facilitator agent watches role latency, scenario state, control gaps, and standards coverage before generating new injects.</p>
            <p>Safety review blocks unsafe content patterns before injects are persisted.</p>
          </div>
          <button className="toolbar-button mt-4" onClick={() => runAction("Generating regulatory inject", () => platformApi.generateInject(scenarioId))}><Sparkles size={15} />Generate AI Inject</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{modules.map((module) => <div key={module} className="panel min-h-28"><Clock3 className="mb-4 text-signal" size={18} /><p className="text-sm font-semibold">{module}</p></div>)}</div>
      </section>
    </>
  );
}

function TrainingView() {
  const averageCompletion = Math.round(trainingPrograms.reduce((sum, program) => sum + program.completion, 0) / trainingPrograms.length);
  const latestYear = trainingYearlyTracking[trainingYearlyTracking.length - 1];
  const previousYear = trainingYearlyTracking[trainingYearlyTracking.length - 2];
  const completionGrowth = latestYear.completion - previousYear.completion;
  const phishingImprovement = previousYear.phishingFailRate - latestYear.phishingFailRate;

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
      <div className="panel">
        <div className="section-title">
          <GraduationCap size={19} />
          <h2>Cybersecurity Training Command Center</h2>
        </div>
        <p className="mt-4 text-sm leading-6 text-ink/70 dark:text-white/70">
          Company-wide training for employees, CEO, board, managers, and technical teams with yearly tracking, target completion, and measurable cyber behavior improvement.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Average completion", `${averageCompletion}%`, "bg-signal"],
            ["Annual growth", `+${completionGrowth}%`, "bg-iris"],
            ["Phishing fail rate", `${latestYear.phishingFailRate}%`, "bg-ember"],
            ["Reporting maturity", `${latestYear.incidentReporting}%`, "bg-signal"]
          ].map(([label, value, accent]) => (
            <div key={label} className="rounded-lg border border-black/10 bg-cloud p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs text-ink/55 dark:text-white/55">{label}</p>
              <div className="mt-3 flex items-end justify-between">
                <strong className="text-2xl font-semibold">{value}</strong>
                <span className={`h-2 w-10 rounded-full ${accent}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-cloud text-xs uppercase text-ink/55 dark:bg-white/10 dark:text-white/55">
              <tr>
                <th className="px-3 py-3">Audience</th>
                <th className="px-3 py-3">Training Track</th>
                <th className="px-3 py-3">Completion</th>
                <th className="px-3 py-3">Cadence</th>
              </tr>
            </thead>
            <tbody>
              {trainingPrograms.map((program) => (
                <tr key={program.audience} className="border-t border-black/10 dark:border-white/10">
                  <td className="px-3 py-3 font-semibold">{program.audience}</td>
                  <td className="px-3 py-3">
                    <p>{program.track}</p>
                    <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{program.owner} - {program.completed}/{program.enrolled} complete</p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div className="h-full rounded-full bg-signal" style={{ width: `${program.completion}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{program.completion}% of {program.target}% target</p>
                  </td>
                  <td className="px-3 py-3 text-ink/65 dark:text-white/65">{program.cadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border border-black/10 p-4 dark:border-white/10">
          <div className="section-title"><FileCheck2 size={19} /><h2>Training Assignment Manager</h2></div>
          <p className="mt-3 text-sm text-ink/65 dark:text-white/65">Assign courses to roles, track due dates, overdue users, and completion certificates.</p>
          <a className="toolbar-button mt-3" href="/training/assignments" target="_blank">Open Assignments API</a>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="panel">
          <div className="section-title">
            <Activity size={19} />
            <h2>Yearly Tracking</h2>
          </div>
          <div className="mt-4 space-y-3">
            {trainingYearlyTracking.map((year) => (
              <div key={year.year} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{year.year}</p>
                  <p className="text-xs text-signal">Completion {year.completion}%</p>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-ink/60 dark:text-white/60">
                  <div className="flex justify-between"><span>Phishing fail rate</span><strong>{year.phishingFailRate}%</strong></div>
                  <div className="flex justify-between"><span>Incident reporting</span><strong>{year.incidentReporting}%</strong></div>
                  <div className="flex justify-between"><span>Executive readiness</span><strong>{year.executiveReadiness}%</strong></div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-signal/10 p-3 text-sm text-ink/70 dark:text-white/70">
            Year-over-year improvement: +{completionGrowth}% completion and {phishingImprovement}% lower phishing failure rate.
          </p>
        </div>

        <div className="panel">
          <div className="section-title">
            <GitFork size={19} />
            <h2>Growth Matrix</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {trainingGrowthMatrix.map((item) => (
              <div key={item.capability} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{item.capability}</p>
                  <span className="rounded-md bg-signal/10 px-2 py-1 text-xs font-semibold text-signal">+{item.growth}% growth</span>
                </div>
                <p className="mt-2 text-xs text-ink/55 dark:text-white/55">{item.current} to {item.next}</p>
                <p className="mt-2 text-xs leading-5 text-ink/65 dark:text-white/65">{item.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StandardsView() {
  const matrix = ["TA0001 Initial Access", "TA0002 Execution", "TA0003 Persistence", "AML.T0010 Prompt Injection", "AML.T0020 RAG Poisoning", "AML.T0031 Data Exfiltration"];
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
      <div className="panel"><div className="section-title"><ShieldAlert size={19} /><h2>Standards Mapping Coverage</h2></div><CoverageBars /></div>
      <div className="panel">
        <div className="section-title"><GitFork size={19} /><h2>Standards Graph</h2></div>
        <div className="relative mt-4 h-[390px] overflow-hidden rounded-lg border border-black/10 bg-cloud dark:border-white/10 dark:bg-white/5">
          <div className="absolute left-[18%] top-[48%] h-px w-[58%] rotate-[-12deg] bg-signal/50" />
          <div className="absolute left-[45%] top-[28%] h-px w-[35%] rotate-[18deg] bg-ember/50" />
          <div className="absolute left-[48%] top-[52%] h-px w-[34%] rotate-[-20deg] bg-iris/50" />
          {graphNodes.map((node) => <div key={node.label} className={`absolute ${node.x} w-32 rounded-lg border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#101418]`}><p className="text-xs text-ink/50 dark:text-white/50">{node.type}</p><p className="mt-1 text-sm font-semibold">{node.label}</p></div>)}
        </div>
      </div>
      <div className="panel xl:col-span-2">
        <div className="section-title"><GitFork size={19} /><h2>ATT&CK / ATLAS Matrix</h2></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{matrix.map((item) => <div key={item} className="rounded-lg border border-black/10 bg-cloud p-3 text-sm font-semibold dark:border-white/10 dark:bg-white/5">{item}</div>)}</div>
      </div>
    </section>
  );
}

function ReportsView({ scenarioId, runAction, reportSummary, setReportSummary }: { scenarioId: string; runAction: (label: string, action: () => Promise<unknown>) => Promise<void>; reportSummary: string | null; setReportSummary: (value: string) => void }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="panel">
        <div className="section-title"><FileCheck2 size={19} /><h2>After-Action Reports</h2></div>
        <p className="mt-4 text-sm text-ink/65 dark:text-white/65">Generate board-ready summaries, scorecards, gaps, recommendations, and mapped standards from live exercise evidence.</p>
        <button className="toolbar-button mt-4" onClick={() => runAction("Generating report", async () => { const report = await platformApi.afterActionReport(scenarioId); setReportSummary(`${report.title}: score ${report.score}, ${report.recommendations.length} recommendations`); })}><FileCheck2 size={15} />Generate Report</button>
        <div className="mt-3 flex flex-wrap gap-2">
          <a className="toolbar-button" href={platformApi.reportPdfUrl(scenarioId)} target="_blank">Export PDF</a>
          <a className="toolbar-button" href={platformApi.reportDocxUrl(scenarioId)} target="_blank">Export DOCX</a>
        </div>
        {reportSummary ? <div className="mt-4 rounded-lg border border-signal/30 bg-signal/10 p-4 text-sm">{reportSummary}</div> : null}
      </div>
      <div className="panel"><div className="section-title"><Activity size={19} /><h2>Report Analytics</h2></div><ResilienceRadar /></div>
    </section>
  );
}

function AdminView({ status, scenarioCount, sessionId, users }: { status: string; scenarioCount: number; sessionId: string; users: PlatformUser[] }) {
  const [auditQuery, setAuditQuery] = useState("");
  const [auditResults, setAuditResults] = useState<Array<{ id: string; action: string; actor: string; resource: string }>>([]);
  return (
    <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="grid gap-4">
        <Stat label="API connection" value={status === "live" ? "Live" : status} accent="bg-signal" />
        <Stat label="Scenario templates" value={scenarioCount} accent="bg-iris" />
        <Stat label="Admin URL" value="/admin" accent="bg-ember" />
      </div>
      <div className="panel">
        <div className="section-title"><UserCog size={19} /><h2>User Control</h2></div>
        <div className="mt-4 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-cloud text-xs uppercase text-ink/55 dark:bg-white/10 dark:text-white/55"><tr><th className="px-3 py-3">User</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Access</th></tr></thead>
            <tbody>{users.map((user) => <tr key={user.name} className="border-t border-black/10 dark:border-white/10"><td className="px-3 py-3 font-semibold">{user.name}</td><td className="px-3 py-3">{user.role}</td><td className="px-3 py-3 text-ink/60 dark:text-white/60">{user.status}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-black/10 p-4 dark:border-white/10"><Database className="mb-3 text-signal" size={18} /><p className="text-sm font-semibold">Repository</p><p className="text-xs text-ink/55 dark:text-white/55">Memory by default, PostgreSQL ready</p></div>
          <div className="rounded-lg border border-black/10 p-4 dark:border-white/10"><RadioTower className="mb-3 text-ember" size={18} /><p className="text-sm font-semibold">Live session</p><p className="text-xs text-ink/55 dark:text-white/55">{sessionId}</p></div>
        </div>
        <div className="mt-4 rounded-lg border border-black/10 p-4 dark:border-white/10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Security Control Center</p>
              <p className="mt-1 text-xs text-ink/55 dark:text-white/55">Operational controls for production readiness and enterprise buyer review.</p>
            </div>
            <a className="toolbar-button" href="/security/status" target="_blank">Security API</a>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {securityPosture.map((item) => (
              <div key={item.control} className="rounded-lg bg-cloud p-3 dark:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{item.control}</p>
                  <span className="text-xs text-signal">{item.maturity}%</span>
                </div>
                <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{item.owner} - {item.status}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm font-semibold">Compliance Readiness</p>
          <div className="mt-3 grid gap-2">
            {complianceReadiness.map((item) => (
              <div key={item.domain} className="rounded-lg bg-cloud p-3 dark:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{item.domain}</p>
                  <span className="text-xs font-semibold text-signal">{item.score}%</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-ink/60 dark:text-white/60">{item.gap}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm font-semibold">Audit Search / Export</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="min-w-0 flex-1 rounded-lg border border-black/10 bg-cloud px-3 py-2 text-sm dark:border-white/10 dark:bg-white/10" value={auditQuery} onChange={(event) => setAuditQuery(event.target.value)} placeholder="Search audit events" />
            <button className="toolbar-button" onClick={() => platformApi.auditSearch(auditQuery).then(setAuditResults)}>Search</button>
            <a className="toolbar-button" href={platformApi.auditCsvUrl()} target="_blank">Export CSV</a>
          </div>
          <div className="mt-3 space-y-2">{auditResults.map((event) => <div key={event.id} className="rounded-lg bg-cloud p-2 text-xs dark:bg-white/5">{event.actor} - {event.action} - {event.resource}</div>)}</div>
        </div>
        <div className="mt-4 rounded-lg border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm font-semibold">Enterprise Integrations</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {integrations.map((integration) => (
              <div key={integration.name} className="rounded-lg bg-cloud p-3 dark:bg-white/5">
                <p className="text-sm font-semibold">{integration.name}</p>
                <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{integration.category} - {integration.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
