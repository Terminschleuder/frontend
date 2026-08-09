import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useApiConfig } from "@/config/useApiConfig";
import { useConnectionTest } from "@/hooks/useConnectionTest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_API_URL } from "@/config/constants";

/**
 * First-run onboarding: prompt for the API URL before the app renders data.
 * Only renders when the build-time default is explicitly empty and nothing is
 * stored (an escape hatch); by default the demo uses `DEFAULT_API_URL` and
 * skips this prompt entirely.
 */
export function OnboardingModal() {
  const { setBaseUrl } = useApiConfig();
  const test = useConnectionTest();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(DEFAULT_API_URL || "https://terminschleuder.online");

  const confirm = () => {
    const trimmed = draft.trim().replace(/\/+$/, "");
    if (!trimmed) {
      toast.error("Enter an API URL.");
      return;
    }
    setBaseUrl(trimmed);
    toast.success(`Connected to ${trimmed}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900">
        <h1 className="text-lg font-semibold">Welcome to the terminschleuder demo</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This is a read-only customer site for the terminschleuder events API.
          Enter the API base URL to begin (you can change it later in Settings).
        </p>
        <label className="mt-4 flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">API base URL</span>
          <Input
            type="url"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirm()}
            autoFocus
          />
        </label>
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => test.mutate(undefined)}
            disabled={test.isPending}
          >
            {test.isPending ? "Testing…" : "Test connection"}
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/settings")}>
              Advanced
            </Button>
            <Button onClick={confirm}>Connect</Button>
          </div>
        </div>
        {test.data && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {test.data.ok
              ? `✓ HTTP ${test.data.status} — ${test.data.count ?? "?"} cities visible.`
              : `✗ HTTP ${test.data.status}${test.data.error ? ` — ${test.data.error}` : ""}`}
          </p>
        )}
      </div>
    </div>
  );
}