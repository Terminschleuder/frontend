import { useQuery } from "@tanstack/react-query";
import { fetchVenues, type VenuesQuery } from "@/api/venues";
import { useApiClient } from "./useApiClient";

export function useVenues(query: VenuesQuery) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["venues", baseUrl, query],
    queryFn: ({ signal }) => fetchVenues(client, query, signal),
  });
}