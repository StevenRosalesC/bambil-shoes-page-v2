"use server";

import { strapi } from "@strapi/client";
import { Product, ProductVariant, PaginatedResponse, QueryParams } from "@/types";

const client = strapi({
  baseURL: process.env.STRAPI_API_URL || "http://localhost:1337/api",
});

const DEFAULT_PRODUCT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD_dNoiXnJaWGkaO5zFoLW99yActG5gx032RgLySpxypzs3oiMQiOFy4j6EPfnhz-BOp7prPWR3rYM5px5zQuLjxOMP-3ZZ00wQTdlHLSkM83oDo1GQ3YL5sPOtrbOMCSKIgQV0N_I7EIwyYnVlMkURM6f26knM89Yp_h1dIwHpCulSoWVgBFTgEBma9FCwdTsnBylUDsa4UiDtflyhe_kySFb7iIDmoJ6Ca8BWvO4z6jEm8be0JrLhmroyjW0Y5cD_onFUquGih9pm";

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

interface StrapiProductRaw {
  id?: number;
  documentId?: string;
  name?: string;
  slug?: string;
  sku?: string;
  description?: unknown;
  price?: number;
  compareAtPrice?: number | null;
  material?: string;
  insoleMaterial?: string;
  heelHeight?: string;
  closureType?: string;
  color?: string;
  gender?: string;
  careInstructions?: unknown;
  featured?: boolean;
  isNew?: boolean;
  images?: Array<{ url?: string; alternativeText?: string }> | null;
  category?: {
    id?: number;
    documentId?: string;
    name?: string;
    slug?: string;
    description?: unknown;
  } | null;
  variants?: Array<{ id?: number | string; size?: string; stock?: number }> | null;
  createdAt?: string;
  updatedAt?: string;
}

function mapStrapiProduct(item: StrapiProductRaw): Product {
  const documentId = item.documentId || String(item.id || "");
  const images =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
          .map((img) => resolveMediaUrl(img?.url))
          .filter((url): url is string => Boolean(url))
      : [DEFAULT_PRODUCT_IMAGE];

  const variants: ProductVariant[] =
    Array.isArray(item.variants) && item.variants.length > 0
      ? item.variants.map((v) => ({
          id: v.id !== undefined ? String(v.id) : undefined,
          size: String(v.size || ""),
          stock: typeof v.stock === "number" ? v.stock : 0,
          productId: documentId,
        }))
      : [
          { id: `${documentId}-36`, size: "36", stock: 5, productId: documentId },
          { id: `${documentId}-37`, size: "37", stock: 10, productId: documentId },
          { id: `${documentId}-38`, size: "38", stock: 8, productId: documentId },
          { id: `${documentId}-39`, size: "39", stock: 4, productId: documentId },
        ];

  const category = item.category
    ? {
        id: item.category.documentId || String(item.category.id || ""),
        documentId: item.category.documentId,
        name: item.category.name || "",
        slug: item.category.slug,
        description: extractTextFromBlocks(item.category.description),
      }
    : undefined;

  return {
    id: documentId,
    documentId,
    name: item.name || "Producto Bambil",
    slug: item.slug,
    sku: item.sku,
    description: extractTextFromBlocks(item.description),
    material: item.material || "Cuero Genuino",
    insoleMaterial: item.insoleMaterial,
    heelHeight: item.heelHeight,
    closureType: item.closureType,
    color: item.color,
    gender: item.gender,
    careInstructions: extractTextFromBlocks(item.careInstructions),
    price: typeof item.price === "number" ? item.price : Number(item.price || 0),
    compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
    categoryId: category?.id,
    images: images.length > 0 ? images : [DEFAULT_PRODUCT_IMAGE],
    featured: Boolean(item.featured),
    isNew: Boolean(item.isNew),
    category,
    variants,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Sandalia Roma",
    description:
      "Sandalia artesanal elaborada en cuero natural de grano completo. Cuenta con hebillas regulables de latón y una suela duradera de caucho vulcanizado, uniendo ligereza y sofisticación.",
    material: "Cuero Natural",
    price: 45.99,
    categoryId: "cat-dama",
    featured: true,
    isNew: true,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_dNoiXnJaWGkaO5zFoLW99yActG5gx032RgLySpxypzs3oiMQiOFy4j6EPfnhz-BOp7prPWR3rYM5px5zQuLjxOMP-3ZZ00wQTdlHLSkM83oDo1GQ3YL5sPOtrbOMCSKIgQV0N_I7EIwyYnVlMkURM6f26knM89Yp_h1dIwHpCulSoWVgBFTgEBma9FCwdTsnBylUDsa4UiDtflyhe_kySFb7iIDmoJ6Ca8BWvO4z6jEm8be0JrLhmroyjW0Y5cD_onFUquGih9pm",
    ],
    variants: [
      { id: "v1-1", size: "36", stock: 5, productId: "prod-1" },
      { id: "v1-2", size: "37", stock: 12, productId: "prod-1" },
      { id: "v1-3", size: "38", stock: 15, productId: "prod-1" },
      { id: "v1-4", size: "39", stock: 8, productId: "prod-1" },
    ],
  },
  {
    id: "prod-2",
    name: "Mocasín Premium",
    description:
      "Zapato estilo mocasín clásico confeccionado con el cuero más suave seleccionado a mano. Presenta costuras visibles de gran calibre hechas a mano que rinden homenaje a la zapatería tradicional.",
    material: "Cuero de Grano Completo",
    price: 65.0,
    categoryId: "cat-dama",
    featured: true,
    isNew: false,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDld1nZmZMeLJoEMfC-E4ZNnnpZZBzoU6_2uuLt4SLGV5tjsqqJbzSZtXM6uhyqDT63V-nHEF5L67CtlPBnPxpQzV1TUFcED2laNZTvmUMBXXxA1d07ddouL311cqqE_835yX-kkhz85mMrG37V5PDgT1TKYvulyZcqI2IBK088uOBZQ4u3XqRfbSloiEvPl1H7x8r6oA_lRxlPcWpQO-9_w_z4xzDJhIXm9fw3jRatVjoB6V6VNfOgYzAl0BRL2qtQYHQeefNCm2JD",
    ],
    variants: [
      { id: "v2-1", size: "35", stock: 4, productId: "prod-2" },
      { id: "v2-2", size: "36", stock: 8, productId: "prod-2" },
      { id: "v2-3", size: "37", stock: 10, productId: "prod-2" },
      { id: "v2-4", size: "38", stock: 6, productId: "prod-2" },
    ],
  },
  {
    id: "prod-3",
    name: "Bota Gaucho",
    description:
      "Bota de cuero vacuno rústico de alta resistencia, tratada con aceites naturales para una protección óptima contra la intemperie. Perfecta para caminatas exigentes o un estilo urbano aventurero.",
    material: "Cuero Vacuno Rústico",
    price: 89.99,
    categoryId: "cat-caballeros",
    featured: false,
    isNew: false,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZOAPmfcKFNh_YzHcjZaGNfPxBAhT-jE8SYJaIyYrBhGOuVnjPLeir0jkTam6pon8ov_pDA1MsUjmi6gcLhlHLz28PBUKmVmrm3ca2dEVOPVn4REHwmUWdjp6Ul5RnEgoAi_y_oey-hzhmqiaGK98A584uBVLgoEFLVPV_F9TOpbrxH6wHhtUfHOCQTHwajnAyjcxkWkj2tzb_YBhtZZaUucFntx0OW2i7rtm44ogIdeuqRuuvqMbSEAIVVWcf7gmmrLmDhZVttjTP",
    ],
    variants: [
      { id: "v3-1", size: "40", stock: 6, productId: "prod-3" },
      { id: "v3-2", size: "41", stock: 14, productId: "prod-3" },
      { id: "v3-3", size: "42", stock: 20, productId: "prod-3" },
      { id: "v3-4", size: "43", stock: 10, productId: "prod-3" },
    ],
  },
  {
    id: "prod-4",
    name: "Zapato Oxford Imperial",
    description:
      "Calzado de vestir formal en cuero genuino lustrado con acabado espejo. Su horma clásica y forro interno de piel suave garantizan comodidad excepcional y una elegancia insuperable.",
    material: "Cuero Genuino Lustrado",
    price: 110.0,
    categoryId: "cat-caballeros",
    featured: true,
    isNew: true,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYRFsO5B-XXb79hfYOuCi8sG12jcf5SUYGeLeYC52wKnIwqZcvd_9zk2YC-Ky_UH0BmPnDLINu_BZ_H-XxHcWX2k-naDkp4JX7JgK1i6Gn1c5a3EapJxDatZhCr-sYItzQzD7nfnbV8CRoJZm54bnhbEOdz5sMl18dr8b5Xjuq4WgXgU98ACC7zRd1-TEE6U6jyg6oSMQzeylGINWM2sWWjDn61hn5SgVXhA0UOKwFHrfelE5raQuSJlObeUWonby7q4KIyY0kO271",
    ],
    variants: [
      { id: "v4-1", size: "39", stock: 3, productId: "prod-4" },
      { id: "v4-2", size: "40", stock: 8, productId: "prod-4" },
      { id: "v4-3", size: "41", stock: 12, productId: "prod-4" },
      { id: "v4-4", size: "42", stock: 10, productId: "prod-4" },
    ],
  },
];

/**
 * Option B:
 * 1. Query products where featured == true, sorted by createdAt:desc.
 * 2. If none found, fallback to latest products sorted by createdAt:desc.
 * 3. If database has no products at all, return empty array [].
 */
export async function getFeaturedProductsAction(
  limit: number = 6
): Promise<Product[]> {
  try {
    // Step 1: Featured products
    const featuredRes = await client.collection("products").find({
      populate: ["images", "category", "variants"],
      filters: { featured: { $eq: true } },
      sort: ["createdAt:desc"],
      pagination: {
        page: 1,
        pageSize: limit,
      },
    });

    if (
      featuredRes?.data &&
      Array.isArray(featuredRes.data) &&
      featuredRes.data.length > 0
    ) {
      return (featuredRes.data as StrapiProductRaw[]).map(mapStrapiProduct);
    }

    // Step 2: Fallback to most recent products
    const fallbackRes = await client.collection("products").find({
      populate: ["images", "category", "variants"],
      sort: ["createdAt:desc"],
      pagination: {
        page: 1,
        pageSize: limit,
      },
    });

    if (
      fallbackRes?.data &&
      Array.isArray(fallbackRes.data) &&
      fallbackRes.data.length > 0
    ) {
      return (fallbackRes.data as StrapiProductRaw[]).map(mapStrapiProduct);
    }

    // Step 3: Catalog is completely empty
    return [];
  } catch (error) {
    console.warn("Featured products Strapi fetch failed, using fallback mocks:", error);
    const mockFeatured = MOCK_PRODUCTS.filter((p) => p.featured);
    return mockFeatured.length > 0
      ? mockFeatured.slice(0, limit)
      : MOCK_PRODUCTS.slice(0, limit);
  }
}

export async function getProductsAction(
  params: QueryParams = {}
): Promise<PaginatedResponse<Product>> {
  try {
    const filters: Record<string, unknown> = {};

    if (params.search) {
      filters.$or = [
        { name: { $containsi: params.search } },
        { material: { $containsi: params.search } },
      ];
    }

    if (params.filterBy && params.filterValue) {
      if (params.filterBy === "categoryId") {
        filters.category = {
          $or: [
            { documentId: { $eq: params.filterValue } },
            { slug: { $eq: params.filterValue } },
          ],
        };
      } else {
        filters[params.filterBy] = {
          $eq: params.filterValue,
        };
      }
    }

    let sort: string[] = ["createdAt:desc"];
    if (params.sortBy) {
      const order = params.sortOrder === "ASC" ? "asc" : "desc";
      sort = [`${params.sortBy}:${order}`];
    }

    const page = params.page || 1;
    const pageSize = params.limit || 25;

    const response = await client.collection("products").find({
      populate: ["images", "category", "variants"],
      filters,
      sort,
      pagination: {
        page,
        pageSize,
      },
    });

    if (response?.data && Array.isArray(response.data)) {
      const mapped = (response.data as StrapiProductRaw[]).map(mapStrapiProduct);
      const total =
        (response.meta as { pagination?: { total?: number } })?.pagination
          ?.total ?? mapped.length;
      const totalPages =
        (response.meta as { pagination?: { pageCount?: number } })?.pagination
          ?.pageCount ?? Math.ceil(total / pageSize);

      return {
        data: mapped,
        total,
        page,
        limit: pageSize,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
      };
    }

    return {
      data: [],
      total: 0,
      page,
      limit: pageSize,
      totalPages: 0,
      nextPage: null,
    };
  } catch (error) {
    console.warn("Products Server Action failed, using mock fallback data:", error);

    let filteredProducts = [...MOCK_PRODUCTS];

    if (params.filterBy === "categoryId" && params.filterValue) {
      filteredProducts = filteredProducts.filter(
        (p) => p.categoryId === params.filterValue
      );
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.material.toLowerCase().includes(searchLower)
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedMock = filteredProducts.slice(startIndex, startIndex + limit);

    return {
      data: paginatedMock,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
      nextPage: page * limit < filteredProducts.length ? page + 1 : null,
    };
  }
}

export async function getProductByIdAction(id: string): Promise<Product> {
  try {
    const response = await client.collection("products").find({
      populate: ["images", "category", "variants"],
      filters: {
        $or: [{ documentId: { $eq: id } }, { slug: { $eq: id } }],
      },
      pagination: { pageSize: 1 },
    });

    if (
      response?.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      return mapStrapiProduct(response.data[0] as StrapiProductRaw);
    }

    throw new Error(`Product with ID/slug ${id} not found in Strapi`);
  } catch (error) {
    console.warn(`Product by ID (${id}) server action failed, search in mock:`, error);
    const product = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }
}
