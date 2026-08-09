import { lazy, Suspense, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import type { EventsQuery } from "@/api/events";
import { EventFilters } from "@/components/events/EventFilters";
import { EventList } from "@/components/events/EventList";
import { Pagination } from "@/components/common/Pagination";
import { PageSizeSelect } from "@/components/common/PageSizeSelect";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";

// Leaflet is heavy — only load the map chunk when the map tab is opened.
const EventMap = lazy(() => import("@/components/map/EventMap"));

type Tab = "list" | "map";

const STRINGS: string[] = [
  "search",
  "city",
  "organization_slug",
  "event_type",
  "attendance_mode",
  "ordering",
  "starts_at_after",
  "starts_at_before",
  "near_city",
  "proximity",
];
const NUMBERS: string[] = [
  "lat",
  "lon",
  "radius_km",
  "organization",
  "page",
  "page_size",
];

function readQuery(params: URLSearchParams): EventsQuery {
  const q: EventsQuery = {};
  for (const k of STRINGS) {
    const v = params.get(k);
    if (v) (q as Record<string, unknown>)[k] = v;
  }
  for (const k of NUMBERS) {
    const v = params.get(k);
    if (v) (q as Record<string, unknown>)[k] = Number(v);
  }
  return q;
}

export function EventsPage() {
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>("list");

  const query = readQuery(params);
  const page = query.page ?? 1;
  const pageSize = query.page_size ?? DEFAULT_PAGE_SIZE;
  const proximityActive = Boolean(query.near_city) || (query.lat != null && query.lon != null);

  const fullQuery: EventsQuery = { ...query, page, page_size: pageSize };
  const { data, isLoading, isError, refetch } = useEvents(fullQuery);

  const patch = (p: Partial<EventsQuery>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(p)) {
      if (v === null || v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    }
    setParams(next);
  };
  const replace = (q: EventsQuery) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(q)) {
      if (v !== null && v !== undefined && v !== "") next.set(k, String(v));
    }
    setParams(next);
  };
  const reset = () => setParams(new URLSearchParams());

  const results = data?.results ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Events</h1>

      <EventFilters
        query={query}
        onChange={patch}
        onReplace={replace}
        onReset={reset}
      />

      {proximityActive && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          Proximity active — results are ordered nearest-first and{" "}
          <strong>online events are excluded</strong>. The selected ordering is
          ignored while proximity is on.
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            className={`rounded-md px-3 py-1.5 text-sm ${
              tab === "list" ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            }`}
            onClick={() => setTab("list")}
          >
            List
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm ${
              tab === "map" ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            }`}
            onClick={() => setTab("map")}
          >
            Map
          </button>
        </div>
        <PageSizeSelect
          value={pageSize}
          onChange={(s) => patch({ page_size: s, page: undefined })}
        />
      </div>

      {tab === "map" ? (
        <div className="h-[540px] overflow-hidden rounded-lg">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Loading map…
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Loading map…
                </div>
              }
            >
              <EventMap events={results} center={[50.11, 9.18]} zoom={4} />
            </Suspense>
          )}
        </div>
      ) : (
        <>
          <EventList
            events={results}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />
          {data && (
            <Pagination
              page={page}
              count={data.count}
              pageSize={pageSize}
              hasNext={Boolean(data.next)}
              hasPrevious={Boolean(data.previous)}
              onPageChange={(p) => patch({ page: p > 1 ? p : undefined })}
            />
          )}
        </>
      )}
    </div>
  );
}