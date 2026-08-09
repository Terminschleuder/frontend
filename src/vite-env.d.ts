/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional build-time override for the default API URL (the UI is the source of truth at runtime). */
  readonly VITE_DEFAULT_API_URL?: string;
  /** Optional map tile URL override (defaults to OpenStreetMap). */
  readonly VITE_MAP_TILES_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}