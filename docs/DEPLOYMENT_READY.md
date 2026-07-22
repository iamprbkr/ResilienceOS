# Deployment Ready Guide

## Current Working Deployment Shape

The application can run as one production web service:

- Node/Express serves the API.
- The same Express server serves the built React frontend.
- Default persistence is `REPOSITORY_DRIVER=memory`, which works immediately for demo deployment.
- PostgreSQL mode is available with `REPOSITORY_DRIVER=postgres` after running migrations.

## Local Production Run

```bash
npm install
npm run build
$env:PORT="8790"
$env:SERVE_FRONTEND="true"
$env:REPOSITORY_DRIVER="memory"
npm start
```

Open:

```text
http://localhost:8790
```

Health:

```text
http://localhost:8790/health
```

## Docker Deployment

```bash
docker build -t ai-resilience-platform .
docker run -p 8787:8787 -e JWT_SECRET=change-me ai-resilience-platform
```

Open:

```text
http://localhost:8787
```

## Render

This repo includes `render.yaml`.

1. Push the project to GitHub.
2. Create a new Render Blueprint.
3. Select the repository.
4. Render uses the root `Dockerfile`.
5. Health check path is `/health`.

## Railway

This repo includes `railway.json`.

1. Push the project to GitHub.
2. Create a Railway project from the repo.
3. Railway uses the root `Dockerfile`.
4. Set `JWT_SECRET`.

## PostgreSQL Mode

Set:

```env
REPOSITORY_DRIVER=postgres
DATABASE_URL=postgresql://resilience:resilience@localhost:5432/resilience
```

Run:

```bash
npm run db:migrate
npm run build
npm start
```

## Verified Working Functions

- Serves frontend from production Node server.
- Health endpoint.
- Tenant overview.
- Live simulation state.
- Advance simulation.
- Generate adaptive AI inject.
- Log executive decision.
- Generate after-action report.
- Standards coverage.
- Production dependency audit.

## Important Production Notes

- Memory mode is good for demo/live preview but resets on restart.
- PostgreSQL mode should be used for real customer data.
- Add managed Redis before high-concurrency live sessions.
- Add SSO/OIDC before enterprise rollout.
- Replace demo JWT fallback with mandatory authentication before public launch.
