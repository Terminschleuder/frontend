# Features — a use-case guide

This is a first-time-visitor guide to the demo client: what each page is for and which
read-only API capability it demonstrates. It doubles as a tour of *everything an
unauthenticated customer can do* against the terminschleuder events API.

> Routes are defined in `src/router.tsx`. The default route (`/`) is the Cities page.

## Cities — `/` and `/cities`

The entry point. Demonstrates the city gazetteer.

- **Search** by name, **filter** by country code, **order** (name / population), **paginate**.
  → `GET /api/cities/`
- **Load all** toggle → fetches the full unpaginated catalog → `GET /api/cities/all/`
  (~2131 cities). Used by the map tab and the comboboxes elsewhere.
- **Map tab** — Leaflet markers for the loaded cities → lazily-loaded map chunk.
- **Find events near this city** — links to the Events page with `near_city=<slug>`,
  demonstrating the proximity-by-city capability.

## Events — `/events`

The centerpiece. Demonstrates proximity, the exact-city filter, and every scalar filter.

- **Proximity toggle** (radio): *None* / *Near a city* / *Near coordinates*.
  - *Near a city* → a **typeable city combobox** (`valueKey="slug"`) → `near_city=<slug>`
    (+ optional `radius_km`; blank = the city's `default_radius_km`). Results are
    annotated with `distance` and **online events are excluded**; ordering is ignored.
  - *Near coordinates* → lat/lon inputs + **"use my location"** geolocation (needs a
    secure origin) → `lat`/`lon`/`radius_km`.
- **City (exact venue.city)** → a **typeable city combobox** (`valueKey="name"`) →
  `city=<name>`. Distinct from `near_city` — it's an exact `venue.city` text match, not
  proximity, and does not exclude online events or annotate distance.
- **Organization / Event type / Attendance / Starts after / Starts before** filters,
  **Search**, **Order by** (disabled while a real proximity filter is active),
  **pagination + page size**.
- **List & Map tabs** — the map lazily loads Leaflet only when opened.
- The `status` filter is intentionally absent (the public queryset forces `published`).

See `docs/api-reference.md` → Events for the full param table.

## Event detail — `/events/:id`

A single event, fully expanded. Demonstrates the detail endpoint and provenance.

- **Hero image banner** — falls back to a branded SVG placeholder when `hero_image` is null.
- Full description, **date** (absolute + relative), **venue + map** (lazily loaded, only
  when the event has a location), **organization** link, **categories**, **capacity**.
- **Provenance** — `original_url` / `original_platform`, nested `source`, and
  `promoted_from` (the observation it was promoted from).
- Lifecycle timestamps (published / created / updated, relative).
  → `GET /api/events/<id>/`

## Organizations — `/organizations`

- List with search, ordering, pagination → `GET /api/organizations/`.
- Each card links to the detail page.

## Organization detail — `/organizations/:slug`

- The organization's profile + its **published events** (reusing the events list UI).
  → `GET /api/organizations/<slug>/` and `GET /api/organizations/<slug>/events/`.

## Venues — `/venues`

- Search, **city filter**, ordering, pagination, and a mini-map per venue (lazy).
  → `GET /api/venues/`

## Categories — `/categories`

- Search + pagination of the category catalog. → `GET /api/categories/`

## Settings — `/settings`

- The **API configuration UI**: edit / save / clear the base URL, **test connection**
  (raw `GET /api/schema/` → status), and links to the backend's Swagger / ReDoc / schema.
- Lists every endpoint the demo calls, so the configuration surface is self-documenting.