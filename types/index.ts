export interface Category {
  id: string;
  documentId?: string;
  name: string;
  slug?: string;
  subtitle?: string;
  description: string;
  image?: string;
  bannerImage?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id?: string | number;
  size: string;
  stock: number;
  productId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductMaterial {
  id?: string | number;
  documentId?: string;
  name: string;
  slug?: string;
  description?: string;
}

export interface InsoleMaterial {
  id?: string | number;
  documentId?: string;
  name: string;
  slug?: string;
  description?: string;
}

export interface Product {
  id: string;
  documentId?: string;
  name: string;
  slug?: string;
  sku?: string;
  description: string;
  material?: ProductMaterial | null;
  insoleMaterial?: InsoleMaterial | null;
  heelHeight?: string;
  closureType?: string;
  color?: string;
  gender?: string;
  careInstructions?: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId?: string;
  images: string[];
  featured?: boolean;
  isNew?: boolean;
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

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
