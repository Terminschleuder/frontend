import { useQuery } from "@tanstack/react-query";
import { fetchCategories, type CategoriesQuery } from "@/api/categories";
import { useApiClient } from "./useApiClient";

export function useCategories(query: CategoriesQuery = {}) {
  const { client, baseUrl } = useApiClient();
  return useQuery({
    queryKey: ["categories", baseUrl, query],
    queryFn: ({ signal }) => fetchCategories(client, query, signal),
  });
}