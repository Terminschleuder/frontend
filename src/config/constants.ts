/**
 * Build/runtime constants for the demo client.
 *
 * The API base URL defaults to the public terminschleuder backend so the demo
 * works out of the box with **no onboarding prompt**. It remains adjustable in
 * the Settings page (persisted to localStorage). A build-time
 * `VITE_DEFAULT_API_URL` overrides the built-in default (e.g. to point a
 * deploy at a staging backend); the image stays origin-agnostic either way.
 */

export const STORAGE_KEY = "terminschleuder.demo.apiBaseUrl";

/**
 * Built-in default API base URL — the public terminschleuder backend. Used on
 * first run (nothing in localStorage), so the demo renders data immediately
 * without prompting. Override at build time with `VITE_DEFAULT_API_URL`
 * (setting it to an empty string restores the first-run onboarding prompt).
 */
export const DEFAULT_API_URL: string =
  import.meta.env.VITE_DEFAULT_API_URL ?? "https://terminschleuder.online";

/** Map tile layer (OSM). Override via VITE_MAP_TILES_URL for a custom provider. */
export const MAP_TILES_URL: string =
  import.meta.env.VITE_MAP_TILES_URL ??
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const MAP_TILES_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Default page size for list views (the backend caps at 1000). */
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];