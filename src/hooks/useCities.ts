import { useQuery } from "@tanstack/react-query";
import {
  fetchCities,
  fetchAllCities,
  fetchCity,
  type CitiesQuery,
} from "@/api/cities";
import { useApiClient } from "./useApiClient";

/** Paginated city catalog with search/filter/ordering. */
export function useCities(query: CitiesQuery) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["cities", baseUrl, query],
    queryFn: ({ signal }) => fetchCities(client, query, signal),
  });
}

/** Full unpaginated city catalog (heavier — ~2131 cities). */
export function useCitiesAll(query: Omit<CitiesQuery, "page" | "page_size">, enabled = true) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["cities-all", baseUrl, query],
    queryFn: ({ signal }) => fetchAllCities(client, query, signal),
    enabled,
  });
}

export function useCity(id: number | null) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["city", baseUrl, id],
    queryFn: ({ signal }) => fetchCity(client, id as number, signal),
    enabled: id != null,
  });
}