import { useContext } from "react";
import { ApiConfigContext, type ApiConfigValue } from "./ApiConfigContext";

/** Access the configured API base URL. Throws if used outside the provider. */
export function useApiConfig(): ApiConfigValue {
  const ctx = useContext(ApiConfigContext);
  if (!ctx) {
    throw new Error("useApiConfig must be used within an ApiConfigProvider.");
  }
  return ctx;
}