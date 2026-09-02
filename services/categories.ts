import { getCategoriesAction } from "@/actions/categories";
import { QueryParams } from "@/types";

export const categoriesService = {
  async getAll(params: QueryParams = {}) {
    return getCategoriesAction(params);
  },
};
