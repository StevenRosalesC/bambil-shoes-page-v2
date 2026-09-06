"use server";

import { strapi } from "@strapi/client";
import { AboutPageData } from "@/types/AboutPage";

const client = strapi({
  baseURL: process.env.STRAPI_API_URL || "http://localhost:1337/api",
});

const MOCK_ABOUT_PAGE: AboutPageData = {
  heroTitle: "Artesanía & Tradición",
  heroSubtitle: "Desde Bambil Collao para todo el Ecuador",
  heroBanner: {
    url: "/images/hero.jpeg",
    alternativeText: "Taller artesanal Bambil Shoes",
  },
  mission:
    "Crear calzado artesanal de alta durabilidad y diseño auténtico, honrando la tradición marroquinera ecuatoriana mientras impulsamos el desarrollo de nuestra comunidad artesanal en Colonche.",
  vision:
    "Ser reconocidos como el taller artesanal referente de calzado en Ecuador, destacándonos por la calidad insuperable de nuestros materiales, la atención al detalle y el compromiso con el oficio tradicional.",
  founderPhoto: {
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1X40jL5i224B_49Vqj8b8pS3jSjWzPvZ8bZ3y0m7vT3z6-X6t_m6Kx6Z7x_m5Q_M8=s1000",
    alternativeText: "Darío Catuto, maestro zapatero",
  },
  corporateValues: [
    {
      title: "Honestidad",
      description: "Ser recto y veraz en todo acto.",
      icon: "verified",
    },
    {
      title: "Compromiso asociativo y empresarial",
      description:
        "Sincronizar objetivos personales con las metas organizacionales.",
      icon: "handshake",
    },
    {
      title: "Lealtad",
      description:
        "Actitud de profundo compromiso de una persona a una organización.",
      icon: "loyalty",
    },
    {
      title: "Responsabilidad social y empresarial",
      description: "Asumir y aceptar las consecuencias.",
      icon: "volunteer_activism",
    },
    {
      title: "Trabajo en equipo",
      description:
        "Mantener los objetivos comunes, tareas definidas, procesos claros y una buena relación que lleven a un alto grado de cooperación y buenos resultados a la organización.",
      icon: "groups",
    },
  ],
  manufacturingSteps: [
    {
      stepNumber: 1,
      title: "1. Corte Preciso",
      description:
        "Seleccionamos las mejores partes de cada piel, asegurando que la flor del material sea impecable antes de realizar el primer corte manual.",
      image: {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmMCSqNiGaJello7QedMQ74f8guO8HMVhPj0XQEUQ1rbFKWRfFqfGXdQSuaX3b_BWNYgo-oAoInmTqdbI70gWZFy11aj7KbYqycqc9CdJoh0P45GTqu5Vui8yIAdFEZYfLIUlRRvuDtGTRokIaQmUHzFS_fVGP4hGiAPlssjotJrnwA6wpIDvnUoIg2rNHwI0RXav0yKbKRlNXQ-ZT1LMBSgcxiJnbKSVenWp0iH2QBe6DiWG7tNyEntAuY46tcR45q_aUKWGOWeWF",
      },
    },
    {
      stepNumber: 2,
      title: "2. Ensamblaje",
      description:
        "Unimos las piezas con hilos de alta resistencia, empleando técnicas de costura tradicionales que garantizan la durabilidad de por vida.",
      image: {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFyBlki9sLXWr-aa-gBDKrn_5WHBF4si9YeShOvkoEkg2BsdT-g08aPaxwoiP3EtFE99xAwerejHhMafK024H5vgnGUzIp6NwzHin05bQyIcOiihFa7tr4I5jP7xOJPkLh2_xQfoEWDBhIjpPzeWV3nJMWG8UGgYrVGggE8_FTz3gbZ5zfnnH8zmSq1sX88lkX7c9WBEeCwbR8tSWe7gfymngeHGFMs94K8xzlqsbMcEJj8nEforwqbAbfIH3PxlcfMzaTinw09agK",
      },
    },
    {
      stepNumber: 3,
      title: "3. Acabado Final",
      description:
        "El pulido manual con ceras naturales resalta la pátina única de cada zapato, otorgándole ese carácter distintivo y elegante de Bambil.",
      image: {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkZTCfoMYFYHnJNLtSaD1U_X5rYM6TQlsjay-y5tiQ5ZslI5V6R8MxutJ5PuKhQ21F8kM2l662srAUF3t92wpMCYLFL2WABDoyKUttPboSM45YB89EPAqdCV6vp_S9B9bfRxGYhAU9yMKzW1QPE54NQxzrIUkf01m0he-mNb3EOaDOWrsuODK01WgPfBc7hAaODZPrNj89fRnp_I3vikY6iDfWDatEQDQvlB42uPN-t8Hq6t3nB43bAtrqi-CAiKcz8lZ1XRZStwM3",
      },
    },
  ],
};

export async function getAboutPageAction(): Promise<AboutPageData | null> {
  try {
    const response = await client.single("about-page").find({
      populate: [
        "heroBanner",
        "founderPhoto",
        "corporateValues",
        "manufacturingSteps.image",
      ],
    });

    if (response?.data) {
      const data = response.data as unknown as AboutPageData;
      return {
        ...MOCK_ABOUT_PAGE,
        ...data,
      };
    }

    return MOCK_ABOUT_PAGE;
  } catch (error) {
    console.warn(
      "About Page Server Action failed or not published yet in Strapi. Using fallback mock:",
      error
    );
    return MOCK_ABOUT_PAGE;
  }
}

// Alias for convenience
export const getAboutPage = getAboutPageAction;
