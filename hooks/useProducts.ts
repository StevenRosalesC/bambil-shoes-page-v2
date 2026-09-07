import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";
import { QueryParams, PaginatedResponse, Product } from "@/types";

export function useProducts(
  params: QueryParams = {},
  options?: { initialData?: PaginatedResponse<Product> }
) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.getAll(params),
    ...options,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
}
