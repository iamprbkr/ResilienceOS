# Vercel Deployment

## Recommended Vercel Architecture

Use Vercel for the frontend and host the API on Render, Railway, or another Node service.

Reason: this project includes a full Express API and a production single-service Docker path. Vercel is strongest for the React frontend. The included `vercel.json` deploys the frontend and supports `/admin` routing.

## Vercel Steps

This machine can run Vercel through:

```bash
npx vercel --version
```

1. Push the project to GitHub.
2. Create a new Vercel project from the GitHub repository.
3. Set framework to `Vite`.
4. Build command:

```bash
npm install && npm --workspace apps/frontend run build
```

5. Output directory:

```text
apps/frontend/dist
```

6. Add environment variable:

```env
VITE_API_BASE_URL=https://your-api-service.example
```

7. Deploy.

CLI deploy option:

```bash
npx vercel login
npx vercel --prod
```

Token deploy option:

```bash
$env:VERCEL_TOKEN="your-token"
npx vercel --prod --token $env:VERCEL_TOKEN
```

## URLs

Main app:

```text
https://your-vercel-app.vercel.app
```

Admin:

```text
https://your-vercel-app.vercel.app/admin
```

## API Hosting

For the API, use Render or Railway with the included Dockerfile:

- Health check: `/health`
- Port: `8787`
- Required environment:

```env
SERVE_FRONTEND=true
REPOSITORY_DRIVER=memory
JWT_SECRET=replace-with-production-secret
```

For persistent data:

```env
REPOSITORY_DRIVER=postgres
DATABASE_URL=your-managed-postgres-url
```

## Complete Live Setup

1. Deploy backend to Render or Railway.
2. Copy backend URL, for example `https://ai-resilience-api.onrender.com`.
3. In Vercel, set:

```env
VITE_API_BASE_URL=https://ai-resilience-api.onrender.com
```

4. Redeploy Vercel.
5. Verify:

```text
https://your-vercel-app.vercel.app
https://your-vercel-app.vercel.app/admin
https://ai-resilience-api.onrender.com/health
```
