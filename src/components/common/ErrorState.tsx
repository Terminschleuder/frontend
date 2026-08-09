import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** A friendly error block with an optional retry button. */
export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this data. Check the API URL in Settings.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}