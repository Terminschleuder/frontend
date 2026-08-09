import type { Event } from "@/api/types";
import { EventCard } from "./EventCard";
import { EventListSkeleton } from "@/components/common/Skeletons";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";

interface EventListProps {
  events: Event[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry?: () => void;
  skeletonCount?: number;
}

export function EventList({
  events,
  isLoading,
  isError,
  onRetry,
  skeletonCount = 6,
}: EventListProps) {
  if (isLoading) return <EventListSkeleton count={skeletonCount} />;
  if (isError)
    return (
      <ErrorState
        title="Couldn't load events"
        message="The API may be unreachable or misconfigured."
        onRetry={onRetry}
      />
    );
  if (!events || events.length === 0) return <EmptyState />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </div>
  );
}