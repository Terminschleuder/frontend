import { describe, it, expect } from "vitest";
import { buildQueryString, joinUrl } from "@/lib/url";
import { haversineKm, formatDistance } from "@/lib/geo";
import { parseDate, formatEventDate } from "@/lib/formatters";

describe("url.joinUrl", () => {
  it("joins base and path tolerating slashes", () => {
    // The path's trailing slash is preserved (DRF endpoints 301 without it);
    // only redundant base/leading slashes are normalized away.
    expect(joinUrl("http://x/", "/api/")).toBe("http://x/api/");
    expect(joinUrl("http://x", "api")).toBe("http://x/api");
    expect(joinUrl("http://x/", "")).toBe("http://x");
  });
});

describe("url.buildQueryString", () => {
  it("skips null/empty and serializes the rest", () => {
    expect(
      buildQueryString({ a: "1", b: 2, c: null, d: "", e: true }),
    ).toBe("?a=1&b=2&e=true");
  });
  it("returns empty string when all empty", () => {
    expect(buildQueryString({ a: null, b: "" })).toBe("");
  });
});

describe("geo.haversineKm", () => {
  it("computes a distance consistent with PostGIS geography", () => {
    const d = haversineKm({ lat: 52.52, lon: 13.405 }, { lat: 52.531, lon: 13.386 });
    // ~1.5 km Berlin centre -> Factory Berlin
    expect(d).toBeGreaterThan(1);
    expect(d).toBeLessThan(3);
  });
  it("is zero for the same point", () => {
    expect(haversineKm({ lat: 1, lon: 1 }, { lat: 1, lon: 1 })).toBe(0);
  });
});

describe("geo.formatDistance", () => {
  it("shows metres under 1km", () => {
    expect(formatDistance(0.4)).toBe("400 m");
  });
  it("shows km otherwise", () => {
    expect(formatDistance(12)).toBe("12 km");
  });
});

describe("formatters", () => {
  it("parses and formats an ISO datetime", () => {
    const d = parseDate("2026-09-08T17:00:00Z");
    expect(d).not.toBeNull();
    expect(formatEventDate("2026-09-08T17:00:00Z")).not.toBe("—");
  });
  it("returns null for garbage", () => {
    expect(parseDate("not-a-date")).toBeNull();
  });
});