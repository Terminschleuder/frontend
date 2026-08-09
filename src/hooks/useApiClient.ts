import { useMemo } from "react";
import { useApiConfig } from "@/config/useApiConfig";
import { createApiClient, type ApiClient } from "@/api/client";

/**
 * Build an ApiClient bound to the currently configured base URL.
 *
 * The client is memoized on `baseUrl` so it's stable between renders unless
 * the URL changes; TanStack query keys also embed `baseUrl`, so a URL change
 * invalidates and refetches everything.
 */
export function useApiClient(): { client: ApiClient; baseUrl: string } {
  const { baseUrl } = useApiConfig();
  const client = useMemo(() => createApiClient(baseUrl), [baseUrl]);
  return { client, baseUrl };
}