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
    const categoryParam = params.get("category") || params.get("categoryId");
    const categories = rawCategories
      ? rawCategories.split(",").filter(Boolean)
      : categoryParam
      ? [categoryParam]
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
  const lastAppliedParamsRef = useRef<string | null>(null);

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

  // Sync state with URL searchParams (on mount or router navigation)
  useEffect(() => {
    const currentParamsString = searchParams.toString();
    if (lastAppliedParamsRef.current === currentParamsString) {
      return;
    }
    lastAppliedParamsRef.current = currentParamsString;

    if (!currentParamsString) {
      if (!isInitializedRef.current && typeof window !== "undefined") {
        isInitializedRef.current = true;
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
            return;
          }
        } catch {
          // Ignore JSON parse error
        }
      }

      if (isInitializedRef.current) {
        queueMicrotask(() => {
          setSearchTerm("");
          setSelectedCategories([]);
          setSelectedMaterials([]);
          setPriceRange(300);
          setSortBy("recommended");
        });
      }
      isInitializedRef.current = true;
      return;
    }

    isInitializedRef.current = true;
    const parsed = parseParams(searchParams);
    queueMicrotask(() => {
      setSearchTerm(parsed.search);
      setSelectedCategories(parsed.categories);
      setSelectedMaterials(parsed.materials);
      setPriceRange(parsed.price);
      setSortBy(parsed.sort);
    });
  }, [searchParams, parseParams]);

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
    lastAppliedParamsRef.current = queryString;

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

  // Helper to determine if a category is active in the current selection
  const isCategoryActive = useCallback(
    (category: Category) => {
      if (selectedCategories.length === 0) return false;
      const keys = [category.id, category.documentId, category.slug].filter(Boolean) as string[];
      return keys.some((k) => selectedCategories.includes(k));
    },
    [selectedCategories]
  );

  // Quick tab click handler: switches exclusively to this category or deselects back to all
  const handleQuickTabSelect = useCallback(
    (category: Category) => {
      const isSelected = isCategoryActive(category);
      if (isSelected && selectedCategories.length === 1) {
        setSelectedCategories([]);
      } else {
        const primaryKey = category.id || category.documentId || category.slug || "";
        setSelectedCategories([primaryKey]);
      }
    },
    [isCategoryActive, selectedCategories.length]
  );

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
    lastAppliedParamsRef.current = "";
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
      const activeIdentifiers = new Set<string>();
      selectedCategories.forEach((selId) => {
        activeIdentifiers.add(selId);
        const matchedCat = categories.find(
          (c) => c.id === selId || c.documentId === selId || c.slug === selId
        );
        if (matchedCat) {
          if (matchedCat.id) activeIdentifiers.add(matchedCat.id);
          if (matchedCat.documentId) activeIdentifiers.add(matchedCat.documentId);
          if (matchedCat.slug) activeIdentifiers.add(matchedCat.slug);
        }
      });

      result = result.filter((p) => {
        const prodKeys = [
          p.categoryId,
          p.category?.id,
          p.category?.documentId,
          p.category?.slug,
        ].filter(Boolean) as string[];
        return prodKeys.some((key) => activeIdentifiers.has(key));
      });
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
  }, [rawProducts, searchTerm, selectedCategories, selectedMaterials, priceRange, sortBy, categories]);

  // Product counts per category for the Quick-Tabs rail
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    categories.forEach((cat) => {
      const catIdentifiers = new Set(
        [cat.id, cat.documentId, cat.slug].filter(Boolean) as string[]
      );

      const count = rawProducts.filter((p) => {
        const prodKeys = [
          p.categoryId,
          p.category?.id,
          p.category?.documentId,
          p.category?.slug,
        ].filter(Boolean) as string[];
        return prodKeys.some((key) => catIdentifiers.has(key));
      }).length;

      if (cat.id) counts[cat.id] = count;
      if (cat.documentId) counts[cat.documentId] = count;
      if (cat.slug) counts[cat.slug] = count;
    });

    return counts;
  }, [categories, rawProducts]);

  // Product counts per material
  const materialCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rawProducts.forEach((p) => {
      if (p.material) {
        counts[p.material] = (counts[p.material] || 0) + 1;
      }
    });
    return counts;
  }, [rawProducts]);

  // Progressive scroll loading pagination
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Track filter key to reset pagination during render without cascading effect renders
  const filterKey = `${searchTerm}|${selectedCategories.join(",")}|${selectedMaterials.join(",")}|${priceRange}|${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  // Slice filtered products according to current page
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  // Infinite scroll observer using threshold sentinel
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setIsLoadingMore(false);
          }, 350);
        }
      },
      { rootMargin: "250px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, isLoadingMore]);

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
    <div className="relative mt-4">
      {/* 1. Horizon Quick-Tabs (Category pill rail) */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          <button
            type="button"
            onClick={() => setSelectedCategories([])}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] ${
              selectedCategories.length === 0
                ? "bg-[#26170c] text-[#fcf9f2] border-[#26170c] shadow-xs"
                : "bg-[#f6f3ec] text-[#4f453f] border-[#d2c4bc]/60 hover:bg-[#ebe8e1] hover:text-[#26170c]"
            }`}
          >
            <span>Todas las Siluetas</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                selectedCategories.length === 0
                  ? "bg-[#feddb3] text-[#26170c]"
                  : "bg-[#e5e2db] text-[#705a4c]"
              }`}
            >
              {rawProducts.length}
            </span>
          </button>

          {categories.map((category) => {
            const isSelected = isCategoryActive(category);
            const count =
              categoryCounts[category.id] ??
              (category.documentId ? categoryCounts[category.documentId] : 0) ??
              (category.slug ? categoryCounts[category.slug] : 0) ??
              0;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleQuickTabSelect(category)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] ${
                  isSelected
                    ? "bg-[#26170c] text-[#fcf9f2] border-[#26170c] shadow-xs"
                    : "bg-[#f6f3ec] text-[#4f453f] border-[#d2c4bc]/60 hover:bg-[#ebe8e1] hover:text-[#26170c]"
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-[#feddb3] text-[#26170c]"
                      : "bg-[#e5e2db] text-[#705a4c]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Integrated Atelier Action Toolbar */}
      <div className="bg-[#f6f3ec] p-3 sm:p-4 rounded-xl border border-[#d2c4bc]/60 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Instant Search Bar */}
        <div className="relative flex-1 max-w-full md:max-w-sm">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#705a4c] text-lg pointer-events-none"
            aria-hidden="true"
          >
            search
          </span>
          <input
            type="text"
            placeholder="Buscar modelo, estilo o cuero..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#fcf9f2] border border-[#d2c4bc]/80 rounded-lg pl-9 pr-9 py-2 text-xs sm:text-sm text-[#26170c] placeholder-[#81756e] focus:border-[#26170c] focus:ring-1 focus:ring-[#26170c] focus:outline-none transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#705a4c] hover:text-[#26170c] cursor-pointer p-0.5 rounded-full"
              aria-label="Borrar búsqueda"
            >
              <span className="material-symbols-outlined text-[15px] font-bold" aria-hidden="true">
                close
              </span>
            </button>
          )}
        </div>

        {/* Right: Drawer Trigger, Count, Sort */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Filter Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#fcf9f2] hover:bg-white text-[#26170c] border border-[#d2c4bc] rounded-lg font-sans text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
          >
            <span className="material-symbols-outlined text-base text-[#725a39]" aria-hidden="true">
              tune
            </span>
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="ml-0.5 bg-[#26170c] text-white text-[10px] font-bold rounded-full min-w-[18px] h-4.5 px-1.5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Results Count */}
          <span className="font-sans text-xs font-medium text-[#705a4c] whitespace-nowrap hidden sm:inline">
            Mostrando {paginatedProducts.length} de {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "pieza" : "piezas"}
          </span>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <label
              htmlFor="catalog-sort"
              className="font-sans text-[11px] font-bold text-[#705a4c] uppercase tracking-wider hidden lg:inline"
            >
              Orden:
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#fcf9f2] border border-[#d2c4bc] rounded-lg px-2.5 sm:px-3 py-2 font-sans text-xs sm:text-sm font-semibold text-[#26170c] focus:ring-1 focus:ring-[#26170c] focus:border-[#26170c] cursor-pointer"
            >
              <option value="recommended">Recomendados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 pt-1">
          <span className="text-xs font-sans text-[#705a4c] font-semibold mr-1">
            Filtros activos:
          </span>

          {/* Search chip */}
          {searchTerm.trim() && (
            <span className="inline-flex items-center px-3 py-1 bg-[#f6f3ec] rounded-full border border-[#d2c4bc] font-sans text-xs font-semibold text-[#26170c]">
              Búsqueda: &ldquo;{searchTerm}&rdquo;
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="ml-2 text-[#705a4c] hover:text-[#26170c] flex items-center cursor-pointer"
                aria-label="Eliminar búsqueda"
              >
                <span className="material-symbols-outlined text-[14px] font-bold" aria-hidden="true">
                  close
                </span>
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
                  className="ml-2 text-[#705a4c] hover:text-[#26170c] flex items-center cursor-pointer"
                  aria-label={`Eliminar filtro ${category?.name || catId}`}
                >
                  <span className="material-symbols-outlined text-[14px] font-bold" aria-hidden="true">
                    close
                  </span>
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
                className="ml-2 text-[#705a4c] hover:text-[#26170c] flex items-center cursor-pointer"
                aria-label={`Eliminar filtro ${material}`}
              >
                <span className="material-symbols-outlined text-[14px] font-bold" aria-hidden="true">
                  close
                </span>
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
                className="ml-2 text-[#705a4c] hover:text-[#26170c] flex items-center cursor-pointer"
                aria-label="Restablecer precio máximo"
              >
                <span className="material-symbols-outlined text-[14px] font-bold" aria-hidden="true">
                  close
                </span>
              </button>
            </span>
          )}

          {/* Clear all button */}
          <button
            type="button"
            onClick={handleClearFilters}
            className="font-sans text-xs font-semibold text-[#725a39] hover:text-[#26170c] underline ml-2 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#26170c] rounded py-0.5"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* 4. Products Grid Canvas */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-[#f6f3ec] rounded-xl overflow-hidden h-[340px] sm:h-[420px] flex flex-col justify-between p-3 sm:p-4 border border-[#d2c4bc]/40"
            >
              <div className="aspect-[3/4] sm:aspect-[4/5] bg-[#e5e2db] rounded-lg w-full mb-3 sm:mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 sm:h-5 bg-[#e5e2db] rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-[#e5e2db] rounded w-1/2"></div>
              </div>
              <div className="h-8 sm:h-10 bg-[#e5e2db] rounded w-full mt-3 sm:mt-4"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 sm:py-20 px-4 my-8 bg-[#f6f3ec] rounded-2xl border border-[#d2c4bc]/60 shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#ebe8e1] flex items-center justify-center text-[#725a39] mb-4 shadow-inner">
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">
              search_off
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#26170c] mb-2 text-balance">
            No encontramos piezas con estos criterios
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#4f453f] max-w-md mx-auto leading-relaxed mb-6 text-pretty">
            Prueba a restablecer los filtros seleccionados o conversa con nosotros si deseas confeccionar un diseño personalizado en el taller.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full sm:w-auto bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-xs font-semibold px-6 py-3 rounded-lg shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
            >
              Restablecer Filtros
            </button>
            <a
              href="https://wa.me/593963282245?text=Hola%20Dar%C3%ADo%2C%20estoy%20buscando%20un%20modelo%20a%20medida%20en%20Bambil%20Shoes"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fcf9f2] hover:bg-white text-[#26170c] border border-[#d2c4bc] font-sans text-xs font-semibold px-6 py-3 rounded-lg transition-all shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
            >
              <span className="material-symbols-outlined text-base text-[#25D366]" aria-hidden="true">
                chat
              </span>
              <span>Consultar por Encargo</span>
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {paginatedProducts.map((product) => {
              const defaultSize = product.variants?.[0]?.size || "";
              return (
                <article
                  key={product.id}
                  className="bg-[#f6f3ec] rounded-xl overflow-hidden border border-[#d2c4bc]/40 hover:border-[#d2c4bc] hover:-translate-y-1 transition-all duration-300 flex flex-col group shadow-[0_8px_30px_rgba(112,90,76,0.04)] hover:shadow-[0_16px_36px_rgba(112,90,76,0.12)]"
                >
                  {/* Product Image */}
                  <Link
                    href={`/product/${product.slug || product.documentId || product.id}`}
                    className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-[#e5e2db] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] focus-visible:ring-inset"
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
                          className="font-display text-sm sm:text-base font-semibold text-[#26170c] hover:text-[#725a39] transition-colors line-clamp-1 text-balance focus:outline-none focus-visible:underline"
                        >
                          {product.name}
                        </Link>
                        <span className="font-sans text-xs sm:text-sm font-bold text-[#26170c] shrink-0">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#4f453f] line-clamp-2 leading-relaxed mb-3 sm:mb-4 hidden sm:block text-pretty">
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
                        className="w-full bg-[#26170c] hover:bg-[#3d2b1f] active:scale-[0.98] text-white font-sans text-[11px] sm:text-xs font-semibold py-2 sm:py-2.5 px-2 rounded transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
                      >
                        <span className="material-symbols-outlined text-sm sm:text-base" aria-hidden="true">
                          shopping_cart
                        </span>
                        <span className="truncate">
                          <span className="inline sm:hidden">
                            {defaultSize ? `Talla ${defaultSize}` : "Añadir"}
                          </span>
                          <span className="hidden sm:inline">
                            {defaultSize ? `Añadir Talla ${defaultSize}` : "Añadir al Carrito"}
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setSelectedSize(defaultSize);
                        }}
                        className="w-full text-center text-[11px] sm:text-xs font-sans font-semibold text-[#725a39] mt-1.5 sm:mt-2.5 hover:underline cursor-pointer truncate py-0.5 sm:py-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#725a39] rounded"
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

          {/* Scroll Loading Skeleton Row */}
          {isLoadingMore && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-3 sm:mt-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={`skeleton-more-${i}`}
                  className="bg-[#f6f3ec] rounded-xl overflow-hidden h-[340px] sm:h-[420px] flex flex-col justify-between p-3 sm:p-4 border border-[#d2c4bc]/40"
                >
                  <div className="aspect-[3/4] sm:aspect-[4/5] bg-[#e5e2db] rounded-lg w-full mb-3 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-[#e5e2db] rounded w-3/4" />
                    <div className="h-3 bg-[#e5e2db] rounded w-1/2" />
                  </div>
                  <div className="h-8 bg-[#e5e2db] rounded w-full mt-3" />
                </div>
              ))}
            </div>
          )}

          {/* Threshold Sentinel for IntersectionObserver */}
          <div ref={sentinelRef} className="h-4 w-full pointer-events-none" aria-hidden="true" />

          {/* Scroll Loading Indicator or Manual Load More fallback */}
          {hasMore && (
            <div className="flex flex-col items-center justify-center pt-8 pb-4">
              {isLoadingMore ? (
                <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f6f3ec] border border-[#d2c4bc]/60 shadow-2xs text-[#705a4c] font-sans text-xs font-semibold">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[#725a39] border-t-transparent animate-spin" aria-hidden="true" />
                  <span>Cargando más siluetas del taller...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                      setCurrentPage((prev) => prev + 1);
                      setIsLoadingMore(false);
                    }, 300);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f6f3ec] hover:bg-[#ebe8e1] text-[#26170c] border border-[#d2c4bc] font-sans text-xs font-semibold shadow-2xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
                >
                  <span>Cargar más siluetas ({filteredProducts.length - paginatedProducts.length} restantes)</span>
                  <span className="material-symbols-outlined text-base" aria-hidden="true">expand_more</span>
                </button>
              )}
            </div>
          )}

          {/* End of Catalog Hallmark */}
          {!hasMore && filteredProducts.length > 0 && (
            <div className="text-center pt-10 pb-6 border-t border-[#d2c4bc]/40 mt-10 flex flex-col items-center">
              <span className="text-[10px] font-sans font-semibold text-[#725a39] uppercase tracking-[0.2em] mb-1">
                Catálogo Completo
              </span>
              <p className="font-sans text-xs text-[#705a4c] mb-3">
                Has explorado las {filteredProducts.length} siluetas disponibles del taller.
              </p>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#26170c] hover:text-[#725a39] transition-colors cursor-pointer py-1.5 px-3.5 rounded-full border border-[#d2c4bc]/60 hover:border-[#26170c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_upward</span>
                <span>Volver al inicio</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* 5. Slide-Over Atelier Drawer for Advanced Filters */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[120] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="filter-drawer-title">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#26170c]/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsFilterModalOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#fcf9f2] shadow-2xl border-l border-[#d2c4bc]/70 flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#d2c4bc]/50 flex items-center justify-between bg-[#fcf9f2]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#26170c] flex items-center justify-center text-[#feddb3] shadow-xs">
                  <span className="material-symbols-outlined text-lg" aria-hidden="true">
                    tune
                  </span>
                </div>
                <div>
                  <h2 id="filter-drawer-title" className="font-display text-lg font-bold text-[#26170c]">
                    Filtros de Taller
                  </h2>
                  <p className="font-sans text-xs text-[#705a4c]">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "pieza disponible" : "piezas disponibles"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#705a4c] hover:text-[#26170c] hover:bg-[#ebe8e1] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
                aria-label="Cerrar panel de filtros"
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-7 flex-1">
              {/* Categories in Drawer */}
              <div>
                <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-3 pb-2 border-b border-[#d2c4bc]/40 flex items-center justify-between">
                  <span>Colecciones &amp; Categorías</span>
                  {selectedCategories.length > 0 && (
                    <span className="text-[10px] font-semibold text-[#725a39] bg-[#feddb3]/50 px-2 py-0.5 rounded">
                      {selectedCategories.length} activas
                    </span>
                  )}
                </h3>
                <ul className="space-y-2">
                  {categories.map((category) => {
                    const isChecked = isCategoryActive(category);
                    const count =
                      categoryCounts[category.id] ??
                      (category.documentId ? categoryCounts[category.documentId] : 0) ??
                      (category.slug ? categoryCounts[category.slug] : 0) ??
                      0;

                    return (
                      <li key={category.id}>
                        <label className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#f6f3ec] transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCategoryChange(category.id)}
                              className="h-4.5 w-4.5 rounded border-[#81756e] text-[#26170c] focus:ring-[#26170c] focus:ring-offset-0 bg-transparent cursor-pointer"
                            />
                            <span
                              className={`font-sans text-xs sm:text-sm transition-colors ${
                                isChecked
                                  ? "text-[#26170c] font-bold"
                                  : "text-[#4f453f] group-hover:text-[#26170c]"
                              }`}
                            >
                              {category.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-sans font-medium text-[#705a4c] bg-[#ebe8e1] px-2 py-0.5 rounded">
                            {count}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Leather & Materials */}
              <div>
                <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-3 pb-2 border-b border-[#d2c4bc]/40 flex items-center justify-between">
                  <span>Tipos de Cuero &amp; Materiales</span>
                  {selectedMaterials.length > 0 && (
                    <span className="text-[10px] font-semibold text-[#725a39] bg-[#feddb3]/50 px-2 py-0.5 rounded">
                      {selectedMaterials.length} seleccionados
                    </span>
                  )}
                </h3>
                <ul className="space-y-2">
                  {visibleMaterials.map((material) => {
                    const isChecked = selectedMaterials.includes(material);
                    const count = materialCounts[material] || 0;

                    return (
                      <li key={material}>
                        <label className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#f6f3ec] transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleMaterialChange(material)}
                              className="h-4.5 w-4.5 rounded border-[#81756e] text-[#26170c] focus:ring-[#26170c] focus:ring-offset-0 bg-transparent cursor-pointer"
                            />
                            <span
                              className={`font-sans text-xs sm:text-sm transition-colors ${
                                isChecked
                                  ? "text-[#26170c] font-bold"
                                  : "text-[#4f453f] group-hover:text-[#26170c]"
                              }`}
                            >
                              {material}
                            </span>
                          </div>
                          {count > 0 && (
                            <span className="text-[11px] font-sans font-medium text-[#705a4c] bg-[#ebe8e1] px-2 py-0.5 rounded">
                              {count}
                            </span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>

                {allMaterials.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllMaterials((prev) => !prev)}
                    className="mt-3 ml-2 text-xs font-sans font-semibold text-[#725a39] hover:text-[#26170c] inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>
                      {showAllMaterials ? "Ver menos" : `Ver más (${allMaterials.length - 4})`}
                    </span>
                    <span className="material-symbols-outlined text-base" aria-hidden="true">
                      {showAllMaterials ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                )}
              </div>

              {/* Price Range Slider */}
              <div className="pt-2 border-t border-[#d2c4bc]/40">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#d2c4bc]/40">
                  <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider">
                    Presupuesto Máximo
                  </h3>
                  <span className="font-sans text-xs font-bold text-[#26170c] bg-[#feddb3] px-2.5 py-0.5 rounded">
                    ${priceRange} USD
                  </span>
                </div>
                <div className="space-y-3 pt-1">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#26170c] bg-[#e5e2db] h-2 rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between font-sans text-xs text-[#705a4c] font-semibold">
                    <span>$0</span>
                    <span>$150</span>
                    <span>$300+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 bg-[#f6f3ec] border-t border-[#d2c4bc]/60 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={activeFiltersCount === 0}
                onClick={handleClearFilters}
                className={`font-sans text-xs font-semibold py-2 px-2 rounded transition-colors flex items-center gap-1.5 ${
                  activeFiltersCount > 0
                    ? "text-[#4f453f] hover:text-[#26170c] cursor-pointer"
                    : "text-[#81756e]/40 cursor-not-allowed"
                }`}
              >
                <span className="material-symbols-outlined text-base" aria-hidden="true">
                  filter_alt_off
                </span>
                Limpiar todo
              </button>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-xs font-semibold py-3 px-6 rounded-lg transition-all shadow-sm cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
              >
                Ver {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "pieza" : "piezas"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Product Details / Quick Select Specimen Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="product-specimen-title">
          <div
            className="absolute inset-0 bg-[#26170c]/50 backdrop-blur-xs"
            onClick={() => setSelectedProduct(null)}
            aria-hidden="true"
          />

          <div className="relative bg-[#fcf9f2] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-[#d2c4bc]/60 z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 bg-[#fcf9f2]/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all flex items-center justify-center border border-[#d2c4bc]/60 text-[#26170c] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
              aria-label="Cerrar detalles del producto"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                close
              </span>
            </button>

            {/* Specimen Visual */}
            <div className="w-full md:w-1/2 bg-[#e5e2db] relative aspect-[3/4] md:aspect-[4/5] min-h-[300px]">
              <Image
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Specimen Information */}
            <div className="w-full md:w-1/2 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {selectedProduct.isNew && (
                    <span className="bg-[#ba1a1a] text-white font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm shadow-xs">
                      Nuevo
                    </span>
                  )}
                  {selectedProduct.featured && (
                    <span className="bg-[#fcf9f2] text-[#725a39] border border-[#d2c4bc]/60 font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm shadow-xs">
                      Destacado
                    </span>
                  )}
                  {selectedProduct.material && (
                    <span className="bg-[#26170c]/90 text-[#feddb3] font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      {selectedProduct.material}
                    </span>
                  )}
                </div>

                <h3 id="product-specimen-title" className="font-display text-2xl font-bold text-[#26170c] mb-1.5 text-balance">
                  {selectedProduct.name}
                </h3>
                <p className="font-sans text-xl font-bold text-[#26170c] mb-3">
                  ${selectedProduct.price.toFixed(2)}
                </p>
                <p className="font-sans text-xs text-[#4f453f] leading-relaxed mb-6 text-pretty">
                  {selectedProduct.description}
                </p>

                {/* Size Selector */}
                <div className="mb-6">
                  <span className="block font-sans text-xs font-semibold text-[#26170c] mb-2.5">
                    Seleccionar Talla Disponible:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants?.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedSize(v.size)}
                        className={`min-w-[42px] h-10 px-2.5 flex items-center justify-center rounded-lg font-sans text-xs font-semibold transition-all border relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] ${
                          selectedSize === v.size
                            ? "bg-[#26170c] border-[#26170c] text-white shadow-xs"
                            : "bg-[#f6f3ec] border-[#d2c4bc]/60 text-[#26170c] hover:border-[#26170c]"
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
                  type="button"
                  disabled={!selectedSize}
                  onClick={() => {
                    handleAddToCart(selectedProduct, selectedSize);
                    setSelectedProduct(null);
                  }}
                  className={`w-full py-3.5 rounded-lg font-sans text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] ${
                    selectedSize
                      ? "bg-[#26170c] hover:bg-[#3d2b1f] text-white cursor-pointer active:scale-[0.98]"
                      : "bg-[#e5e2db] text-[#81756e] cursor-not-allowed"
                  }`}
                >
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    shopping_cart
                  </span>
                  {selectedSize
                    ? `Añadir Talla ${selectedSize} al Carrito`
                    : "Selecciona una talla para continuar"}
                </button>
                <p className="font-sans text-[11px] text-center text-[#705a4c] mt-2.5 leading-tight text-pretty">
                  *Podrás confirmar los detalles de entrega por WhatsApp directamente con el artesano.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
