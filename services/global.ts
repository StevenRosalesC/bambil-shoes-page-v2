import { getGlobalInfoAction } from "@/actions/global";

export const globalService = {
  async get() {
    return getGlobalInfoAction();
  },
};
