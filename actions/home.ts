"use server";

import { strapiClient, getDraftStatus } from "@/lib/strapi";
import { HomePageData } from "@/types/HomePage";

const MOCK_HOME_PAGE: HomePageData = {
  heroBadge: "Calzado Hecho a Mano • Santa Elena • Colonche",
  heroTitle: "Artesanía que se siente en cada paso",
  heroDescription:
    "Descubre la fusión perfecta entre la robustez del cuero natural y la elegancia del diseño a medida. Cada par cuenta una historia de dedicación, confort y maestría ecuatoriana.",
  heroImage: {
    url: "/images/hero.jpeg",
    alternativeText:
      "Maestro artesano Darío Catuto confeccionando calzado en su taller",
  },
  heroImageAlt:
    "Maestro artesano Darío Catuto confeccionando calzado en su taller",
  heroCaptionTitle: "Darío Catuto en el Taller",
  heroCaptionSubtitle: "Confección manual de cada par en Santa Elena",
};

export async function getHomePageAction(): Promise<HomePageData | null> {
  try {
    const status = await getDraftStatus();
    const response = await strapiClient.single("home-page").find({
      status,
      populate: ["heroImage", "seo.metaImage"],
    });

    if (response?.data) {
      const data = response.data as unknown as HomePageData;
      return {
        ...MOCK_HOME_PAGE,
        ...data,
      };
    }

    return MOCK_HOME_PAGE;
  } catch (error) {
    console.warn(
      "Home Page Server Action failed or not published yet in Strapi. Using fallback mock:",
      error
    );
    return MOCK_HOME_PAGE;
  }
}

// Alias for convenience
export const getHomePage = getHomePageAction;
