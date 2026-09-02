export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  stock: number;
  productId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  material: string;
  price: number;
  categoryId: string;
  images: string[];
  category?: Category;
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  nextPage?: number | null;
  limit?: number;
  totalPages?: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filterBy?: string;
  filterValue?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC" | "";
}
