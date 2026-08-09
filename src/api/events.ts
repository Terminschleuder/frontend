import type { ApiClient, QueryParams } from "./client";
import { EventListSchema, EventSchema } from "./schemas";
import type { Event, EventType, AttendanceMode, Paginated } from "./types";

/** Query parameters for `GET /api/events/`. */
export interface EventsQuery extends QueryParams {
  search?: string;
  // Proximity (mutually exclusive groups). ``proximity`` is a UI-only mode
  // marker ("none" | "near_city" | "coords") so the picker stays visible
  // before a city/coords value is chosen; the backend ignores it.
  proximity?: "none" | "near_city" | "coords";
  lat?: number | null;
  lon?: number | null;
  radius_km?: number | null;
  near_city?: string | null;
  // Scalar filters.
  city?: string;
  organization?: number | null;
  organization_slug?: string;
  event_type?: EventType | null;
  attendance_mode?: AttendanceMode | null;
  starts_at_after?: string;
  starts_at_before?: string;
  // Ordering / pagination.
  ordering?: string;
  page?: number;
  page_size?: number;
}

export function fetchEvents(
  client: ApiClient,
  query: EventsQuery,
  signal?: AbortSignal,
): Promise<Paginated<Event>> {
  return client.get<Paginated<Event>>("/api/events/", query, { signal }).then(
    (data) => EventListSchema.parse(data) as Paginated<Event>,
  );
}

export function fetchEvent(
  client: ApiClient,
  id: number,
  signal?: AbortSignal,
): Promise<Event> {
  return client
    .get<Event>(`/api/events/${id}/`, undefined, { signal })
    .then((data) => EventSchema.parse(data) as Event);
}

export function fetchOrganizationEvents(
  client: ApiClient,
  slug: string,
  query: EventsQuery,
  signal?: AbortSignal,
): Promise<Paginated<Event>> {
  return client
    .get<Paginated<Event>>(`/api/organizations/${slug}/events/`, query, {
      signal,
    })
    .then((data) => EventListSchema.parse(data) as Paginated<Event>);
}