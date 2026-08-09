import { describe, it, expect } from "vitest";
import { createApiClient, ApiError } from "@/api/client";

describe("api client", () => {
  it("GET returns parsed JSON on 200", async () => {
    const client = createApiClient("https://example.test");
    // No network: stub fetch.
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    ) as unknown as typeof fetch;
    try {
      const data = await client.get<{ ok: boolean }>("/api/x/");
      expect(data.ok).toBe(true);
    } finally {
      globalThis.fetch = original;
    }
  });

  it("throws ApiError with status on non-2xx", async () => {
    const client = createApiClient("https://example.test");
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: "nope" }), { status: 404 }),
    ) as unknown as typeof fetch;
    try {
      await expect(client.get("/api/missing/")).rejects.toMatchObject({
        name: "ApiError",
        status: 404,
      });
      // and it's an instance
      await client.get("/api/missing/").catch((e) => expect(e).toBeInstanceOf(ApiError));
    } finally {
      globalThis.fetch = original;
    }
  });

  it("serializes params into the query string", async () => {
    const client = createApiClient("https://example.test");
    const original = globalThis.fetch;
    let calledUrl = "";
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      calledUrl = url;
      return Promise.resolve(new Response("{}", { status: 200 }));
    }) as unknown as typeof fetch;
    try {
      await client.get("/api/events/", { near_city: "berlin-de", radius_km: 10, search: null });
      expect(calledUrl).toContain("near_city=berlin-de");
      expect(calledUrl).toContain("radius_km=10");
      // null params are skipped
      expect(calledUrl).not.toContain("search");
    } finally {
      globalThis.fetch = original;
    }
  });
});