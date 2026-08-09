import { Link, useSearchParams } from "react-router-dom";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";

export function OrganizationsPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("page_size") ?? String(DEFAULT_PAGE_SIZE));

  const { data, isLoading, isError, refetch } = useOrganizations({
    search,
    ordering: "name",
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

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Organizations</h1>
      <Input
        type="search"
        placeholder="Search organizations"
        value={search}
        onChange={(e) => patch({ search: e.target.value, page: null })}
        className="max-w-sm"
      />
      {isLoading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.results.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.results.map((o) => (
              <Link key={o.id} to={`/organizations/${o.slug}`}>
                <Card className="h-full p-4 transition-shadow hover:shadow-md">
                  <h3 className="font-semibold">{o.name}</h3>
                  {o.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {o.description}
                    </p>
                  )}
                  {o.website && (
                    <span className="mt-2 block text-xs underline text-slate-400">
                      {o.website}
                    </span>
                  )}
                </Card>
              </Link>
            ))}
          </div>
          <Pagination
            page={page}
            count={data.count}
            pageSize={pageSize}
            hasNext={Boolean(data.next)}
            hasPrevious={Boolean(data.previous)}
            onPageChange={(p) => patch({ page: p > 1 ? String(p) : null })}
          />
        </>
      )}
    </div>
  );
}