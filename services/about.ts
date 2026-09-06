import { getAboutPageAction } from "@/actions/about";

export const aboutService = {
  async get() {
    return getAboutPageAction();
  },
};
