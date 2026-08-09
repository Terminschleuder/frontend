/**
 * Build/runtime constants for the demo client.
 *
 * The API base URL is configured in the UI (Settings page), persisted to
 * localStorage. `VITE_DEFAULT_API_URL` can prefill a deployed demo so the
 * onboarding modal isn't required; the image stays origin-agnostic either way.
 */

export const STORAGE_KEY = "terminschleuder.demo.apiBaseUrl";

/** Default base URL when nothing is stored and no build-time default is set. */
export const FALLBACK_API_URL = "http://localhost:8000";

/** Build-time optional prefill (no rebuild needed to retarget at runtime). */
export const DEFAULT_API_URL: string =
  import.meta.env.VITE_DEFAULT_API_URL ?? "";

/** Map tile layer (OSM). Override via VITE_MAP_TILES_URL for a custom provider. */
export const MAP_TILES_URL: string =
  import.meta.env.VITE_MAP_TILES_URL ??
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const MAP_TILES_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Default page size for list views (the backend caps at 1000). */
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];