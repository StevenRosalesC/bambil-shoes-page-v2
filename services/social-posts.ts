import { getSocialPostsAction } from "@/actions/social-posts";

export const socialPostsService = {
  async getAll() {
    return getSocialPostsAction();
  },
};
