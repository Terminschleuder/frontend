import { useApiConfig } from "@/config/useApiConfig";

export function Footer() {
  const { baseUrl } = useApiConfig();
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
      <p>
        terminschleuder demo client · read-only customer view of the events API
      </p>
      <p className="mt-1 font-mono">{baseUrl}</p>
    </footer>
  );
}