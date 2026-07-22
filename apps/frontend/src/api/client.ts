const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8787" : "");
export const WS_URL =
  API_BASE_URL.startsWith("http")
    ? API_BASE_URL.replace(/^http/, "ws") + "/ws"
    : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`;

export interface PlatformUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  severity: string;
  read: boolean;
  createdAt: string;
}

export interface PlatformOverview {
  tenant: { id: string; name: string; sector: string; region: string; plan: string };
  activeScenario?: {
    id: string;
    title: string;
    resilienceScore: number;
    roles: string[];
    standards: string[];
  };
  scenarios: Array<{ id: string; title: string; module: string; status: string; resilienceScore: number; durationMinutes?: number }>;
  scorecards: Array<{ domain: string; score: number; target: number; trend: number }>;
  mappings: Array<{ framework: string; covered: number; total: number; coveragePercent: number; gap: number }>;
  sessions: Array<{ id: string; scenarioId: string; status: string; currentMinute: number }>;
}

export interface SimulationSummary {
  id: string;
  scenarioId: string;
  status: string;
  currentMinute: number;
  calculatedScore: number;
  deliveredInjects: Array<{ id: string; minute: number; title: string; channel: string; severity: string }>;
  riskState: {
    trustImpact: number;
    operationalImpact: number;
    regulatoryImpact: number;
    containmentConfidence: number;
  };
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  resource: string;
  createdAt: string;
}

export interface AfterActionReport {
  scenarioId: string;
  title: string;
  executiveSummary: string;
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  mappedStandards: string[];
  decisionMetrics: {
    decisionsLogged: number;
    averageResponseSeconds: number;
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers
    }
  });
  if (response.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new CustomEvent("auth:expired"));
    throw new Error("Session expired. Please log in again.");
  }
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const platformApi = {
  login: (email: string, role: string) =>
    request<{ token: string; user: PlatformUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, role })
    }),
  me: () => request<{ user: PlatformUser }>("/me"),
  users: () => request<PlatformUser[]>("/users"),
  createUser: (input: { name: string; email: string; role: string }) =>
    request<PlatformUser>("/users", { method: "POST", body: JSON.stringify(input) }),
  notifications: () => request<NotificationItem[]>("/notifications"),
  markNotificationRead: (id: string) => request<NotificationItem>(`/notifications/${id}/read`, { method: "POST" }),
  overview: (tenantId = "ten-sovereign-health") => request<PlatformOverview>(`/tenants/${tenantId}/overview`),
  simulation: (sessionId = "ses-live-rag-001") => request<SimulationSummary>(`/simulations/${sessionId}`),
  auditEvents: (tenantId = "ten-sovereign-health") => request<AuditEvent[]>(`/tenants/${tenantId}/audit-events`),
  auditSearch: (q: string) => request<AuditEvent[]>(`/audit-events?q=${encodeURIComponent(q)}`),
  createScenario: (input: { title: string; module: string; difficulty: string; durationMinutes: number; standards: string[]; roles: string[] }) =>
    request("/scenarios", {
      method: "POST",
      body: JSON.stringify({ tenantId: "ten-sovereign-health", objectives: [], ...input })
    }),
  updateScenario: (id: string, input: { title?: string; status?: string; durationMinutes?: number }) =>
    request(`/scenarios/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  deleteScenario: (id: string) => request(`/scenarios/${id}`, { method: "DELETE" }),
  advanceSimulation: (sessionId: string, minutes = 15) =>
    request<SimulationSummary>(`/simulations/${sessionId}/advance`, {
      method: "POST",
      body: JSON.stringify({ minutes })
    }),
  logDecision: (sessionId: string, injectId: string | null, decision: string) =>
    request(`/simulations/${sessionId}/decisions`, {
      method: "POST",
      body: JSON.stringify({
        injectId,
        role: "CISO",
        decision,
        rationale: "Logged from the live command-center UI.",
        responseTimeSeconds: 300
      })
    }),
  generateInject: (scenarioId: string) =>
    request(`/simulations/${scenarioId}/generate-inject`, {
      method: "POST",
      body: JSON.stringify({ pressure: "regulatory", minute: 88 })
    }),
  afterActionReport: (scenarioId: string) => request<AfterActionReport>(`/reports/${scenarioId}/after-action`),
  reportPdfUrl: (scenarioId: string) => `${API_BASE_URL}/reports/${scenarioId}/export.pdf`,
  reportDocxUrl: (scenarioId: string) => `${API_BASE_URL}/reports/${scenarioId}/export.docx`,
  auditCsvUrl: () => `${API_BASE_URL}/audit-events/export.csv`
};
