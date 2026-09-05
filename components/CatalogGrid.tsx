"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { Product } from "@/types";

export default function CatalogGrid() {
  const { data: categoriesResponse } = useCategories();
  const { data: productsResponse, isLoading } = useProducts({ limit: 100 }); // Get all products for local filtering
  
  const { addItem } = useCartStore();
  const { setCartOpen } = useUIStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(300);
  const [sortBy, setSortBy] = useState("recommended");
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  
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

  // Handle category checkbox change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
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
  };

  // Remove single category filter chip
  const handleRemoveCategoryChip = (categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
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
      result = result.filter((p) => selectedCategories.includes(p.categoryId));
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
    }

    return result;
  }, [rawProducts, searchTerm, selectedCategories, selectedMaterials, priceRange, sortBy]);

  const handleAddToCart = (product: Product, size: string) => {
    if (!size) return;
    const variant = product.variants?.find((v) => v.size === size);
    if (!variant) return;
    addItem(product, variant, 1);
    setCartOpen(true);
  };

  // Render filter items (shared between mobile drawer and desktop sidebar)
  const renderFilters = () => (
    <div className="space-y-10">
      {/* Search Filter */}
      <div>
        <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-4 pb-2 border-b border-[#d2c4bc]/40">Buscar</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar calzado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#d2c4bc] rounded px-4 py-2 text-sm text-[#1c1c18] placeholder-[#81756e] focus:border-[#26170c] focus:outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81756e] hover:text-[#26170c]"
            >
              <span className="material-symbols-outlined text-[16px] font-bold">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Checkboxes */}
      <div>
        <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-4 pb-2 border-b border-[#d2c4bc]/40">Categorías</h3>
        <ul className="space-y-3.5">
          {categories.map((category) => (
            <li key={category.id}>
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4.5 w-4.5 rounded border-[#81756e] text-[#26170c] focus:ring-[#3d2b1f] focus:ring-offset-0 bg-transparent transition-colors cursor-pointer"
                />
                <span className={`font-sans text-sm transition-colors cursor-pointer ${
                  selectedCategories.includes(category.id)
                    ? "text-[#26170c] font-semibold"
                    : "text-[#4f453f] group-hover:text-[#26170c]"
                }`}>
                  {category.name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Materials Checkboxes */}
      <div>
        <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-4 pb-2 border-b border-[#d2c4bc]/40">Materiales</h3>
        <ul className="space-y-3.5">
          {allMaterials.map((material) => (
            <li key={material}>
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(material)}
                  onChange={() => handleMaterialChange(material)}
                  className="h-4.5 w-4.5 rounded border-[#81756e] text-[#26170c] focus:ring-[#3d2b1f] focus:ring-offset-0 bg-transparent transition-colors cursor-pointer"
                />
                <span className={`font-sans text-sm transition-colors cursor-pointer ${
                  selectedMaterials.includes(material)
                    ? "text-[#26170c] font-semibold"
                    : "text-[#4f453f] group-hover:text-[#26170c]"
                }`}>
                  {material}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Slider */}
      <div>
        <h3 className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-4 pb-2 border-b border-[#d2c4bc]/40">Rango de Precio</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="300"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-[#26170c] bg-[#e5e2db] h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between font-sans text-xs text-[#4f453f] font-semibold">
            <span>$0</span>
            <span className="text-[#26170c] bg-[#fbdbb0] px-2 py-0.5 rounded-sm">${priceRange} máx.</span>
            <span>$300+</span>
          </div>
        </div>
      </div>

      {/* Clear Button */}
      {(selectedCategories.length > 0 || selectedMaterials.length > 0 || searchTerm || priceRange < 300) && (
        <button
          onClick={handleClearFilters}
          className="w-full bg-[#f6f3ec] border border-[#81756e] text-[#4f453f] hover:text-[#26170c] font-sans text-xs font-semibold py-2.5 rounded transition-all flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
          Limpiar Filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-10 relative mt-8">
      {/* Desktop Filter Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 space-y-10 sticky top-28 h-fit self-start bg-[#f6f3ec] p-6 rounded-lg border border-[#d2c4bc]/30 shadow-[0_8px_30px_rgba(112,90,76,0.02)]">
        {renderFilters()}
      </aside>

      {/* Mobile Filter Trigger & Drawer */}
      <div className="md:hidden flex justify-between items-center bg-[#f6f3ec] p-4 border border-[#d2c4bc]/30 rounded-lg">
        <span className="font-sans text-sm font-bold text-[#26170c] uppercase tracking-wider">Filtros</span>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#4f453f] hover:text-[#26170c] bg-white px-4 py-2 border border-[#d2c4bc] rounded transition-all"
        >
          <span className="material-symbols-outlined text-lg">tune</span>
          Ajustar
        </button>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[110] bg-[#26170c]/40 backdrop-blur-xs flex md:hidden">
          <div className="relative bg-[#fcf9f2] w-full max-w-xs h-full p-6 overflow-y-auto flex flex-col justify-between border-r border-[#d2c4bc] shadow-2xl animate-[slideRight_0.3s_ease-in-out]">
            <div>
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#d2c4bc]">
                <h3 className="font-display text-xl font-bold text-[#26170c]">Filtros</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 hover:bg-[#f0eee7] rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[#26170c]">close</span>
                </button>
              </div>
              {renderFilters()}
            </div>
            
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-[#26170c] text-white font-sans text-xs font-semibold py-3.5 rounded mt-8"
            >
              Aplicar Filtros
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileFilterOpen(false)}></div>
        </div>
      )}

      {/* Product Grid Canvas */}
      <div className="flex-grow">
        {/* Active Chips & Sort Selection */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-[#d2c4bc]/20">
          {/* Active Chips */}
          <div className="flex flex-wrap gap-2 items-center">
            {selectedCategories.map((catId) => {
              const category = categories.find((c) => c.id === catId);
              return (
                <span
                  key={catId}
                  className="inline-flex items-center px-3 py-1 bg-[#f6f3ec] rounded-full border border-[#d2c4bc] font-sans text-xs font-semibold text-[#26170c]"
                >
                  {category?.name || "Categoría"}
                  <button
                    onClick={() => handleRemoveCategoryChip(catId)}
                    className="ml-2 text-[#81756e] hover:text-[#26170c] flex items-center"
                  >
                    <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                  </button>
                </span>
              );
            })}

            {selectedMaterials.map((material) => (
              <span
                key={material}
                className="inline-flex items-center px-3 py-1 bg-[#f6f3ec] rounded-full border border-[#d2c4bc] font-sans text-xs font-semibold text-[#26170c]"
              >
                {material}
                <button
                  onClick={() => handleRemoveMaterialChip(material)}
                  className="ml-2 text-[#81756e] hover:text-[#26170c] flex items-center"
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                </button>
              </span>
            ))}

            {(selectedCategories.length > 0 || selectedMaterials.length > 0) && (
              <button
                onClick={handleClearFilters}
                className="font-sans text-xs font-semibold text-[#725a39] underline hover:text-[#26170c] ml-2"
              >
                Limpiar todo
              </button>
            )}
            
            {!(selectedCategories.length > 0 || selectedMaterials.length > 0) && (
              <span className="font-sans text-xs font-semibold text-[#81756e]">
                Mostrando {filteredProducts.length} productos
              </span>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-auto">
            <span className="font-sans text-xs font-bold text-[#81756e] uppercase tracking-wider">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none font-sans text-sm font-semibold text-[#26170c] focus:ring-0 cursor-pointer pr-8 py-1 focus:outline-none"
            >
              <option value="recommended">Recomendados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A - Z</option>
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <p className="font-sans text-sm font-semibold text-[#26170c]">No se encontraron productos coincidentes</p>
            <p className="font-sans text-xs text-[#81756e] mt-1">Prueba a restablecer los filtros o buscar otro término.</p>
            <button
              onClick={handleClearFilters}
              className="mt-5 bg-[#26170c] text-white font-sans text-xs font-semibold px-6 py-2.5 rounded hover:bg-[#3d2b1f] transition-all"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => {
              const defaultSize = product.variants?.[0]?.size || "";
              return (
                <article
                  key={product.id}
                  className="bg-[#f6f3ec] rounded-lg overflow-hidden border border-transparent hover:border-[#d2c4bc]/40 transition-all duration-300 flex flex-col group shadow-[0_8px_30px_rgba(112,90,76,0.02)] hover:shadow-[0_8px_30px_rgba(112,90,76,0.1)]"
                >
                  {/* Product Image */}
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden bg-[#e5e2db] cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedSize(defaultSize);
                    }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-[#26170c] text-white font-sans text-[10px] tracking-wider font-semibold uppercase px-3 py-1 rounded-sm shadow-sm z-10">
                      {product.material}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h2
                          className="font-display text-lg font-semibold text-[#26170c] hover:text-[#725a39] transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedSize(defaultSize);
                          }}
                        >
                          {product.name}
                        </h2>
                        <span className="font-sans text-base font-bold text-[#26170c]">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#4f453f] line-clamp-2 leading-relaxed mb-4">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          if (defaultSize) {
                            handleAddToCart(product, defaultSize);
                          } else {
                            setSelectedProduct(product);
                            setSelectedSize("");
                          }
                        }}
                        className="w-full bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-xs font-semibold py-3 rounded transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-base">shopping_cart</span>
                        {defaultSize ? `Añadir Talla ${defaultSize}` : "Añadir al Carrito"}
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setSelectedSize(defaultSize);
                        }}
                        className="w-full text-center text-xs font-sans font-semibold text-[#725a39] mt-3 hover:underline"
                      >
                        Ver Detalles y Tallas
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

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
                <span className="inline-block bg-[#fbdbb0] text-[#765f3d] font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm mb-4">
                  {selectedProduct.material}
                </span>
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
                        disabled={v.stock === 0}
                        onClick={() => setSelectedSize(v.size)}
                        className={`min-w-[40px] h-10 px-2 flex items-center justify-center rounded font-sans text-xs font-semibold transition-all border relative ${
                          v.stock === 0
                            ? "border-transparent bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selectedSize === v.size
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
