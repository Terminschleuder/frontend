import type { ApiClient, QueryParams } from "./client";
import { CategoryListSchema } from "./schemas";
import type { Category, Paginated } from "./types";

export interface CategoriesQuery extends QueryParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export function fetchCategories(
  client: ApiClient,
  query: CategoriesQuery,
  signal?: AbortSignal,
): Promise<Paginated<Category>> {
  return client
    .get<Paginated<Category>>("/api/categories/", query, { signal })
    .then((data) => CategoryListSchema.parse(data) as Paginated<Category>);
}