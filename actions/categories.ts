"use server";

import { strapiClient, getDraftStatus } from "@/lib/strapi";
import { Category, PaginatedResponse, QueryParams } from "@/types";

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  caballero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCYRFsO5B-XXb79hfYOuCi8sG12jcf5SUYGeLeYC52wKnIwqZcvd_9zk2YC-Ky_UH0BmPnDLINu_BZ_H-XxHcWX2k-naDkp4JX7JgK1i6Gn1c5a3EapJxDatZhCr-sYItzQzD7nfnbV8CRoJZm54bnhbEOdz5sMl18dr8b5Xjuq4WgXgU98ACC7zRd1-TEE6U6jyg6oSMQzeylGINWM2sWWjDn61hn5SgVXhA0UOKwFHrfelE5raQuSJlObeUWonby7q4KIyY0kO271",
  dama:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCXUzgqTz-0eWXQt6slX0oZAWoCcp5wl2sZlm7cX95x7NeBr4CZKGqDcaRsHfzYMxQn0AFQU1hJMT5KxvHGubLbpdmxw0OGVWEhkM5ygcZhgqx64nXRp5ZAbw-03tFvwtMr0ikaX-pVBrUHP02aPIHNFRTTOzVZjk3kYhxz2sKZdojM2gLMlaWaKHPd81ymUaUaZxozyrw7v_G0R--Ia_1X9DbpijXC1LwoSEE3kBxcIfOGEVuGsffj0hO3k1imoGF38LZzsXMlHFE",
  ninas:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA0Hr4w2hgFTmCC40-cRLJ3l3NmfQMoWC3Oy4Dx8QxUyGkx7lAmgAxSxe4Kij8YR7yRdLJ4uIRHUDYBQr7L4Bh-RvZX7XjjGjY09GyABrwllxXjXZdV23o-5dBWhLfQb6AQHL2Dtz0aT723g8tWNRRAgcrWOJDTtJzgh4xBUgWsygwdIcTQV6wwzvpSSXt5p-1PeYgPaLv8f2ezweJHwxnI-gSiDZYCAH0S_waG_gpiQfiHapAin-hUsMbb2octpgNcNDS5m0dxCSNh",
  ninos:
    "http://localhost:9000/bambil-shoes/Chat_GPT_Image_Aug4_2026_09_20_06_AM_24a1c8be79.webp",
};

const resolveMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/uploads")) {
    const strapiBase =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    return `${strapiBase}${url}`;
  }
  return url;
};

function extractTextFromBlocks(blocks: unknown): string {
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) => {
      if (b && Array.isArray(b.children)) {
        return b.children
          .map((c: { text?: string }) => c.text || "")
          .join("");
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-caballero",
    name: "Caballero",
    slug: "caballero",
    description:
      "Diseños clásicos y robustos confeccionados a mano para el hombre moderno.",
    image: DEFAULT_CATEGORY_IMAGES.caballero,
    displayOrder: 1,
  },
  {
    id: "cat-dama",
    name: "Dama",
    slug: "dama",
    description:
      "Colección exclusiva de calzado artesanal para dama, uniendo elegancia y confort.",
    image: DEFAULT_CATEGORY_IMAGES.dama,
    displayOrder: 2,
  },
  {
    id: "cat-ninas",
    name: "Niñas",
    slug: "ninas",
    description:
      "Calzado cómodo, seguro y con estilo para las más pequeñas.",
    image: DEFAULT_CATEGORY_IMAGES.ninas,
    displayOrder: 3,
  },
  {
    id: "cat-ninos",
    name: "Niños",
    slug: "ninos",
    description:
      "Calzado duradero y flexible que acompaña cada aventura de los más pequeños.",
    image: DEFAULT_CATEGORY_IMAGES.ninos,
    displayOrder: 4,
  },
];

export async function getCategoriesAction(
  params: QueryParams = {}
): Promise<PaginatedResponse<Category>> {
  try {
    const filters: Record<string, unknown> = {};

    if (params.search) {
      filters.name = {
        $containsi: params.search,
      };
    }

    if (params.filterBy && params.filterValue) {
      filters[params.filterBy] = {
        $eq: params.filterValue,
      };
    }

    let sort: string[] = ["displayOrder:asc"];
    if (params.sortBy) {
      const order = params.sortOrder === "DESC" ? "desc" : "asc";
      sort = [`${params.sortBy}:${order}`];
    }

    const status = await getDraftStatus();
    const response = await strapiClient.collection("categories").find({
      status,
      populate: ["image", "bannerImage"],
      filters,
      sort,
      pagination: {
        page: params.page || 1,
        pageSize: params.limit || 25,
      },
    });

    if (
      response?.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
interface StrapiCategoryRaw {
  id?: number;
  documentId?: string;
  name?: string;
  slug?: string;
  subtitle?: string;
  description?: unknown;
  image?: { url?: string; alternativeText?: string } | null;
  bannerImage?: { url?: string; alternativeText?: string } | null;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

      const mappedCategories: Category[] = (
        response.data as StrapiCategoryRaw[]
      ).map((item) => {
        const slug =
          item.slug ||
          item.name
            ?.toLowerCase()
            ?.normalize("NFD")
            ?.replace(/[\u0300-\u036f]/g, "") ||
          "";
        const fallback = DEFAULT_CATEGORY_IMAGES[slug] || "";
        const image = resolveMediaUrl(item.image?.url) || fallback;
        const bannerImage = resolveMediaUrl(item.bannerImage?.url) || image;
        const description =
          extractTextFromBlocks(item.description) || item.subtitle || "";

        return {
          id: item.documentId || String(item.id),
          documentId: item.documentId,
          name: item.name || "",
          slug: item.slug,
          subtitle: item.subtitle,
          description,
          image,
          bannerImage,
          displayOrder: item.displayOrder,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });

      const pagination = response.meta?.pagination;

      return {
        data: mappedCategories,
        total: pagination?.total || mappedCategories.length,
        page: pagination?.page || 1,
        limit: pagination?.pageSize || 25,
        totalPages: pagination?.pageCount || 1,
        nextPage:
          pagination && pagination.page < pagination.pageCount
            ? pagination.page + 1
            : null,
      };
    }

    return {
      data: MOCK_CATEGORIES,
      total: MOCK_CATEGORIES.length,
      page: 1,
      limit: 10,
      totalPages: 1,
      nextPage: null,
    };
  } catch (error) {
    console.warn(
      "Categories Server Action failed or not published yet in Strapi. Using fallback mock:",
      error
    );

    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedMock = MOCK_CATEGORIES.slice(startIndex, startIndex + limit);

    return {
      data: paginatedMock,
      total: MOCK_CATEGORIES.length,
      page,
      limit,
      totalPages: Math.ceil(MOCK_CATEGORIES.length / limit),
      nextPage: page * limit < MOCK_CATEGORIES.length ? page + 1 : null,
    };
  }
}

// Alias for convenience
export const getCategories = getCategoriesAction;

