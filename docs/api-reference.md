# API reference (client perspective)

This documents **only the read-only endpoints the demo client consumes**. For the
authoritative backend contract (status codes, error bodies, permissions), see the
backend's `docs/api-reference.md`.

## Conventions

- **Configurable base URL.** All requests go to the base URL set in the browser (Settings
  page / onboarding), persisted to `localStorage`. `VITE_DEFAULT_API_URL` may prefill it.
- **Read-only `GET` only.** The SPA never authenticates or writes; CORS is enabled for
  `GET/HEAD/OPTIONS` from all origins on the backend.
- **Trailing slashes.** The client requests collection and detail URLs **with** a
  trailing slash (`/api/events/`, `/api/events/<id>/`). MSW handlers in tests must match
  the same shape.
- **Type safety.** Responses are parsed by zod schemas (`src/api/schemas.ts`) as a
  drift detector; the hand-written types live in `src/api/types.ts` and the
  OpenAPI-generated types in `src/api/schema.ts`.
- **Pagination envelope.** List endpoints return `{ count, next, previous, results }`;
  `next`/`previous` are opaque URLs. The client drives pagination with `page` +
  `page_size` params, not the cursor URLs. The exception is `/api/cities/all/`, which
  returns a **bare array** (no envelope).
- **Error mapping.** `api/client.ts` throws an `ApiError` carrying `status` + parsed
  `detail`; the UI renders loading/error/empty states per query (TanStack Query).
- **Query string building.** `null`/`undefined`/`""` params are omitted
  (`src/lib/url.ts`).

## Cities

### `GET /api/cities/` — paginated city catalog

```ts
client.get<Paginated<City>>("/api/cities/", query)
```

| Param | Type | Notes |
| --- | --- | --- |
| `search` | string | name substring |
| `country_code` | string | e.g. `DE` |
| `ordering` | string | e.g. `name`, `-population` |
| `page` | number | 1-based |
| `page_size` | number | capped at 1000 |

### `GET /api/cities/all/` — full unpaginated catalog (bare array)

```ts
client.get<City[]>("/api/cities/all/", query)   // ~2131 cities, no envelope
```

Used by the city **comboboxes** (Events page `city` and `near_city` pickers) and the
cities map tab. Fetched lazily — the combobox defers the fetch until the control is
focused or already has a value, so the Events page doesn't eagerly pull 2131 rows.

### `GET /api/cities/<id>/` — single city

```ts
client.get<City>(`/api/cities/${id}/`)
```

## Events

### `GET /api/events/` — paginated event list

```ts
client.get<Paginated<Event>>("/api/events/", query)
```

The centerpiece. All filters are optional and combine.

| Param | Type | Notes |
| --- | --- | --- |
| `search` | string | title/description substring |
| `city` | string | **exact** `venue.city` match (e.g. `Berlin`) — distinct from `near_city` |
| `organization_slug` | string | filter by organization |
| `organization` | number | organization id (alternative) |
| `event_type` | enum | `meetup` \| `conference` \| `workshop` \| `social` \| `other` |
| `attendance_mode` | enum | `physical` \| `online` \| `hybrid` |
| `starts_at_after` | date | ISO date `YYYY-MM-DD` |
| `starts_at_before` | date | ISO date `YYYY-MM-DD` |
| `ordering` | string | ignored while proximity is active (nearest-first) |
| `lat` | number | proximity point latitude (with `lon`) |
| `lon` | number | proximity point longitude (with `lat`) |
| `near_city` | string | **city slug** (e.g. `berlin-de`) — gazetteer centroid proximity |
| `radius_km` | number | proximity radius; blank = the city's `default_radius_km` |
| `page` | number | 1-based |
| `page_size` | number | capped at 1000 |

> **`city` vs `near_city`:** `city=<text>` is an exact match on `venue.city` (the
> combobox emits the city **name**). `near_city=<slug>` is a gazetteer-centroid
> distance filter (the picker emits the **slug**), which annotates each result with
> `distance` (km) and **excludes online events**. While proximity is active, the
> backend orders nearest-first and ignores `ordering`.
>
> The SPA also sends a UI-only `proximity` marker (`none` \| `near_city` \|
> `coords`) so the picker stays visible before a value is chosen; the backend ignores
> it. `status` is deliberately not sent — the public queryset forces `published`.

### `GET /api/events/<id>/` — single event

```ts
client.get<Event>(`/api/events/${id}/`)
```

## Organizations

### `GET /api/organizations/` — paginated

```ts
client.get<Paginated<Organization>>("/api/organizations/", query)
```

| Param | Type | Notes |
| --- | --- | --- |
| `search` | string | name substring |
| `ordering` | string | e.g. `name` |
| `page`, `page_size` | number | pagination |

### `GET /api/organizations/<slug>/` — single organization

```ts
client.get<Organization>(`/api/organizations/${slug}/`)
```

### `GET /api/organizations/<slug>/events/` — that org's published events

```ts
client.get<Paginated<Event>>(`/api/organizations/${slug}/events/`, query)
```

Accepts the same event filters as `/api/events/` (above).

## Venues

### `GET /api/venues/` — paginated

```ts
client.get<Paginated<Venue>>("/api/venues/", query)
```

| Param | Type | Notes |
| --- | --- | --- |
| `search` | string | name/address substring |
| `city` | string | exact city match |
| `ordering` | string | e.g. `name` |
| `page`, `page_size` | number | pagination |

## Categories

### `GET /api/categories/` — paginated

```ts
client.get<Paginated<Category>>("/api/categories/", query)
```

| Param | Type | Notes |
| --- | --- | --- |
| `search` | string | name substring |
| `page`, `page_size` | number | pagination |

## Connection test

The Settings page tests the configured URL with a lightweight raw GET (no body parse),
surfacing the HTTP status:

```ts
client.getRaw("/api/schema/")   // returns { status, ok }
```