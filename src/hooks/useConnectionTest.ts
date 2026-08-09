import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import type { Paginated } from "@/api/types";

export interface ConnectionTestResult {
  ok: boolean;
  status: number;
  /** City count from the probe (page_size=1), when parseable. */
  count: number | null;
  error?: string;
}

/**
 * "Test connection" used by the Settings page: probe `GET /api/cities/?page_size=1`
 * and report the HTTP status + returned count. Run on demand (not a query).
 */
export function useConnectionTest() {
  const { client, baseUrl } = useApiClient();
  return useMutation<ConnectionTestResult, Error, void>({
    mutationKey: ["connection-test", baseUrl],
    mutationFn: async () => {
      try {
        const res = await client.getRaw("/api/cities/", { page_size: 1 });
        // Re-fetch parsed to read count (cheap, one item).
        let count: number | null = null;
        if (res.ok) {
          try {
            const data = await fetch(
              `${baseUrl.replace(/\/+$/, "")}/api/cities/?page_size=1`,
              { headers: { Accept: "application/json" } },
            ).then((r) => r.json() as Promise<Paginated<unknown>>);
            count = typeof data.count === "number" ? data.count : null;
          } catch {
            /* count is optional */
          }
        }
        return { ok: res.ok, status: res.status, count };
      } catch (e) {
        return {
          ok: false,
          status: 0,
          count: null,
          error: e instanceof Error ? e.message : String(e),
        };
      }
    },
  });
}