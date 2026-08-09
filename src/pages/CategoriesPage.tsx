import { useCategories } from "@/hooks/useCategories";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/common/ErrorState";

export function CategoriesPage() {
  const { data, isLoading, isError, refetch } = useCategories({ page_size: 100 });

  if (isLoading) return <p className="text-sm text-slate-400">Loading…</p>;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const cats = data?.results ?? [];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Categories</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((c) => (
          <Card key={c.id} className="flex items-center justify-between p-4">
            <span className="font-medium">{c.name}</span>
            <Badge variant="outline">{c.slug}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}