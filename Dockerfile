FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY --from=deps /app/pnpm-lock.yaml pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml pnpm-workspace.yaml
COPY package.json pnpm-workspace.yaml ./
COPY apps apps
RUN pnpm build
RUN pnpm prune --prod

FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8787
ENV SERVE_FRONTEND=true
ENV REPOSITORY_DRIVER=memory
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json package.json
COPY --from=build /app/pnpm-lock.yaml pnpm-lock.yaml
COPY --from=build /app/apps/api/package.json apps/api/package.json
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/frontend/dist apps/frontend/dist
EXPOSE 8787
CMD ["node", "apps/api/dist/server.js"]
