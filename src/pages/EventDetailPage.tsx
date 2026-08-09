import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { useEvent } from "@/hooks/useEvents";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/common/ErrorState";
import { formatEventDate, formatRelative, venueLabel } from "@/lib/formatters";
import { formatDistance } from "@/lib/geo";
import type { Event } from "@/api/types";

// Defer Leaflet until the map is rendered.
const EventMap = lazy(() => import("@/components/map/EventMap"));

function Provenance({ event }: { event: Event }) {
  if (!event.original_url && !event.source && !event.promoted_from) return null;
  return (
    <Card className="p-4">
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Provenance
      </h2>
      <dl className="mt-2 space-y-1 text-sm">
        {event.original_url && (
          <div>
            <dt className="inline text-slate-400">Originally seen at: </dt>
            <dd className="inline">
              <a
                href={event.original_url}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {event.original_platform || "link"}
              </a>
            </dd>
          </div>
        )}
        {event.source && (
          <div>
            <dt className="inline text-slate-400">Source: </dt>
            <dd className="inline">
              {event.source.platform || "—"} · {event.source.url}
            </dd>
          </div>
        )}
        {event.promoted_from && (
          <div>
            <dt className="inline text-slate-400">Promoted from observation: </dt>
            <dd className="inline">
              #{event.promoted_from.id} ({event.promoted_from.status})
            </dd>
          </div>
        )}
      </dl>
    </Card>
  );
}

export function EventDetailPage() {
  const { id } = useParams();
  const eventId = id ? Number(id) : null;
  const { data: event, isLoading, isError, refetch } = useEvent(eventId);

  if (isLoading)
    return <p className="text-sm text-slate-400">Loading event…</p>;
  if (isError || !event)
    return (
      <ErrorState
        title="Event not found"
        message="This event may not exist, may be a draft, or the API is unreachable."
        onRetry={() => refetch()}
      />
    );

  const hasLocation = event.latitude != null && event.longitude != null;

  return (
    <div className="space-y-4">
      <Link to="/events" className="text-sm text-slate-500 hover:underline">
        ← Back to events
      </Link>

      <img
        src={event.hero_image ?? "/placeholder-hero.svg"}
        alt={event.title}
        className="h-56 w-full rounded-lg object-cover sm:h-72"
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{event.title}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            {formatEventDate(event.starts_at)}{" "}
            <span className="text-slate-400">
              ({formatRelative(event.starts_at)})
            </span>
            {event.ends_at && (
              <> — ends {formatEventDate(event.ends_at)}</>
            )}
          </p>
        </div>
        {event.distance != null && (
          <Badge>{formatDistance(event.distance)} away</Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge>{event.event_type}</Badge>
        <Badge>{event.attendance_mode}</Badge>
        <Badge variant="outline">{event.status}</Badge>
        {event.capacity != null && (
          <Badge variant="outline">capacity {event.capacity}</Badge>
        )}
        {event.categories.map((c) => (
          <Badge key={c.id} variant="outline">
            {c.name}
          </Badge>
        ))}
      </div>

      {event.description && (
        <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-200">
          {event.description}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Venue
          </h2>
          {event.venue ? (
            <dl className="mt-2 space-y-1 text-sm">
              <div>{event.venue.name}</div>
              <div className="text-slate-500 dark:text-slate-400">
                {venueLabel([event.venue.address, event.venue.city])}
              </div>
              <div className="font-mono text-xs text-slate-400">
                {event.venue.latitude?.toFixed(4)}, {event.venue.longitude?.toFixed(4)}
              </div>
              {event.venue.capacity != null && (
                <div className="text-slate-400">capacity {event.venue.capacity}</div>
              )}
            </dl>
          ) : (
            <p className="mt-2 text-sm text-slate-400">
              No physical venue (online event).
            </p>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Organization
          </h2>
          {event.organization ? (
            <div className="mt-2 space-y-1 text-sm">
              <Link
                to={`/organizations/${event.organization.slug}`}
                className="font-medium hover:underline"
              >
                {event.organization.name}
              </Link>
              {event.organization.description && (
                <p className="text-slate-500 dark:text-slate-400">
                  {event.organization.description}
                </p>
              )}
              {event.organization.website && (
                <a
                  href={event.organization.website}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs underline"
                >
                  {event.organization.website}
                </a>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No organization.</p>
          )}
        </Card>
      </div>

      <Provenance event={event} />

      {hasLocation && (
        <div className="h-64 overflow-hidden rounded-lg">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Loading map…
              </div>
            }
          >
            <EventMap
              events={[event]}
              center={[event.latitude as number, event.longitude as number]}
              zoom={13}
            />
          </Suspense>
        </div>
      )}

      <Card className="p-4 text-xs text-slate-400">
        <p>
          Published {event.published_at ? formatRelative(event.published_at) : "—"}
          {" · "}created {formatRelative(event.created_at)}
          {" · "}updated {formatRelative(event.updated_at)}
        </p>
      </Card>
    </div>
  );
}