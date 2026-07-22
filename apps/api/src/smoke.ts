const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:8791";

async function expectOk(path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, init);
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }
  return response;
}

async function expectOkWithAuth(authToken: string, path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${authToken}` }
  });
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }
  return response;
}

// Public endpoints (no auth required)
await expectOk("/health");
await expectOk("/ready");
await expectOk("/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@demo.local" })
});

// Obtain auth token for protected routes
const tokenRes = await expectOk("/auth/demo-token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({})
});
const { token } = await tokenRes.json() as { token: string };

// Protected routes (auth required)
await expectOkWithAuth(token, "/notifications");
await expectOkWithAuth(token, "/reports/scn-ai-rag-poisoning/export.pdf");
await expectOkWithAuth(token, "/reports/scn-ai-rag-poisoning/export.docx");
await expectOkWithAuth(token, "/audit-events/export.csv");

console.log(`Smoke test passed for ${baseUrl}`);
