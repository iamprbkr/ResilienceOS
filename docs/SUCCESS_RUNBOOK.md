# 100% Successful Running Runbook

## Demo Mode

Use this for demos, investor previews, internal walkthroughs, and Vercel frontend testing.

```bash
npm install
npm run build
$env:PORT="8791"
$env:SERVE_FRONTEND="true"
$env:REPOSITORY_DRIVER="memory"
npm start
```

Open:

```text
http://localhost:8791
```

Check:

```text
http://localhost:8791/health
http://localhost:8791/ready
```

Run automated smoke checks:

```bash
$env:SMOKE_BASE_URL="http://localhost:8791"
npm run smoke
```

## Production Mode

Use this before real customer data.

Required:

- `REPOSITORY_DRIVER=postgres`
- `DATABASE_URL=managed-postgres-url`
- `JWT_SECRET=strong-random-secret`
- `WEB_ORIGIN=https://your-frontend-domain`
- `VITE_API_BASE_URL=https://your-api-domain`

Run migrations:

```bash
npm run db:migrate
```

## Success Checklist

- Login works.
- Admin workspace loads.
- Mobile sidebar opens.
- Light/dark mode works.
- Notifications load from API.
- Scenario create/edit/delete works.
- WebSocket shows connected.
- PDF/DOCX exports download.
- Audit CSV export downloads.
- `/ready` has no production warnings.

## What Makes It Enterprise-Sellable

- Clear $25k annual launch-tier package.
- CEO/board tabletop workflow.
- Evidence vault.
- Standards mapping.
- Report exports.
- Admin/user management.
- Audit search/export.
- Integration posture.
- PostgreSQL persistence path.
