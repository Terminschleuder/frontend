# Contributing

Thanks for working on the terminschleuder demo client! This is a **read-only
React + TypeScript** SPA that consumes the [terminschleuder](../backend) events
API. Before your first change, please read [`AGENTS.md`](AGENTS.md) — it states
the one rule (keep code, tests, README, and `docs/` in sync) and the
container-first workflow.

## Prerequisites

- **Docker** (Node 22 is provided via the `node:22-alpine` container — nothing is
  installed on the host).
- The **backend running, seeded, and CORS-enabled** for manual checks
  (see `../backend/README.md`): `./start.sh`, then `seed_cities` and `seed_demo`.

## Local development (container-first)

```bash
# Install dependencies (once) — run inside the container, not on the host:
docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c "npm ci"

# Dev server (needs a local node, or run via the container):
docker run --rm -p 5173:5173 -v "$(pwd):/app" -w /app node:22-alpine \
  sh -c "npm run dev -- --host 0.0.0.0"
```

Then open http://localhost:5173, accept the onboarding modal (enter
`http://localhost:8000`), and you're in.

## Verification gate (before every commit)

Run all four, inside the container, and keep them green:

```bash
docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c \
  "npm run typecheck && npm run lint && npm run test && npm run build"
```

| Script | What it checks |
| --- | --- |
| `npm run typecheck` | `tsc -b` — the real typecheck (project references). |
| `npm run lint` | ESLint over the whole tree. |
| `npm run test` | Vitest + React Testing Library + MSW (jsdom). |
| `npm run build` | `tsc -b && vite build` → `dist/`. |

If any of these fails, the change is not complete. See `AGENTS.md` for the known
gotchas (`tsc -b` vs `--noEmit`, zod must not require `owner_group_id`, MSW
trailing slashes, etc.).

## Regenerating API types

Types are generated from the backend's OpenAPI schema (a committed
`openapi.json` keeps the build working offline):

```bash
# 1. From the backend, export the schema:
cd ../backend
docker compose exec web python manage.py spectacular --file openapi.yaml --validate
# (or: curl http://localhost:8000/api/schema/?format=json -o ../demo-client/openapi.json)

# 2. From the demo client, regenerate:
cd ../demo-client
docker run --rm -v "$(pwd):/app" -w /app node:22-alpine sh -c "npm run gen:types"
```

After regenerating, align the hand-written `src/api/types.ts` and the zod
schemas in `src/api/schemas.ts`, then run the gate.

## Commit conventions

- Keep commits focused; describe *what* changed and *why*.
- End commit messages with:
  `Co-Authored-By: Claude <noreply@anthropic.com>`
- Push only when asked; the default branch is `main`.

## License

By contributing you agree your changes are licensed under the
[Apache License 2.0](LICENSE) that covers this project.