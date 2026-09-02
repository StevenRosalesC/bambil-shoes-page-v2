import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories";
import { QueryParams } from "@/types";

export function useCategories(params: QueryParams = {}) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoriesService.getAll(params),
  });
}
