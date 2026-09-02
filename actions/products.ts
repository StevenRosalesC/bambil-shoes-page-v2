"use server";

import { fetchServer } from "@/lib/api-client";
import { Product, PaginatedResponse, QueryParams } from "@/types";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Sandalia Roma",
    description: "Sandalia artesanal elaborada en cuero natural de grano completo. Cuenta con hebillas regulables de latón y una suela duradera de caucho vulcanizado, uniendo ligereza y sofisticación.",
    material: "Cuero Natural",
    price: 45.99,
    categoryId: "cat-dama",
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
    description: "Zapato estilo mocasín clásico confeccionado con el cuero más suave seleccionado a mano. Presenta costuras visibles de gran calibre hechas a mano que rinden homenaje a la zapatería tradicional.",
    material: "Cuero de Grano Completo",
    price: 65.00,
    categoryId: "cat-dama",
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
    description: "Bota de cuero vacuno rústico de alta resistencia, tratada con aceites naturales para una protección óptima contra la intemperie. Perfecta para caminatas exigentes o un estilo urbano aventurero.",
    material: "Cuero Vacuno Rústico",
    price: 89.99,
    categoryId: "cat-caballeros",
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
    description: "Calzado de vestir formal en cuero genuino lustrado con acabado espejo. Su horma clásica y forro interno de piel suave garantizan comodidad excepcional y una elegancia insuperable.",
    material: "Cuero Genuino Lustrado",
    price: 110.00,
    categoryId: "cat-caballeros",
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

export async function getProductsAction(
  params: QueryParams = {}
): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append("page", String(params.page));
  if (params.limit !== undefined) query.append("limit", String(params.limit));
  if (params.search !== undefined) query.append("search", params.search);
  if (params.filterBy !== undefined) query.append("filterBy", params.filterBy);
  if (params.filterValue !== undefined) query.append("filterValue", params.filterValue);
  if (params.sortBy !== undefined) query.append("sortBy", params.sortBy);
  if (params.sortOrder !== undefined) query.append("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const path = `/products${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetchServer<PaginatedResponse<Product>>(path, {
      method: "GET",
    });
    if (response && response.data) {
      response.data = response.data.map((product) => ({
        ...product,
        price: Number(product.price),
      }));
    }
    return response;
  } catch (error) {
    console.warn("Products Server Action failed, using mock fallback data:", error);
    
    // Simulate query parameters on mock data
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
    const product = await fetchServer<Product>(`/products/${id}`, {
      method: "GET",
    });
    return {
      ...product,
      price: Number(product.price),
    };
  } catch (error) {
    console.warn(`Product by ID (${id}) server action failed, search in mock:`, error);
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }
}
