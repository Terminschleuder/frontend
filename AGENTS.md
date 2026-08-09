# AGENTS.md — instructions for AI agents working on this repo

> Read this **before** making any change to this codebase. It captures the rules that are
> easy to forget and the invariants that must not silently break.

## The one rule that matters most

**Every code change must keep the tests, the README, and the docs in sync.**

A change is not "done" when `tsc -b` passes. It is done only when **all four** are true:

1. **Code** — the change is implemented.
2. **Tests** — existing tests still pass, and new behavior is covered by new tests.
3. **README** — the scripts / config / feature list reflect the change.
4. **`docs/`** — the functional documentation reflects the change.

If you touch a component, hook, API call, query param, route, env var, or the
container/CI setup, ask yourself for each of the four: *"Does this need to
change? Does this need a new test?"* If you're not sure, assume yes.

### What lives where

- `README.md` — the **quickstart** (run it, test it, configure it) + a concise feature
  list and scripts/config tables. Keep it scannable; push depth into `docs/`.
- `docs/` — the **functional documentation** (architecture, data model, full API
  reference, features). See `docs/README.md` for the index.
- `src/tests/` — the **behavioral spec** (Vitest + React Testing Library + MSW).

### Sync checklist (run through it before declaring a task complete)

- [ ] New/changed API call, query param, or response shape → updated
  `docs/api-reference.md` **and** `docs/data-model.md`? zod schema + `types.ts` aligned?
- [ ] New/changed page, component, or route → updated `docs/features.md` **and** README?
- [ ] Build-time env var / Vite config change → updated `docs/architecture.md`,
  README config table, **and** `.env.example`?
- [ ] Container / CI / project-layout change → updated `docs/architecture.md` **and** README?
- [ ] New behavior → **new test(s)** added and passing?
- [ ] README quickstart steps still accurate (commands, ports, paths)?

## Container-first: no Node on the host

The **prod machine will not allow installing things** — it only pulls the image. To
keep the host clean and the local environment identical to CI, **Node and npm are
not installed on the host**. All install / build / typecheck / lint / test runs happen
**inside a container**:

```bash
# One-off commands (mount the demo-client into a node:22-alpine container):
docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c "npm ci"

docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c "npm run typecheck"
docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c "npm run lint"
docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c "npm run test"
docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c "npm run build"
```

The production image is built from `Dockerfile` (multi-stage `node` build → `nginx`
serving static `dist/`); it is **origin-agnostic** — it defaults to the public backend
(`https://terminschleuder.online`) with no prompt, and the API base URL is adjustable in
the browser (Settings page), persisted to `localStorage`, so one image runs against any
backend with no rebuild.

## Verification gate (do this before committing)

```bash
npm run typecheck   # tsc -b  — the REAL typecheck (see gotcha below)
npm run lint        # eslint .
npm run test        # vitest run (jsdom + MSW)
npm run build       # tsc -b && vite build
```

All four must be green. If any fails, the change is not complete — fix it before
committing. Run them inside the `node:22-alpine` container (above), not on the host.

## Known gotchas (don't re-learn these the hard way)

- **`tsc -b` is the real typecheck.** The root `tsconfig.json` uses project references
  (`files: []` + `references`) so `tsc --noEmit` is a **no-op**. Always use
  `npm run typecheck` (`tsc -b`); never substitute `tsc --noEmit` — it passes vacuously.
- **`vitest`'s major must stay in sync with `vite`'s major.** They share a transform
  pipeline; a mismatch silently breaks source-file test loading. Bump them together.
- **The zod `EventSchema` must NOT require `owner_group_id`.** The backend serializer
  declares it `write_only=True`, so it never appears in responses. Requiring it in
  zod makes every `useEvents`/`useEvent` response throw at runtime.
- **`useParams()` needs a `<Routes><Route path="…/:id">` wrapper.** Rendering a page
  component directly inside `<MemoryRouter>` gives `useParams() = {}` (the route param
  is never matched) — the page renders its not-found state and no API call is made. In
  tests, wrap detail pages in `<Routes><Route path="/events/:id" element={…}/></Routes>`.
- **MSW trailing slashes.** The API client requests `/api/events/<id>/` **with** a
  trailing slash. Handlers must match `${API_URL}/api/events/:id/` (trailing slash);
  a bare `/api/events/:id` does **not** match trailing-slash requests.
- **MSW `HttpResponse` bodies are single-use.** Reusing one `HttpResponse.json(...)`
  across multiple requests throws "Response body object should not be disturbed or
  locked". Return a fresh `HttpResponse` from the handler per request.
- **`?city=<text>` (exact venue-city match) is distinct from `?near_city=<slug>`
  (gazetteer centroid, distance filter, online events excluded).** The city filter
  combobox emits the city **name**; the proximity picker emits the **slug**. Don't
  conflate them.
- **Leaflet is lazy-loaded.** `MapView` + the per-page `*Map` wrappers are dynamic
  imports; they must never be imported at module top level or the whole Leaflet bundle
  lands in the initial chunk. jsdom cannot render a real map, so map tests are
  avoided — test the wrappers' data shape, not the tiles.
- **Geolocation needs a secure origin.** `navigator.geolocation` is only available on
  `https://` or `localhost`; on plain HTTP non-localhost it silently won't work.

## Commit conventions

- Keep commits focused; describe *what and why*.
- End commit messages with:
  `Co-Authored-By: Claude <noreply@anthropic.com>`
- Only push when the user asks. The default branch is `main`.

## Project layout (cheat sheet)

```
src/
  api/        typed API client, fetchers, zod schemas, OpenAPI-generated schema.ts, types
  components/ ui primitives, feature components (events/cities/map/layout/config/common)
  config/     ApiConfig context/provider, localStorage, build-time constants
  hooks/      TanStack Query hooks (useEvents, useCities, useOrganizations, useVenues, …)
  lib/        small helpers (cn, formatters, geo, url, queryClient)
  pages/      one per route (Events, EventDetail, Cities, Organizations, Venues, …)
  tests/      Vitest + RTL + MSW fixtures/handlers/test-utils
docs/         functional documentation (architecture, api-reference, data-model, features)
Dockerfile    multi-stage node build → nginx static serve
nginx.conf    SPA fallback + API proxy (optional)
```

When in doubt: run the gate (inside the container), read `docs/`, and keep all four
(code / tests / README / docs) in step.