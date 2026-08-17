# terminschleuder demo client

![License](https://img.shields.io/badge/license-Apache--2.0-blue)
![Node](https://img.shields.io/badge/node-22-green)

A **read-only React + TypeScript** demo customer site for the
[terminschleuder](../backend) events API. It demonstrates **everything an
unauthenticated client can do**: city catalog + search, proximity by city and
by coordinates (`near_city` vs `lat/lon`), event-type / attendance / org /
date filters, ordering, pagination, organizations + their events, venues,
categories, event detail with hero images and provenance — plus an interactive
Leaflet map and geolocation.

The demo **defaults to the public backend** (`https://terminschleuder.online`) and
needs no setup — it renders data on first load with no prompt. The API base URL is
**adjustable in the UI** (Settings page): the demo user can see and change it, test the
connection, and open the backend's self-describing OpenAPI / Swagger / ReDoc docs. The
URL is persisted to `localStorage`, so one Docker image runs against any backend — no
rebuild needed to retarget.

> This is a **completely distinct project** from `../backend` (own folder, own
> git repo). It only reads the API; it never authenticates or writes.

## Contents

- [Stack](#stack)
- [Prerequisites](#prerequisites)
- [Develop](#develop)
- [Scripts](#scripts)
- [Regenerating types](#regenerating-types)
- [Run with Docker](#run-with-docker)
- [What the demo shows](#what-the-demo-shows-every-unauthenticated-capability)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Notes & caveats](#notes--caveats)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Stack

- **Vite + React 19 + TypeScript** (`strict`), React Router v7
- **TanStack Query v5** (caching, pagination, loading/error/empty states)
- **Tailwind CSS v4** + shadcn-style primitives, dark mode toggle
- **react-leaflet** + OpenStreetMap tiles, "use my location" geolocation
- **zod** runtime validation of response shapes (drift detector)
- **openapi-typescript** — types generated from the backend's OpenAPI schema
  (single source of truth; see [Regenerating types](#regenerating-types))
- **Vitest + React Testing Library + MSW** for tests

## Prerequisites

The **backend must be running, seeded, and CORS-enabled**:

```bash
cd ../backend
./start.sh                                   # db + web on :8000
docker compose exec web python manage.py seed_cities      # 2131-city gazetteer
docker compose exec web python manage.py seed_demo        # rich demo data + hero images
```

Phases 0–0d of the backend already add `django-cors-headers` (read-only
GET/HEAD/OPTIONS, all origins by default) and `drf-spectacular`
(`/api/schema/` + Swagger + ReDoc).

## Develop

> **Container-first.** Node and npm are **not installed on the host** — the prod
> machine only pulls the image, and we keep the local environment identical to CI.
> Run install / build / test inside a `node:22-alpine` container (see
> [`AGENTS.md`](AGENTS.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md)).

```bash
# Install dependencies (inside the container, once):
docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c "npm ci"

# Dev server:
docker run --rm -p 5173:5173 -v "$(pwd):/app" -w /app node:22-alpine \
  sh -c "npm run dev -- --host 0.0.0.0"

# (optional) regenerate src/api/schema.ts from the committed openapi.json:
docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c "npm run gen:types"
```

Open http://localhost:5173. The demo defaults to the public backend
(`https://terminschleuder.online`); to point it at your local backend instead, change
the API URL in **Settings** (gear icon) to `http://localhost:8000`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` → `dist/` |
| `npm run preview` | preview the production build |
| `npm run typecheck` | `tsc -b` (the real typecheck — app + node project references) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (jsdom + MSW) |
| `npm run test:watch` | Vitest watch mode |
| `npm run format` | Prettier (write) |
| `npm run gen:types` | regenerate types from `openapi.json` |

## Regenerating types

Types are generated from the backend's OpenAPI schema, not hand-maintained:

```bash
# from the backend, export the schema:
cd ../backend
docker compose exec web python manage.py spectacular --file openapi.yaml --validate
# (or: curl http://localhost:8000/api/schema/?format=json -o ../demo-client/openapi.json)

# from the demo client, regenerate:
cd ../demo-client
npm run gen:types    # openapi-typescript openapi.json -o src/api/schema.ts
```

A committed `openapi.json` is included so the build works offline. Re-run the
two steps above after any backend serializer change.

## Run with Docker

```bash
docker build -t terminschleuder-demo .
docker run -p 8080:8080 terminschleuder-demo
# open http://localhost:8080, set the API URL in Settings
```

The runtime image is `nginxinc/nginx-unprivileged` (non-root, listens on 8080 — no
privileged port binding).

The image is origin-agnostic (the API URL is set in the browser), so the same
build runs against a local, staging, or prod backend.

### Container images & releases

CI (`.github/workflows/ci.yml`) typechecks, lints, tests, and builds on every push to
`main`/`develop`, every tag, and every PR. The image is published to the **GitHub
Container Registry** only when a commit lands on `main` (an accepted PR, once `main` is
branch-protected) or a release tag is pushed:

```bash
docker pull ghcr.io/terminschleuder/frontend:latest
docker pull ghcr.io/terminschleuder/frontend:0.1alpha
```

Development follows a `develop` → `main` cycle: work lands on `develop`, PRs to `main`
build and publish. Direct pushes to `main` are blocked by branch protection.

## What the demo shows (every unauthenticated capability)

- **Cities** — search, country filter, ordering, pagination, "load all"
  unpaginated catalog, a map tab, and "Find events near this city".
- **Events** — the centerpiece: proximity toggle (near a city / near
  coordinates with "use my location" / none), the distinct `city` exact filter
  vs `near_city` — both as **typeable city comboboxes** (the `city` filter sends
  the city **name**, the `near_city` picker sends the **slug**), organization /
  event-type / attendance / date-range filters, search, ordering (ignored while
  a proximity filter is active — matching the backend), pagination + page size,
  list & map tabs. A banner notes online events are excluded from proximity.
  `status` is intentionally omitted (a no-op for anonymous users — the queryset
  forces `published`).
- **Event detail** — **hero image banner** (falls back to a branded SVG
  placeholder when the API returns none), full description, venue + map,
  organization link, categories, capacity, provenance (`original_url`,
  `original_platform`, nested `source` / `promoted_from`), lifecycle timestamps.
- **Organizations** + **organization detail** (its published events).
- **Venues** (search, city filter, mini-map) and **Categories**.
- **Settings** — the API config UI: edit/save/clear the URL, test connection,
  links to Swagger/ReDoc/schema, and the full list of endpoints the demo calls.

## Notes & caveats

- **Geolocation** requires a secure origin (`https://` or `localhost`); on plain
  HTTP non-localhost it silently won't work.
- **Map tiles** are OpenStreetMap — attribution is rendered on every map;
  respect the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/).
- **`/api/cities/all/`** returns ~2131 cities in one response — fetched on the
  map tab, when "load all" is toggled, or when a **city combobox** is focused (the
  Events page `city` / `near_city` pickers defer the fetch until then).
- Read-only: no register/login/token/api-keys UI — those aren't "unauthenticated
  customer" behaviour.
- **Bundle splitting**: the framework (React/Router/TanStack Query) is split into
  a long-cacheable `vendor` chunk, and **Leaflet is lazy-loaded** — the map chunk
  (`MapView` + per-page `EventMap`/`CityMap`/`VenueMap` wrappers) is only
  downloaded when a user actually opens a map. The initial load never pays for
  Leaflet.

## Configuration

All optional, build-time via `.env` (see [`.env.example`](.env.example)). The
runtime API URL set in the browser always wins — these only override defaults.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_DEFAULT_API_URL` | `https://terminschleuder.online` | Overrides the built-in default API URL used on first run (before the user sets one). Set to an empty string to restore the first-run onboarding prompt. |
| `VITE_MAP_TILES_URL` | OpenStreetMap | Override the Leaflet tile layer. |

## Documentation

| Document | Scope |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Rules for AI agents editing this repo (the one-rule, container-first gate, gotchas). |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | How to set up, run the gate, and regenerate types. |
| [`docs/README.md`](docs/README.md) | Index of the functional documentation. |
| [`docs/architecture.md`](docs/architecture.md) | High-level design, request lifecycle, tech stack, config, project layout. |
| [`docs/api-reference.md`](docs/api-reference.md) | Every read-only endpoint the SPA consumes, with param tables. |
| [`docs/data-model.md`](docs/data-model.md) | The client-side TypeScript types as an ER diagram + field tables. |
| [`docs/features.md`](docs/features.md) | Per-page use-case guide for first-time visitors. |

## Project structure

```
src/
├── api/        typed client, fetchers, zod schemas, OpenAPI-generated schema, types
├── components/ ui primitives + feature components (events/cities/map/layout/config/common)
├── config/     ApiConfig context/provider, localStorage, build-time constants
├── hooks/      TanStack Query hooks (useEvents, useCities, useOrganizations, useVenues, …)
├── lib/        small helpers (cn, formatters, geo, url, queryClient)
├── pages/      one per route
└── tests/      Vitest + RTL + MSW fixtures/handlers/test-utils
docs/           functional documentation
public/         static assets (incl. placeholder-hero.svg fallback)
Dockerfile      multi-stage node → nginx
nginx.conf      SPA fallback + gzip + hashed-asset caching (+ optional /api/ proxy)
openapi.json    committed backend schema (offline codegen)
```

## Troubleshooting

- **CORS errors / "connection test" fails** — the backend must be running, seeded,
  and have `django-cors-headers` allowing your origin (it does by default). Confirm
  the URL in Settings points at the backend (e.g. `http://localhost:8000`).
- **Geolocation does nothing** — it requires a secure origin (`https://` or
  `localhost`); on plain HTTP non-localhost it silently won't work.
- **Want the first-run onboarding prompt back?** — it's off by default because the
  demo ships with a built-in API URL (`https://terminschleuder.online`). Set
  `VITE_DEFAULT_API_URL=""` at build time to restore the prompt, or just change the
  URL in Settings (persisted to `localStorage` under `terminschleuder.demo.apiBaseUrl`;
  "Reset to default" there reverts to the built-in URL).
- **No hero images / blank thumbnails** — events without a `hero_image` fall back
  to `/placeholder-hero.svg`; re-seed the backend with `seed_demo` (which
  generates a banner per event) to populate them.
- **`tsc --noEmit` passes but `tsc -b` fails (or vice-versa)** — `tsc -b` is the
  real typecheck (project references); `--noEmit` is a no-op here. Always use
  `npm run typecheck`.

## License

Apache License 2.0 — see [`LICENSE`](LICENSE).