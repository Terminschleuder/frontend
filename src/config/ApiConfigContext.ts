import { createContext } from "react";

export interface ApiConfigValue {
  /** The configured API base URL, without a trailing slash. */
  baseUrl: string;
  /** Whether the user has chosen a URL yet (false → show onboarding). */
  isConfigured: boolean;
  /** Set and persist a new base URL. */
  setBaseUrl: (url: string) => void;
  /** Clear the stored URL (returns to onboarding). */
  clearBaseUrl: () => void;
}

export const ApiConfigContext = createContext<ApiConfigValue | null>(null);