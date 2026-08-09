import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Event } from "@/api/types";
import { formatEventDate, formatRelative, venueLabel } from "@/lib/formatters";
import { formatDistance } from "@/lib/geo";

export function EventCard({ event }: { event: Event }) {
  const where = venueLabel([event.venue?.name, event.venue?.city]);
  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      <img
        src={event.hero_image ?? "/placeholder-hero.svg"}
        alt={event.title}
        className="h-32 w-full object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">
            {/* Stretched link makes the whole card clickable without nesting
                an <a> around another <a> (invalid HTML). */}
            <Link to={`/events/${event.id}`} className="after:absolute after:inset-0">
              {event.title}
            </Link>
          </h3>
          {event.distance != null && (
            <Badge className="shrink-0">{formatDistance(event.distance)}</Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {formatEventDate(event.starts_at)}{" "}
          <span className="text-slate-400">({formatRelative(event.starts_at)})</span>
        </p>
        {where && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">📍 {where}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge>{event.event_type}</Badge>
          <Badge>{event.attendance_mode}</Badge>
          {event.organization && (
            <Link
              to={`/organizations/${event.organization.slug}`}
              className="relative z-10 inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 hover:underline dark:border-slate-700 dark:text-slate-300"
            >
              {event.organization.name}
            </Link>
          )}
          {event.categories.map((c) => (
            <Badge key={c.id} variant="outline">
              {c.name}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}