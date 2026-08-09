import { buildQueryString, joinUrl } from "@/lib/url";

/** A typed API error with HTTP status and parsed detail. */
export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(status: number, detail: unknown, message?: string) {
    super(message ?? `API error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

interface FetchOptions {
  signal?: AbortSignal;
}

/** A minimal read-only HTTP client over a configured base URL. */
export interface ApiClient {
  /** GET a JSON resource, returning parsed data. Throws ApiError on non-2xx. */
  get<T>(path: string, params?: QueryParams, opts?: FetchOptions): Promise<T>;
  /** Raw GET for the connection test (returns { status, ok }). */
  getRaw(
    path: string,
    params?: QueryParams,
    opts?: FetchOptions,
  ): Promise<{ status: number; ok: boolean }>;
}

export function createApiClient(baseUrl: string): ApiClient {
  const request = async (
    path: string,
    params?: QueryParams,
    opts?: FetchOptions,
  ): Promise<Response> => {
    const url = joinUrl(baseUrl, path) + buildQueryString(params ?? {});
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: opts?.signal,
    });
    return res;
  };

  const parseError = async (res: Response): Promise<ApiError> => {
    let detail: unknown = undefined;
    try {
      detail = await res.json();
    } catch {
      try {
        detail = await res.text();
      } catch {
        /* ignore */
      }
    }
    const map: Record<number, string> = {
      400: "Bad request",
      401: "Authentication required",
      403: "Not allowed",
      404: "Not found",
    };
    return new ApiError(
      res.status,
      detail,
      map[res.status] ?? `API error ${res.status}`,
    );
  };

  return {
    async get<T>(path: string, params?: QueryParams, opts?: FetchOptions): Promise<T> {
      const res = await request(path, params, opts);
      if (!res.ok) throw await parseError(res);
      return (await res.json()) as T;
    },
    async getRaw(path, params, opts) {
      const res = await request(path, params, opts);
      // Drain the body so the connection can be reused.
      try {
        await res.text();
      } catch {
        /* ignore */
      }
      return { status: res.status, ok: res.ok };
    },
  };
}