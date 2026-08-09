import { Link, useParams, useSearchParams } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganizations";
import { useOrganizationEvents } from "@/hooks/useEvents";
import type { EventsQuery } from "@/api/events";
import { EventList } from "@/components/events/EventList";
import { Pagination } from "@/components/common/Pagination";
import { ErrorState } from "@/components/common/ErrorState";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";

export function OrganizationDetailPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("page_size") ?? String(DEFAULT_PAGE_SIZE));

  const { data: org, isLoading: orgLoading } = useOrganization(slug ?? null);
  const eventsQuery: EventsQuery = { page, page_size: pageSize };
  const { data: eventsData, isLoading, isError, refetch } = useOrganizationEvents(
    slug ?? null,
    eventsQuery,
  );

  const patch = (p: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(p)) {
      if (!v) next.delete(k);
      else next.set(k, v);
    }
    setParams(next);
  };

  if (orgLoading) return <p className="text-sm text-slate-400">Loading…</p>;
  if (!org)
    return <ErrorState title="Organization not found" message="Check the slug or API URL." />;

  return (
    <div className="space-y-4">
      <Link to="/organizations" className="text-sm text-slate-500 hover:underline">
        ← Back to organizations
      </Link>
      <div>
        <h1 className="text-2xl font-semibold">{org.name}</h1>
        {org.description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {org.description}
          </p>
        )}
        {org.website && (
          <a
            href={org.website}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-sm underline text-slate-400"
          >
            {org.website}
          </a>
        )}
      </div>

      <h2 className="text-lg font-semibold">Published events</h2>
      <EventList
        events={eventsData?.results}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />
      {eventsData && (
        <Pagination
          page={page}
          count={eventsData.count}
          pageSize={pageSize}
          hasNext={Boolean(eventsData.next)}
          hasPrevious={Boolean(eventsData.previous)}
          onPageChange={(p) => patch({ page: p > 1 ? String(p) : null })}
        />
      )}
    </div>
  );
}