# Multi-stage build for the terminschleuder demo client.
#
# The app is a static SPA; the API URL is configured in the browser UI, so one
# build runs anywhere — no rebuild needed to retarget a different backend.

# --- build stage -----------------------------------------------------------
FROM node:26-alpine AS build
WORKDIR /app

# Install deps first for better layer caching.
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# --- runtime stage ---------------------------------------------------------
FROM nginx:alpine AS runtime

# Static assets.
COPY --from=build /app/dist /usr/share/nginx/html

# nginx config (SPA fallback, gzip, hashed-asset caching).
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Optional: uncomment to proxy /api/ to a backend for same-origin production
# deploys (not used by default — the demo calls the user-configured API URL
# directly, relying on the backend's CORS support).
# ENV BACKEND_HOST=http://backend:8000

CMD ["nginx", "-g", "daemon off;"]
