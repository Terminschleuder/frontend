interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  message = "No results matched your filters. Try widening the search.",
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      <p className="font-medium text-slate-700 dark:text-slate-200">{title}</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}