import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { useVenues } from "@/hooks/useVenues";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";

// Defer Leaflet until the map is rendered.
const VenueMap = lazy(() => import("@/components/map/VenueMap"));

export function VenuesPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const city = params.get("city") ?? "";
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("page_size") ?? String(DEFAULT_PAGE_SIZE));

  const { data, isLoading, isError, refetch } = useVenues({
    search,
    city,
    page,
    page_size: pageSize,
  });

  const patch = (p: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(p)) {
      if (!v) next.delete(k);
      else next.set(k, v);
    }
    setParams(next);
  };

  const venues = data?.results ?? [];
  const geoVenues = venues.filter((v) => v.latitude != null && v.longitude != null);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Venues</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          type="search"
          placeholder="Search venue name"
          value={search}
          onChange={(e) => patch({ search: e.target.value, page: null })}
        />
        <Input
          type="text"
          placeholder="Filter by city (exact)"
          value={city}
          onChange={(e) => patch({ city: e.target.value, page: null })}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : venues.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {venues.map((v) => (
                <Card key={v.id} className="p-3">
                  <h3 className="font-medium">{v.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {v.city}
                  </p>
                  {v.address && (
                    <p className="text-xs text-slate-400">{v.address}</p>
                  )}
                  <p className="mt-1 font-mono text-xs text-slate-400">
                    {v.latitude?.toFixed(3)}, {v.longitude?.toFixed(3)}
                    {v.capacity != null && ` · cap ${v.capacity}`}
                  </p>
                </Card>
              ))}
            </div>
            {geoVenues.length > 0 && (
              <div className="h-[420px] overflow-hidden rounded-lg">
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Loading map…
                    </div>
                  }
                >
                  <VenueMap venues={geoVenues} center={[50.11, 9.18]} zoom={4} />
                </Suspense>
              </div>
            )}
          </div>
          {data && (
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