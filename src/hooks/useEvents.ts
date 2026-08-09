import { useQuery } from "@tanstack/react-query";
import {
  fetchEvents,
  fetchEvent,
  fetchOrganizationEvents,
  type EventsQuery,
} from "@/api/events";
import { useApiClient } from "./useApiClient";

/** Paginated events list with the full filter/proximity/pagination matrix. */
export function useEvents(query: EventsQuery) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["events", baseUrl, query],
    queryFn: ({ signal }) => fetchEvents(client, query, signal),
  });
}

export function useEvent(id: number | null) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["event", baseUrl, id],
    queryFn: ({ signal }) => fetchEvent(client, id as number, signal),
    enabled: id != null,
  });
}

/** An organization's published events (reuses the events queryset). */
export function useOrganizationEvents(slug: string | null, query: EventsQuery) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["org-events", baseUrl, slug, query],
    queryFn: ({ signal }) =>
      fetchOrganizationEvents(client, slug as string, query, signal),
    enabled: Boolean(slug),
  });
}