import { STORAGE_KEY } from "./constants";

/** Load the persisted API base URL (or null if never set). */
export function loadBaseUrl(): string | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && v.trim() ? v.trim() : null;
  } catch {
    // localStorage may be unavailable (private mode / SSR) — degrade gracefully.
    return null;
  }
}

/** Persist the API base URL. */
export function saveBaseUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, url.trim());
  } catch {
    /* ignore */
  }
}

/** Clear the persisted API base URL (back to onboarding). */
export function clearBaseUrl(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}