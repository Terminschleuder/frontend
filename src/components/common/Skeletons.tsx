import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <Skeleton className="h-32 w-full rounded-md" />
      <Skeleton className="mt-3 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function EventListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CityCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <Skeleton className="mt-3 h-8 w-40" />
    </div>
  );
}

export function CityListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CityCardSkeleton key={i} />
      ))}
    </div>
  );
}