import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";
import { QueryParams } from "@/types";

export function useProducts(params: QueryParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.getAll(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
}
