import type { ApiClient, QueryParams } from "./client";
import { CityListSchema } from "./schemas";
import type { City, Paginated } from "./types";

export interface CitiesQuery extends QueryParams {
  search?: string;
  country_code?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export function fetchCities(
  client: ApiClient,
  query: CitiesQuery,
  signal?: AbortSignal,
): Promise<Paginated<City>> {
  return client
    .get<Paginated<City>>("/api/cities/", query, { signal })
    .then((data) => CityListSchema.parse(data) as Paginated<City>);
}

/** Full unpaginated catalog (~2131 cities) as a bare list. */
export function fetchAllCities(
  client: ApiClient,
  query: Omit<CitiesQuery, "page" | "page_size">,
  signal?: AbortSignal,
): Promise<City[]> {
  return client.get<City[]>("/api/cities/all/", query, { signal });
}

export function fetchCity(
  client: ApiClient,
  id: number,
  signal?: AbortSignal,
): Promise<City> {
  return client.get<City>(`/api/cities/${id}/`, undefined, { signal });
}