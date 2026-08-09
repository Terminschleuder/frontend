import { useQuery } from "@tanstack/react-query";
import {
  fetchOrganizations,
  fetchOrganization,
  type OrganizationsQuery,
} from "@/api/organizations";
import { useApiClient } from "./useApiClient";

export function useOrganizations(query: OrganizationsQuery) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["organizations", baseUrl, query],
    queryFn: ({ signal }) => fetchOrganizations(client, query, signal),
  });
}

export function useOrganization(slug: string | null) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["organization", baseUrl, slug],
    queryFn: ({ signal }) => fetchOrganization(client, slug as string, signal),
    enabled: Boolean(slug),
  });
}