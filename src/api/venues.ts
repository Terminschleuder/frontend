import type { ApiClient, QueryParams } from "./client";
import { VenueListSchema } from "./schemas";
import type { Paginated, Venue } from "./types";

export interface VenuesQuery extends QueryParams {
  search?: string;
  city?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export function fetchVenues(
  client: ApiClient,
  query: VenuesQuery,
  signal?: AbortSignal,
): Promise<Paginated<Venue>> {
  return client
    .get<Paginated<Venue>>("/api/venues/", query, { signal })
    .then((data) => VenueListSchema.parse(data) as Paginated<Venue>);
}