import type { ApiClient, QueryParams } from "./client";
import { OrganizationListSchema } from "./schemas";
import type { Organization, Paginated } from "./types";

export interface OrganizationsQuery extends QueryParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export function fetchOrganizations(
  client: ApiClient,
  query: OrganizationsQuery,
  signal?: AbortSignal,
): Promise<Paginated<Organization>> {
  return client
    .get<Paginated<Organization>>("/api/organizations/", query, { signal })
    .then((data) => OrganizationListSchema.parse(data) as Paginated<Organization>);
}

export function fetchOrganization(
  client: ApiClient,
  slug: string,
  signal?: AbortSignal,
): Promise<Organization> {
  return client.get<Organization>(
    `/api/organizations/${slug}/`,
    undefined,
    { signal },
  );
}