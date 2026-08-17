# Multi-stage build for the terminschleuder demo client.
#
# The app is a static SPA; the API URL is configured in the browser UI, so one
# build runs anywhere — no rebuild needed to retarget a different backend.
# Runtime is the unprivileged nginx image (runs as non-root, listens on 8080,
# no privileged port binding).

# --- build stage -----------------------------------------------------------
FROM node:26-alpine AS build
WORKDIR /app

# Install deps first for better layer caching.
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# --- runtime stage ---------------------------------------------------------
FROM nginxinc/nginx-unprivileged:alpine AS runtime

# Static assets. The unprivileged image serves from the same root as nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# nginx config (SPA fallback, gzip, hashed-asset caching). Listens on 8080.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# OCI image metadata. CI (docker/metadata-action) appends source/revision/version.
LABEL org.opencontainers.image.title="terminschleuder-frontend" \
      org.opencontainers.image.description="Read-only React demo client for the terminschleuder events API" \
      org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.base.name="docker.io/nginxinc/nginx-unprivileged:alpine"

EXPOSE 8080

# Optional: uncomment to proxy /api/ to a backend for same-origin production
# deploys (not used by default — the demo calls the user-configured API URL
# directly, relying on the backend's CORS support).
# ENV BACKEND_HOST=http://backend:8000

CMD ["nginx", "-g", "daemon off;"]