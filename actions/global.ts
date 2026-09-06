"use server";

import { strapi } from "@strapi/client";
import { GlobalDataData } from "@/types/GlobalInfo";

const client = strapi({
  baseURL: process.env.STRAPI_API_URL || "http://localhost:1337/api",
});

const MOCK_GLOBAL_INFO: Partial<GlobalDataData> = {
  storeName: "Bambil Shoes By Dario",
  whatsappNumber: "573009998877",
  whatsappDefaultMessage: "¡Hola! Quisiera realizar una consulta sobre sus calzados.",
  announcementBanner: "Calzado Hecho a Mano • Santa Elena • Colonche",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  address: "Santa Elena, Parroquia Colonche - Comuna Bambil Collao",
  email: "bambilshoes@gmail.com",
  phone: "+593 99 383 3765",
  workingHours: "Lunes a Sábado: 9am - 7pm",
  googleMapsUrl: "https://maps.app.goo.gl/euKWMGExSx19FbjD6",
  latitude: -1.9599131,
  longitude: -80.6548942,
};

export async function getGlobalInfoAction(): Promise<GlobalDataData | null> {
  try {
    const response = await client.single("global").find({
      populate: ["logo", "favicon"],
    });

    if (response?.data) {
      const data = response.data as unknown as GlobalDataData;
      return data;
    }

    return MOCK_GLOBAL_INFO as GlobalDataData;
  } catch (error) {
    console.warn("Global Info Server Action failed or not published yet in Strapi. Using fallback mock:", error);
    return MOCK_GLOBAL_INFO as GlobalDataData;
  }
}

// Alias for convenience
export const getGlobalInfo = getGlobalInfoAction;
