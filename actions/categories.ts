"use server";

import { fetchServer } from "@/lib/api-client";
import { Category, PaginatedResponse, QueryParams } from "@/types";

const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-dama",
    name: "Dama",
    description: "Colección exclusiva de calzado artesanal para dama, uniendo elegancia y confort.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCXUzgqTz-0eWXQt6slX0oZAWoCcp5wl2sZlm7cX95x7NeBr4CZKGqDcaRsHfzYMxQn0AFQU1hJMT5KxvHGubLbpdmxw0OGVWEhkM5ygcZhgqx64nXRp5ZAbw-03tFvwtMr0ikaX-pVBrUHP02aPIHNFRTTOzVZjk3kYhxz2sKZdojM2gLMlaWaKHPd81ymUaUaZxozyrw7v_G0R--Ia_1X9DbpijXC1LwoSEE3kBxcIfOGEVuGsffj0hO3k1imoGF38LZzsXMlHFE",
  },
  {
    id: "cat-caballeros",
    name: "Caballeros",
    description: "Diseños clásicos y robustos confeccionados a mano para el hombre moderno.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYRFsO5B-XXb79hfYOuCi8sG12jcf5SUYGeLeYC52wKnIwqZcvd_9zk2YC-Ky_UH0BmPnDLINu_BZ_H-XxHcWX2k-naDkp4JX7JgK1i6Gn1c5a3EapJxDatZhCr-sYItzQzD7nfnbV8CRoJZm54bnhbEOdz5sMl18dr8b5Xjuq4WgXgU98ACC7zRd1-TEE6U6jyg6oSMQzeylGINWM2sWWjDn61hn5SgVXhA0UOKwFHrfelE5raQuSJlObeUWonby7q4KIyY0kO271",
  },
  {
    id: "cat-ninos",
    name: "Niños",
    description: "Calzado duradero y flexible que acompaña cada aventura de los más pequeños.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0Hr4w2hgFTmCC40-cRLJ3l3NmfQMoWC3Oy4Dx8QxUyGkx7lAmgAxSxe4Kij8YR7yRdLJ4uIRHUDYBQr7L4Bh-RvZX7XjjGjY09GyABrwllxXjXZdV23o-5dBWhLfQb6AQHL2Dtz0aT723g8tWNRRAgcrWOJDTtJzgh4xBUgWsygwdIcTQV6wwzvpSSXt5p-1PeYgPaLv8f2ezweJHwxnI-gSiDZYCAH0S_waG_gpiQfiHapAin-hUsMbb2octpgNcNDS5m0dxCSNh",
  },
];

export async function getCategoriesAction(
  params: QueryParams = {}
): Promise<PaginatedResponse<Category>> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append("page", String(params.page));
  if (params.limit !== undefined) query.append("limit", String(params.limit));
  if (params.search !== undefined) query.append("search", params.search);
  if (params.filterBy !== undefined) query.append("filterBy", params.filterBy);
  if (params.filterValue !== undefined) query.append("filterValue", params.filterValue);
  if (params.sortBy !== undefined) query.append("sortBy", params.sortBy);
  if (params.sortOrder !== undefined) query.append("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const path = `/categories${queryString ? `?${queryString}` : ""}`;

  try {
    return await fetchServer<PaginatedResponse<Category>>(path, {
      method: "GET",
    });
  } catch (error) {
    console.warn("Categories Server Action failed, using mock fallback data:", error);
    
    // Simulate pagination for mock data
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
