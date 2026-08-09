import { lazy, Suspense, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCities, useCitiesAll } from "@/hooks/useCities";
import { CityCard } from "@/components/cities/CityCard";
import { CitySearch } from "@/components/cities/CitySearch";
import { CityListSkeleton } from "@/components/common/Skeletons";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { PageSizeSelect } from "@/components/common/PageSizeSelect";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";

type Tab = "list" | "map";

// Defer Leaflet until the map tab is opened.
const CityMap = lazy(() => import("@/components/map/CityMap"));

export function CitiesPage() {
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>("list");

  const search = params.get("search") ?? "";
  const countryCode = params.get("country_code") ?? "";
  const ordering = params.get("ordering") ?? "name";
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("page_size") ?? String(DEFAULT_PAGE_SIZE));
  const loadAll = params.get("all") === "1";

  const baseQuery = { search, country_code: countryCode, ordering };
  const { data, isLoading, isError, refetch } = useCities({
    ...baseQuery,
    page,
    page_size: pageSize,
  });
  // Only fetch the full catalog when on the map tab or "load all".
  const { data: allCities, isLoading: allLoading } = useCitiesAll(
    baseQuery,
    tab === "map" || loadAll,
  );

  const patch = (p: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(p)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    setParams(next);
  };

  const cities = loadAll ? allCities ?? [] : data?.results ?? [];
  const showSkeleton = loadAll ? allLoading : isLoading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cities</h1>
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
      </div>

      <CitySearch
        search={search}
        countryCode={countryCode}
        ordering={ordering}
        onSearch={(v) => patch({ search: v, page: null })}
        onCountry={(v) => patch({ country_code: v, page: null })}
        onOrdering={(v) => patch({ ordering: v, page: null })}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={loadAll}
            onChange={(e) => patch({ all: e.target.checked ? "1" : null, page: null })}
          />
          Load all (unpaginated, ~2131 cities)
        </label>
        {!loadAll && tab === "list" && (
          <PageSizeSelect
            value={pageSize}
            onChange={(s) => patch({ page_size: String(s), page: null })}
          />
        )}
      </div>

      {tab === "map" ? (
        <div className="h-[520px] overflow-hidden rounded-lg">
          {showSkeleton ? (
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
              <CityMap cities={allCities ?? []} center={[50.11, 9.18]} zoom={4} />
            </Suspense>
          )}
        </div>
      ) : showSkeleton ? (
        <CityListSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : cities.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <CityCard key={c.id} city={c} />
            ))}
          </div>
          {!loadAll && data && (
            <Pagination
              page={page}
              count={data.count}
              pageSize={pageSize}
              hasNext={Boolean(data.next)}
              hasPrevious={Boolean(data.previous)}
              onPageChange={(p) => patch({ page: p > 1 ? String(p) : null })}
            />
          )}
        </>
      )}
    </div>
  );
}