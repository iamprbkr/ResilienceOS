FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/frontend apps/frontend
RUN npm ci --workspace apps/frontend
RUN npm --workspace apps/frontend run build

FROM nginx:1.27-alpine
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
