import { useApiConfig } from "@/config/useApiConfig";

/** A small pill in the header showing the active API base URL. */
export function ApiBadge() {
  const { baseUrl, isConfigured } = useApiConfig();
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-2.5 py-1 text-xs font-mono text-slate-600 dark:border-slate-700 dark:text-slate-300"
      title="The API URL this demo is currently reading from"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isConfigured ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {baseUrl}
    </span>
  );
}