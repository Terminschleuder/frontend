import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApiConfig } from "@/config/useApiConfig";
import { useConnectionTest } from "@/hooks/useConnectionTest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { joinUrl } from "@/lib/url";

/** Every endpoint the demo calls — so the user sees exactly what's in use. */
const ENDPOINTS = [
  { method: "GET", path: "/api/cities/", note: "city catalog (search/filter/order; paginated)" },
  { method: "GET", path: "/api/cities/all/", note: "full catalog, unpaginated (~2131 cities)" },
  { method: "GET", path: "/api/cities/<id>/", note: "city detail" },
  { method: "GET", path: "/api/events/", note: "events list (proximity + filters + pagination)" },
  { method: "GET", path: "/api/events/<id>/", note: "event detail (with hero image + provenance)" },
  { method: "GET", path: "/api/organizations/", note: "active organizations" },
  { method: "GET", path: "/api/organizations/<slug>/", note: "organization detail" },
  { method: "GET", path: "/api/organizations/<slug>/events/", note: "an org's published events" },
  { method: "GET", path: "/api/venues/", note: "venues (search/city filter)" },
  { method: "GET", path: "/api/categories/", note: "categories" },
  { method: "GET", path: "/api/schema/", note: "OpenAPI 3 schema (this demo's type source)" },
  { method: "GET", path: "/api/schema/swagger-ui/", note: "interactive API docs" },
  { method: "GET", path: "/api/schema/redoc/", note: "ReDoc API docs" },
];

export function SettingsPage() {
  const { baseUrl, setBaseUrl, clearBaseUrl } = useApiConfig();
  const [draft, setDraft] = useState(baseUrl);
  const test = useConnectionTest();

  useEffect(() => setDraft(baseUrl), [baseUrl]);

  const save = () => {
    const trimmed = draft.trim().replace(/\/+$/, "");
    if (!trimmed) {
      toast.error("Enter an API URL first.");
      return;
    }
    setBaseUrl(trimmed);
    toast.success(`API URL set to ${trimmed}`);
  };

  const runTest = () => {
    // Test against the draft so the user can verify before saving.
    const target = draft.trim().replace(/\/+$/, "");
    test.mutate(undefined, {
      onSuccess: (res) => {
        if (res.ok)
          toast.success(
            `Connection OK (HTTP ${res.status}) — ${res.count ?? "?"} cities visible at ${target}.`,
          );
        else
          toast.error(
            `Connection failed (HTTP ${res.status}) at ${target}${res.error ? `: ${res.error}` : ""}`,
          );
      },
      onError: (e) => toast.error(`Connection error: ${e.message}`),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">API settings</h1>

      <Card className="space-y-3 p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">terminschleuder API base URL</span>
          <Input
            type="url"
            value={draft}
            placeholder="http://localhost:8000"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
          <span className="text-xs text-slate-400">
            This demo reads the API read-only from this URL. It's stored in your
            browser's localStorage.
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          <Button onClick={save}>Save</Button>
          <Button variant="outline" onClick={runTest} disabled={test.isPending}>
            {test.isPending ? "Testing…" : "Test connection"}
          </Button>
          <Button variant="ghost" onClick={() => { clearBaseUrl(); setDraft(""); toast("Cleared — onboarding will show."); }}>
            Clear
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-semibold">Self-describing API</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The backend exposes an OpenAPI 3 schema and interactive docs at the
          configured URL:
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <a className="underline" target="_blank" rel="noreferrer" href={joinUrl(baseUrl, "/api/schema/swagger-ui/")}>
              Swagger UI
            </a>
          </li>
          <li>
            <a className="underline" target="_blank" rel="noreferrer" href={joinUrl(baseUrl, "/api/schema/redoc/")}>
              ReDoc
            </a>
          </li>
          <li>
            <a className="underline" target="_blank" rel="noreferrer" href={joinUrl(baseUrl, "/api/schema/")}>
              Raw OpenAPI schema
            </a>
          </li>
        </ul>
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-semibold">Endpoints this demo calls</h2>
        <p className="mt-1 text-xs text-slate-400">
          All read-only (GET). The backend must be running, seeded
          (<code>seed_cities</code>, optionally <code>seed_demo</code>), and
          CORS-enabled for the demo's origin.
        </p>
        <table className="mt-3 w-full text-left text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="py-1 pr-3">Method</th>
              <th className="py-1 pr-3">Path</th>
              <th className="py-1">Purpose</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {ENDPOINTS.map((e) => (
              <tr key={e.path} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-1 pr-3 text-slate-500">{e.method}</td>
                <td className="py-1 pr-3">{e.path}</td>
                <td className="py-1 font-sans text-slate-500 dark:text-slate-400">{e.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}