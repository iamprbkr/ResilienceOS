# GitHub Setup

## Prepare Repository

If Git is installed:

```bash
git init
git add .
git commit -m "Initial AI resilience platform"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/ai-resilience-platform.git
git push -u origin main
```

If Git is not installed on this machine:

1. Install Git from `https://git-scm.com/downloads/win`.
2. Restart the terminal.
3. Run the commands above.

Alternative browser flow:

1. Create an empty GitHub repository.
2. Upload the project files from `outputs/ai-resilience-platform`.
3. Do not upload `node_modules`, `dist`, `.env`, or zip files.

## Recommended Repository Settings

- Protect `main`.
- Require pull request review.
- Require build checks.
- Enable Dependabot alerts.
- Add branch rules for production deployments.

## Files Included For GitHub

- `.gitignore`
- `README.md`
- `Dockerfile`
- `render.yaml`
- `railway.json`
- `vercel.json`
- deployment and user manuals in `docs/`

## Do Not Commit

- `.env`
- `.env.local`
- `node_modules`
- `dist`
- ZIP files
