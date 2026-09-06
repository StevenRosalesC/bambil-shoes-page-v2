"use server";

import { strapi } from "@strapi/client";
import { MaterialData } from "@/types/Material";

const client = strapi({
  baseURL: process.env.STRAPI_API_URL || "http://localhost:1337/api",
});

const MOCK_MATERIALS: MaterialData[] = [
  {
    name: "Cueros Naturales",
    icon: "verified",
    description:
      "Pátina que mejora con el tiempo. Nuestros cueros de grano completo ofrecen una transpirabilidad superior y se adaptan a la forma de tu pie, creando una experiencia verdaderamente personalizada.",
    textureImage: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG50EtqMj6Op2bKTOf6FDZ51JEboFi8YjD1xiTVf113FGapmgkUg3eAPB0OCWxpmgfimSYJABI3u07rvbBrMSOMTGoPZM5z4Ie8O6pQafoD1zgHoyTSZNCUny-Z4huNBDodL0g4b1w7R3S2WfNYN0WT7COy9ct_nYdw-K9QUtk8GmcSYQ1yCmmH3OpiWtz9Cp-fE0FsjJhfGO6pWJZEsetCzZIy6p63iS-aDX6X3PZt1XOBuL6LJFiQ6d7zK3393rfXFGlsRJE5vHj",
      alternativeText: "Textura de Cuero Natural",
    },
    benefits: [
      { text: "Mayor durabilidad" },
      { text: "Envejecimiento elegante" },
    ],
    displayOrder: 1,
  },
  {
    name: "Sintéticos Premium",
    icon: "eco",
    description:
      "Alternativas éticas sin comprometer la resistencia ni la textura sofisticada que caracteriza nuestro calzado.",
    textureImage: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgrhfEpVASo6ALK6_GZLr4qQsaW222zmPs6feQ_mS5sb0Sqva-PCmN79iifgrkZx8bPvD2rCIdIxfJM31XCV9VmIXSjLD2cI4dyUpQZH6op8YMcuL8tyeuvnRgYoJABZSvf4Kal6oWSxtYChsztzGnaTT5vDt2IQ66l5iWEE8MyvkOIscX5FYECI_WOROjfzS_CIBJgibHLsT2UB6RpYaGlKLdXCWjJzWaZcFNgy2EqlNz6-AjocyT3iWOc82e0TA_3JfH2yE4GU1l",
      alternativeText: "Textura Sintética Premium",
    },
    benefits: [
      { text: "Fácil mantenimiento" },
      { text: "Resistente a la humedad" },
    ],
    displayOrder: 2,
  },
];

export async function getMaterialsAction(): Promise<MaterialData[]> {
  try {
    const response = await client.collection("materials").find({
      populate: ["textureImage", "benefits"],
      sort: ["displayOrder:asc"],
    });

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data as unknown as MaterialData[];
    }

    return MOCK_MATERIALS;
  } catch (error) {
    console.warn(
      "Materials Server Action failed or not published yet in Strapi. Using fallback mock:",
      error
    );
    return MOCK_MATERIALS;
  }
}

// Alias for convenience
export const getMaterials = getMaterialsAction;
