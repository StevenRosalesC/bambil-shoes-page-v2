import { getHomePageAction } from "@/actions/home";

export const homeService = {
  async get() {
    return getHomePageAction();
  },
};
