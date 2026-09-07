"use server";

import { strapiClient, getDraftStatus } from "@/lib/strapi";
import { SocialPostData } from "@/types/SocialPost";

const MOCK_SOCIAL_POSTS: SocialPostData[] = [
  {
    image: {
      url: "/images/instagramImages/01.jpg",
      alternativeText:
        "Una noche llena de elegancia, belleza y grandes momentos en el Miss Ecuador 2026",
    },
    alt: "Una noche llena de elegancia, belleza y grandes momentos en el Miss Ecuador 2026",
    url: "https://www.instagram.com/p/DcrZSz5G5O6",
    displayOrder: 1,
    isActive: true,
  },
  {
    image: {
      url: "/images/instagramImages/02.jpg",
      alternativeText: "Una noche para recordar",
    },
    alt: "Una noche para recordar",
    url: "https://www.instagram.com/p/DcrYf3hm5bH",
    displayOrder: 2,
    isActive: true,
  },
  {
    image: {
      url: "/images/instagramImages/03.jpg",
      alternativeText: "Los mejores diseños solo en Bambil Shoes",
    },
    alt: "Los mejores diseños solo en Bambil Shoes",
    url: "https://www.instagram.com/p/DZwD8c1NynY",
    displayOrder: 3,
    isActive: true,
  },
  {
    image: {
      url: "/images/instagramImages/04.jpg",
      alternativeText: "Dali Model y Asesora de Reina 👸 y Bambil Shoes",
    },
    alt: "Dali Model y Asesora de Reina 👸 y Bambil Shoes",
    url: "https://www.instagram.com/p/DZaQWL2yVTo",
    displayOrder: 4,
    isActive: true,
  },
];

export async function getSocialPostsAction(): Promise<SocialPostData[]> {
  try {
    const status = await getDraftStatus();
    const response = await strapiClient.collection("social-posts").find({
      status,
      populate: ["image"],
      filters: {
        isActive: {
          $eq: true,
        },
      },
      sort: ["displayOrder:asc"],
    });

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data as unknown as SocialPostData[];
    }

    return MOCK_SOCIAL_POSTS;
  } catch (error) {
    console.warn(
      "Social Posts Server Action failed or not published yet in Strapi. Using fallback mock:",
      error
    );
    return MOCK_SOCIAL_POSTS;
  }
}

// Alias for convenience
export const getSocialPosts = getSocialPostsAction;
