import { getMaterialsAction } from "@/actions/materials";

export const materialsService = {
  async getAll() {
    return getMaterialsAction();
  },
};
