import {
  getProductsAction,
  getProductByIdAction,
  getFeaturedProductsAction,
} from "@/actions/products";
import { QueryParams } from "@/types";

export const productsService = {
  async getAll(params: QueryParams = {}) {
    return getProductsAction(params);
  },

  async getById(id: string) {
    return getProductByIdAction(id);
  },

  async getFeatured(limit = 6) {
    return getFeaturedProductsAction(limit);
  },
};
