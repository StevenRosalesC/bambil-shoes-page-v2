import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories";
import { QueryParams, PaginatedResponse, Category } from "@/types";

export function useCategories(
  params: QueryParams = {},
  options?: { initialData?: PaginatedResponse<Category> }
) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoriesService.getAll(params),
    ...options,
  });
}
