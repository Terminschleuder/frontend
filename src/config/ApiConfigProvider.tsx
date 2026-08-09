import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ApiConfigContext, type ApiConfigValue } from "./ApiConfigContext";
import { DEFAULT_API_URL } from "./constants";
import {
  clearBaseUrl as clearStored,
  loadBaseUrl,
  saveBaseUrl,
} from "./storage";

interface ApiConfigProviderProps {
  children: ReactNode;
}

/** Holds the configured API base URL in state, persisted to localStorage.
 *
 * On first load with no stored URL, the built-in `DEFAULT_API_URL`
 * (the public terminschleuder backend) is used and `isConfigured` is true, so
 * the app renders data immediately — no onboarding prompt. The onboarding
 * modal only appears if the build-time default is explicitly empty and
 * nothing is stored. */
export function ApiConfigProvider({ children }: ApiConfigProviderProps) {
  const [stored, setStored] = useState<string | null>(() => loadBaseUrl());

  const baseUrl = useMemo(() => {
    const raw = (stored ?? DEFAULT_API_URL ?? "").trim();
    return (raw || DEFAULT_API_URL).replace(/\/+$/, "");
  }, [stored]);

  const isConfigured = useMemo(
    () => Boolean((stored ?? DEFAULT_API_URL ?? "").trim()),
    [stored],
  );

  const setBaseUrl = useCallback((url: string) => {
    const trimmed = url.trim();
    if (trimmed) saveBaseUrl(trimmed);
    setStored(trimmed || null);
  }, []);

  const clearBaseUrl = useCallback(() => {
    clearStored();
    setStored(null);
  }, []);

  const value = useMemo<ApiConfigValue>(
    () => ({ baseUrl, isConfigured, setBaseUrl, clearBaseUrl }),
    [baseUrl, isConfigured, setBaseUrl, clearBaseUrl],
  );

  return (
    <ApiConfigContext.Provider value={value}>
      {children}
    </ApiConfigContext.Provider>
  );
}