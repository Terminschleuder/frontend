import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  count: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

/** Prev / Next pagination driven by the backend's `count`/`next`/`previous`. */
export function Pagination({
  page,
  count,
  pageSize,
  hasNext,
  hasPrevious,
  onPageChange,
}: PaginationProps) {
  const from = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm text-slate-600 dark:text-slate-300">
      <span>
        Showing <strong>{from}</strong>–<strong>{to}</strong> of{" "}
        <strong>{count}</strong> · page {page}/{totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious}
          onClick={() => onPageChange(page - 1)}
        >
          ← Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}