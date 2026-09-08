"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { Category, Product } from "@/types";

export interface CatalogGridProps {
  initialProducts?: Product[];
  initialCategories?: Category[];
}

export default function CatalogGrid({
  initialProducts,
  initialCategories,
}: CatalogGridProps = {}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { data: categoriesResponse } = useCategories(
    {},
    initialCategories
      ? {
          initialData: {
            data: initialCategories,
            total: initialCategories.length,
            page: 1,
            limit: 100,
            totalPages: 1,
            nextPage: null,
          },
        }
      : undefined
  );
  const { data: productsResponse, isLoading: isProductsLoading } = useProducts(
    { limit: 100 },
    initialProducts
      ? {
          initialData: {
            data: initialProducts,
            total: initialProducts.length,
            page: 1,
            limit: 100,
            totalPages: 1,
            nextPage: null,
          },
        }
      : undefined
  );

  const isLoading =
    isProductsLoading && (!initialProducts || initialProducts.length === 0);
  
  const { addItem } = useCartStore();
  const { setCartOpen } = useUIStore();

  // Helper to parse search params safely
  const parseParams = useCallback((params: URLSearchParams) => {
    const search = params.get("search") || "";
    const rawCategories = params.get("categories");
    const categories = rawCategories
      ? rawCategories.split(",").filter(Boolean)
      : params.get("category")
      ? [params.get("category")!]
      : [];
    const rawMaterials = params.get("materials");
    const materials = rawMaterials
      ? rawMaterials.split(",").filter(Boolean)
      : params.get("material")
      ? [params.get("material")!]
      : [];
    const price = params.get("price") ? Number(params.get("price")) : 300;
    const sort = params.get("sort") || "recommended";
    return { search, categories, materials, price, sort };
  }, []);

  const initialValues = useMemo(() => parseParams(searchParams), [searchParams, parseParams]);
  
  const [searchTerm, setSearchTerm] = useState(initialValues.search);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialValues.categories);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(initialValues.materials);
  const [priceRange, setPriceRange] = useState<number>(initialValues.price);
  const [sortBy, setSortBy] = useState(initialValues.sort);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const isInitializedRef = useRef(false);

  // Active filters count for modal and trigger button badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    count += selectedCategories.length;
    count += selectedMaterials.length;
    if (priceRange < 300) count++;
    return count;
  }, [searchTerm, selectedCategories.length, selectedMaterials.length, priceRange]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isFilterModalOpen || selectedProduct) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isFilterModalOpen, selectedProduct]);

  // Handle escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProduct) {
          setSelectedProduct(null);
        } else if (isFilterModalOpen) {
          setIsFilterModalOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFilterModalOpen, selectedProduct]);

  // Restore from sessionStorage if URL has no search params on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (searchParams.toString() === "" && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("bambil_catalog_filters");
        if (stored) {
          const parsed = JSON.parse(stored);
          queueMicrotask(() => {
            if (parsed.searchTerm) setSearchTerm(parsed.searchTerm);
            if (Array.isArray(parsed.selectedCategories) && parsed.selectedCategories.length > 0) {
              setSelectedCategories(parsed.selectedCategories);
            }
            if (Array.isArray(parsed.selectedMaterials) && parsed.selectedMaterials.length > 0) {
              setSelectedMaterials(parsed.selectedMaterials);
            }
            if (typeof parsed.priceRange === "number") setPriceRange(parsed.priceRange);
            if (parsed.sortBy) setSortBy(parsed.sortBy);
          });
        }
      } catch {
        // Ignore JSON parse error
      }
    }
  }, [searchParams]);

  // Sync state changes with URL query string and sessionStorage
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (selectedMaterials.length > 0) params.set("materials", selectedMaterials.join(","));
    if (priceRange < 300) params.set("price", priceRange.toString());
    if (sortBy !== "recommended") params.set("sort", sortBy);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newUrl);
      try {
        if (queryString) {
          sessionStorage.setItem(
            "bambil_catalog_filters",
            JSON.stringify({
              searchTerm,
              selectedCategories,
              selectedMaterials,
              priceRange,
              sortBy,
            })
          );
        } else {
          sessionStorage.removeItem("bambil_catalog_filters");
        }
      } catch {
        // Ignore storage errors
      }
    }
  }, [searchTerm, selectedCategories, selectedMaterials, priceRange, sortBy, pathname]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const parsed = parseParams(currentParams);
      setSearchTerm(parsed.search);
      setSelectedCategories(parsed.categories);
      setSelectedMaterials(parsed.materials);
      setPriceRange(parsed.price);
      setSortBy(parsed.sort);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [parseParams]);
  
  const categories = useMemo(() => categoriesResponse?.data || [], [categoriesResponse?.data]);
  const rawProducts = useMemo(() => productsResponse?.data || [], [productsResponse?.data]);

  // Extract all unique materials from products for checkboxes
  const allMaterials = useMemo(() => {
    const materialsSet = new Set<string>();
    rawProducts.forEach((p) => {
      if (p.material) {
        materialsSet.add(p.material);
      }
    });
    return Array.from(materialsSet);
  }, [rawProducts]);

  // Limit materials to 4 initially with "Ver más" expansion
  const visibleMaterials = useMemo(() => {
    if (showAllMaterials || allMaterials.length <= 4) {
      return allMaterials;
    }
    const firstFour = allMaterials.slice(0, 4);
    const extraSelected = allMaterials.filter(
      (m, idx) => idx >= 4 && selectedMaterials.includes(m)
    );
    return Array.from(new Set([...firstFour, ...extraSelected]));
  }, [allMaterials, showAllMaterials, selectedMaterials]);

  // Handle category checkbox change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const cat = categories.find(
        (c) =>
          c.id === categoryId ||
          c.slug === categoryId ||
          c.documentId === categoryId
      );
      const idsToRemove = new Set(
        [categoryId, cat?.id, cat?.slug, cat?.documentId].filter(Boolean) as string[]
      );
      const hasMatch = prev.some((id) => idsToRemove.has(id));

      if (hasMatch) {
        return prev.filter((id) => !idsToRemove.has(id));
      }
      return [...prev, categoryId];
    });
  };

  // Handle material checkbox change
  const handleMaterialChange = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setPriceRange(300);
    setSearchTerm("");
    setSortBy("recommended");
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("bambil_catalog_filters");
      } catch {
        // Ignore storage errors
      }
      window.history.replaceState(null, "", pathname);
    }
  };

  // Remove single category filter chip
  const handleRemoveCategoryChip = (categoryId: string) => {
    const cat = categories.find(
      (c) =>
        c.id === categoryId ||
        c.slug === categoryId ||
        c.documentId === categoryId
    );
    const idsToRemove = new Set(
      [categoryId, cat?.id, cat?.slug, cat?.documentId].filter(Boolean) as string[]
    );
    setSelectedCategories((prev) => prev.filter((id) => !idsToRemove.has(id)));
  };

  // Remove single material filter chip
  const handleRemoveMaterialChip = (material: string) => {
    setSelectedMaterials((prev) => prev.filter((m) => m !== material));
  };

  // Apply filters and sorting client-side for fluid, instant updates
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.material.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(
        (p) =>
          (p.categoryId && selectedCategories.includes(p.categoryId)) ||
          (p.category?.id && selectedCategories.includes(p.category.id)) ||
          (p.category?.slug && selectedCategories.includes(p.category.slug))
      );
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      result = result.filter((p) => selectedMaterials.includes(p.material));
    }

    // Price range filter
    result = result.filter((p) => p.price <= priceRange);

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "recommended") {
      result.sort((a, b) => {
        const aFeatured = a.featured ? 1 : 0;
        const bFeatured = b.featured ? 1 : 0;
        if (bFeatured !== aFeatured) {
          return bFeatured - aFeatured;
        }
        const aNew = a.isNew ? 1 : 0;
        const bNew = b.isNew ? 1 : 0;
        if (bNew !== aNew) {
          return bNew - aNew;
        }
        return 0;
      });
    }

    return result;
  }, [rawProducts, searchTerm, selectedCategories, selectedMaterials, priceRange, sortBy]);

  const handleAddToCart = (product: Product, size: string) => {
    if (!size) return;
    const variant = product.variants?.find((v) => v.size === size) || {
      id: `${product.id}-${size}`,
      size,
      stock: 0,
      productId: product.id,
    };
    addItem(product, variant, 1);
    setCartOpen(true);
  };

  return (
    <div className="relative mt-8">
      {/* Top Bar: Filters Trigger, Active Chips & Sort Selection */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#d2c4bc]/20">
          {/* Filter Trigger Button & Results Count */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#f6f3ec] hover:bg-[#ebd9c8] text-[#26170c] border border-[#d2c4bc] rounded-lg font-sans text-sm font-semibold transition-all shadow-xs cursor-pointer group"
            >
              <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">
                tune
              </span>
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 bg-[#26170c] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <span className="font-sans text-xs sm:text-sm font-medium text-[#81756e]">
              {filteredProducts.length === 1
                ? "1 producto encontrado"
                : `${filteredProducts.length} productos encontrados`}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-auto">
            <span className="font-sans text-xs font-bold text-[#81756e] uppercase tracking-wider">
              Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#fcf9f2] border border-[#d2c4bc] rounded-md px-3 py-1.5 font-sans text-sm font-semibold text-[#26170c] focus:ring-1 focus:ring-[#26170c] focus:border-[#26170c] cursor-pointer"
            >
              <option value="recommended">Recomendados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A - Z</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-sans text-[#81756e] font-medium mr-1">
              Filtros activos:
            </span>

            {/* Search chip */}
            {searchTerm.trim() && (
              <span className="inline-flex items-center px-3 py-1 bg-[#f6f3ec] rounded-full border border-[#d2c4bc] font-sans text-xs font-semibold text-[#26170c]">
                Búsqueda: &ldquo;{searchTerm}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="ml-2 text-[#81756e] hover:text-[#26170c] flex items-center cursor-pointer"
                  aria-label="Eliminar búsqueda"
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                </button>
              </span>
            )}

            {/* Category chips */}
            {selectedCategories.map((catId) => {
              const category = categories.find(
                (c) => c.id === catId || c.slug === catId || c.documentId === catId
              );
              return (
                <span
                  key={catId}
                  className="inline-flex items-center px-3 py-1 bg-[#f6f3ec] rounded-full border border-[#d2c4bc] font-sans text-xs font-semibold text-[#26170c]"
                >
                  {category?.name || catId}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategoryChip(catId)}
                    className="ml-2 text-[#81756e] hover:text-[#26170c] flex items-center cursor-pointer"
                    aria-label={`Eliminar filtro ${category?.name || catId}`}
                  >
                    <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                  </button>
                </span>
              );
            })}

            {/* Material chips */}
            {selectedMaterials.map((material) => (
              <span
                key={material}
                className="inline-flex items-center px-3 py-1 bg-[#f6f3ec] rounded-full border border-[#d2c4bc] font-sans text-xs font-semibold text-[#26170c]"
              >
                {material}
                <button
                  type="button"
                  onClick={() => handleRemoveMaterialChip(material)}
                  className="ml-2 text-[#81756e] hover:text-[#26170c] flex items-center cursor-pointer"
                  aria-label={`Eliminar filtro ${material}`}
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                </button>
              </span>
            ))}

            {/* Price chip */}
            {priceRange < 300 && (
              <span className="inline-flex items-center px-3 py-1 bg-[#f6f3ec] rounded-full border border-[#d2c4bc] font-sans text-xs font-semibold text-[#26170c]">
                Hasta ${priceRange}
                <button
                  type="button"
                  onClick={() => setPriceRange(300)}
                  className="ml-2 text-[#81756e] hover:text-[#26170c] flex items-center cursor-pointer"
                  aria-label="Restablecer precio máximo"
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                </button>
              </span>
            )}

            {/* Clear all link */}
            <button
              type="button"
              onClick={handleClearFilters}
              className="font-sans text-xs font-semibold text-[#725a39] underline hover:text-[#26170c] ml-2 cursor-pointer"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* Products Grid Canvas */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-[#f6f3ec] rounded-lg overflow-hidden h-[420px] flex flex-col justify-between p-4"
            >
              <div className="h-[250px] bg-[#e5e2db] rounded w-full mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-5 bg-[#e5e2db] rounded w-3/4"></div>
                <div className="h-4 bg-[#e5e2db] rounded w-1/2"></div>
              </div>
              <div className="h-10 bg-[#e5e2db] rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#f6f3ec] rounded-lg border border-dashed border-[#d2c4bc] flex flex-col items-center justify-center p-8">
          <span className="material-symbols-outlined text-4xl mb-3 text-[#81756e]">search_off</span>
          <p className="font-sans text-sm font-semibold text-[#26170c]">
            No se encontraron productos coincidentes
          </p>
          <p className="font-sans text-xs text-[#81756e] mt-1">
            Prueba a restablecer los filtros o buscar otro término.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-5 bg-[#26170c] text-white font-sans text-xs font-semibold px-6 py-2.5 rounded hover:bg-[#3d2b1f] transition-all cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => {
            const defaultSize = product.variants?.[0]?.size || "";
            return (
              <article
                key={product.id}
                className="bg-[#f6f3ec] rounded-lg overflow-hidden border border-transparent hover:border-[#d2c4bc]/40 transition-all duration-300 flex flex-col group shadow-[0_8px_30px_rgba(112,90,76,0.02)] hover:shadow-[0_8px_30px_rgba(112,90,76,0.1)]"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${product.slug || product.documentId || product.id}`}
                  className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-[#e5e2db] block"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col items-start gap-1 z-10 max-w-[calc(100%-16px)] pointer-events-none">
                    {/* Status Badges */}
                    {(product.isNew || product.featured) && (
                      <div className="flex flex-wrap items-center gap-1">
                        {product.isNew && (
                          <span className="bg-[#ba1a1a] text-white font-sans text-[9px] sm:text-[10px] tracking-wider font-bold uppercase px-1.5 sm:px-2.5 py-0.5 rounded-sm shadow-sm w-fit">
                            Nuevo
                          </span>
                        )}
                        {product.featured && (
                          <span className="bg-[#fcf9f2]/95 backdrop-blur-xs text-[#725a39] border border-[#d2c4bc]/60 font-sans text-[9px] sm:text-[10px] font-bold uppercase px-1.5 sm:px-2.5 py-0.5 rounded-sm shadow-xs w-fit">
                            Destacado
                          </span>
                        )}
                      </div>
                    )}

                    {/* Material Tag */}
                    {product.material && (
                      <span className="bg-[#26170c]/90 text-white font-sans text-[9px] sm:text-[10px] tracking-wider font-semibold uppercase px-1.5 sm:px-2.5 py-0.5 rounded-sm shadow-sm w-fit line-clamp-1 max-w-full hidden xs:inline-block sm:inline-block">
                        {product.material}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-1 sm:mb-2 gap-0.5 sm:gap-2">
                      <Link
                        href={`/product/${product.slug || product.documentId || product.id}`}
                        className="font-display text-sm sm:text-base font-semibold text-[#26170c] hover:text-[#725a39] transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <span className="font-sans text-xs sm:text-sm font-bold text-[#26170c] shrink-0">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#4f453f] line-clamp-2 leading-relaxed mb-3 sm:mb-4 hidden sm:block">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-1 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (defaultSize) {
                          handleAddToCart(product, defaultSize);
                        } else {
                          setSelectedProduct(product);
                          setSelectedSize("");
                        }
                      }}
                      className="w-full bg-[#26170c] hover:bg-[#3d2b1f] active:scale-[0.98] text-white font-sans text-[11px] sm:text-xs font-semibold py-2 sm:py-2.5 px-2 rounded transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm sm:text-base">shopping_cart</span>
                      <span className="truncate">
                        <span className="inline sm:hidden">{defaultSize ? `Talla ${defaultSize}` : "Añadir"}</span>
                        <span className="hidden sm:inline">{defaultSize ? `Añadir Talla ${defaultSize}` : "Añadir al Carrito"}</span>
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedSize(defaultSize);
                      }}
                      className="w-full text-center text-[11px] sm:text-xs font-sans font-semibold text-[#725a39] mt-1.5 sm:mt-2.5 hover:underline cursor-pointer truncate py-0.5 sm:py-0"
                    >
                      <span className="inline sm:hidden">Detalles</span>
                      <span className="hidden sm:inline">Ver Detalles y Tallas</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Filter Modal Dialog */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#26170c]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsFilterModalOpen(false)}
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
            className="relative bg-[#fcf9f2] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#d2c4bc]/50 z-10 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#d2c4bc]/40 flex items-center justify-between bg-[#fcf9f2]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f6f3ec] border border-[#d2c4bc] flex items-center justify-center text-[#26170c]">
                  <span className="material-symbols-outlined text-lg">tune</span>
                </div>
                <div>
                  <h2 id="filter-modal-title" className="font-display text-xl font-bold text-[#26170c]">
                    Filtros
                  </h2>
                  <p className="font-sans text-xs text-[#81756e]">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "producto coincidente" : "productos coincidentes"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 rounded-full text-[#81756e] hover:text-[#26170c] hover:bg-[#f6f3ec] transition-colors cursor-pointer"
                aria-label="Cerrar modal de filtros"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              {/* Search */}
              <div>
                <label
                  htmlFor="catalog-search-modal"
                  className="block font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-2"
                >
                  Buscar por nombre o material
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#81756e] text-lg pointer-events-none">
                    search
                  </span>
                  <input
                    id="catalog-search-modal"
                    type="text"
                    placeholder="Ej: Mocasín, Cuero camel, Botines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-[#d2c4bc] rounded-lg pl-10 pr-10 py-2.5 text-sm text-[#1c1c18] placeholder-[#81756e] focus:border-[#26170c] focus:ring-1 focus:ring-[#26170c] focus:outline-none transition-colors"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81756e] hover:text-[#26170c] cursor-pointer"
                      aria-label="Borrar búsqueda"
                    >
                      <span className="material-symbols-outlined text-[16px] font-bold">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 2-Column Section: Categories & Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                {/* Categories */}
                <div>
                  <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-3 pb-2 border-b border-[#d2c4bc]/40 flex items-center justify-between">
                    <span>Categorías</span>
                    {selectedCategories.length > 0 && (
                      <span className="text-[10px] font-semibold text-[#725a39] bg-[#fbdbb0]/50 px-2 py-0.5 rounded">
                        {selectedCategories.length} sel.
                      </span>
                    )}
                  </h3>
                  <ul className="space-y-3">
                    {categories.map((category) => {
                      const isChecked =
                        selectedCategories.includes(category.id) ||
                        Boolean(category.slug && selectedCategories.includes(category.slug)) ||
                        Boolean(category.documentId && selectedCategories.includes(category.documentId));

                      return (
                        <li key={category.id}>
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCategoryChange(category.id)}
                              className="h-4.5 w-4.5 rounded border-[#81756e] text-[#26170c] focus:ring-[#3d2b1f] focus:ring-offset-0 bg-transparent transition-colors cursor-pointer"
                            />
                            <span
                              className={`font-sans text-sm transition-colors cursor-pointer ${
                                isChecked
                                  ? "text-[#26170c] font-semibold"
                                  : "text-[#4f453f] group-hover:text-[#26170c]"
                              }`}
                            >
                              {category.name}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Materials */}
                <div>
                  <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-3 pb-2 border-b border-[#d2c4bc]/40 flex items-center justify-between">
                    <span>Materiales</span>
                    {selectedMaterials.length > 0 && (
                      <span className="text-[10px] font-semibold text-[#725a39] bg-[#fbdbb0]/50 px-2 py-0.5 rounded">
                        {selectedMaterials.length} sel.
                      </span>
                    )}
                  </h3>
                  <ul className="space-y-3">
                    {visibleMaterials.map((material) => {
                      const isChecked = selectedMaterials.includes(material);
                      return (
                        <li key={material}>
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleMaterialChange(material)}
                              className="h-4.5 w-4.5 rounded border-[#81756e] text-[#26170c] focus:ring-[#3d2b1f] focus:ring-offset-0 bg-transparent transition-colors cursor-pointer"
                            />
                            <span
                              className={`font-sans text-sm transition-colors cursor-pointer ${
                                isChecked
                                  ? "text-[#26170c] font-semibold"
                                  : "text-[#4f453f] group-hover:text-[#26170c]"
                              }`}
                            >
                              {material}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>

                  {allMaterials.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllMaterials((prev) => !prev)}
                      className="mt-3.5 text-xs font-sans font-semibold text-[#725a39] hover:text-[#26170c] inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>
                        {showAllMaterials
                          ? "Ver menos"
                          : `Ver más (${allMaterials.length - 4})`}
                      </span>
                      <span className="material-symbols-outlined text-base">
                        {showAllMaterials ? "expand_less" : "expand_more"}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-2 border-t border-[#d2c4bc]/40">
                <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-4 pb-2 border-b border-[#d2c4bc]/40">
                  Rango de Precio
                </h3>
                <div className="space-y-3 max-w-md">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#26170c] bg-[#e5e2db] h-2 rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between font-sans text-xs text-[#4f453f] font-semibold">
                    <span>$0</span>
                    <span className="text-[#26170c] bg-[#fbdbb0] px-2.5 py-0.5 rounded font-bold">
                      Hasta ${priceRange}
                    </span>
                    <span>$300+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#f6f3ec] border-t border-[#d2c4bc]/50 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={activeFiltersCount === 0}
                onClick={handleClearFilters}
                className={`font-sans text-xs font-semibold py-2 px-3 rounded transition-colors flex items-center gap-1.5 ${
                  activeFiltersCount > 0
                    ? "text-[#4f453f] hover:text-[#26170c] cursor-pointer"
                    : "text-[#81756e]/50 cursor-not-allowed"
                }`}
              >
                <span className="material-symbols-outlined text-base">filter_alt_off</span>
                Limpiar todos los filtros
              </button>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-xs font-semibold py-3 px-6 rounded-lg transition-all shadow-sm cursor-pointer"
              >
                Mostrar {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "producto" : "productos"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#26170c]/50 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative bg-[#fcf9f2] w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl border border-[#d2c4bc]/50 z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-full hover:bg-white shadow-md transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[#26170c]">close</span>
            </button>
            
            <div className="w-full md:w-1/2 bg-[#e5e2db] relative aspect-square md:aspect-[4/5] min-h-[300px]">
              <Image
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {selectedProduct.isNew && (
                    <span className="inline-block bg-[#ba1a1a] text-white font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm shadow-xs">
                      Nuevo
                    </span>
                  )}
                  {selectedProduct.featured && (
                    <span className="inline-block bg-[#fcf9f2] text-[#725a39] border border-[#d2c4bc]/60 font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm shadow-xs">
                      Destacado
                    </span>
                  )}
                  <span className="inline-block bg-[#fbdbb0] text-[#765f3d] font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                    {selectedProduct.material}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#26170c] mb-2">
                  {selectedProduct.name}
                </h3>
                <p className="font-sans text-xl font-bold text-[#26170c] mb-4">
                  ${selectedProduct.price.toFixed(2)}
                </p>
                <p className="font-sans text-xs md:text-sm text-[#4f453f] leading-relaxed mb-6">
                  {selectedProduct.description}
                </p>

                <div className="mb-6">
                  <span className="block font-sans text-xs font-semibold text-[#26170c] mb-3">
                    Seleccionar Talla:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants?.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedSize(v.size)}
                        className={`min-w-[40px] h-10 px-2 flex items-center justify-center rounded font-sans text-xs font-semibold transition-all border relative cursor-pointer ${
                          selectedSize === v.size
                            ? "bg-[#26170c] border-[#26170c] text-white shadow-sm"
                            : "bg-white border-[#d2c4bc] text-[#26170c] hover:border-[#26170c]"
                        }`}
                      >
                        {v.size}
                        {v.stock > 0 && v.stock < 5 && (
                          <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ba1a1a] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ba1a1a]"></span>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <button
                  disabled={!selectedSize}
                  onClick={() => {
                    handleAddToCart(selectedProduct, selectedSize);
                    setSelectedProduct(null);
                  }}
                  className={`w-full py-4 rounded font-sans text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md ${
                    selectedSize
                      ? "bg-[#26170c] hover:bg-[#3d2b1f] text-white cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">shopping_cart</span>
                  {selectedSize ? `Añadir Talla ${selectedSize} al Carrito` : "Seleccione una talla"}
                </button>
                <p className="font-sans text-[10px] text-center text-[#4f453f] mt-3 leading-tight">
                  *Al agregar el producto podrás finalizar tu compra directamente por WhatsApp conversando con Dario.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
