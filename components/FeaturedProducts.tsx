"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { Product } from "@/types";

const DEFAULT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD_dNoiXnJaWGkaO5zFoLW99yActG5gx032RgLySpxypzs3oiMQiOFy4j6EPfnhz-BOp7prPWR3rYM5px5zQuLjxOMP-3ZZ00wQTdlHLSkM83oDo1GQ3YL5sPOtrbOMCSKIgQV0N_I7EIwyYnVlMkURM6f26knM89Yp_h1dIwHpCulSoWVgBFTgEBma9FCwdTsnBylUDsa4UiDtflyhe_kySFb7iIDmoJ6Ca8BWvO4z6jEm8be0JrLhmroyjW0Y5cD_onFUquGih9pm";

interface FeaturedProductsProps {
  products?: Product[];
}

export default function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  const { addItem } = useCartStore();
  const { setCartOpen } = useUIStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (!selectedProduct) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedProduct]);

  // Option B: If there are no products at all in the database/catalog, completely hide the section
  if (!products || products.length === 0) {
    return null;
  }

  const displayedProducts = products.slice(0, 6);

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
    <section className="py-24 px-4 md:px-10 bg-[#fcf9f2]" id="productos">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#26170c] font-semibold text-balance">
              Nuestra Selección Exclusiva
            </h2>
            <p className="font-sans text-sm md:text-base text-[#4f453f] mt-2 max-w-xl text-pretty">
              Calzado diseñado y confeccionado a mano, prestando atención a cada costura y detalle.
            </p>
          </div>

          <Link
            href="/catalog"
            className="hidden md:inline-flex items-center gap-2 text-[#26170c] hover:text-[#725a39] font-sans text-sm font-semibold transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
          >
            <span>Ver Todo el Catálogo</span>
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {displayedProducts.map((product) => {
            const defaultSize = product.variants?.[0]?.size || "";
            const productImage = product.images?.[0] || DEFAULT_IMAGE;

            return (
              <div
                key={product.id}
                className="bg-[#f6f3ec] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(112,90,76,0.05)] hover:shadow-[0_16px_36px_rgba(112,90,76,0.12)] border border-[#d2c4bc]/40 hover:border-[#d2c4bc] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${product.slug || product.documentId || product.id}`}
                  className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-[#e5e2db] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] focus-visible:ring-inset"
                >
                  <Image
                    src={productImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center"
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

                {/* Details */}
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-1 sm:mb-2 gap-0.5 sm:gap-2">
                      <Link
                        href={`/product/${product.slug || product.documentId || product.id}`}
                        className="font-display text-sm sm:text-lg font-semibold text-[#26170c] hover:text-[#725a39] transition-colors text-balance focus:outline-none focus-visible:underline line-clamp-1 sm:line-clamp-none"
                      >
                        {product.name}
                      </Link>
                      <span className="font-sans text-xs sm:text-base font-bold text-[#26170c] shrink-0">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#4f453f] line-clamp-2 leading-relaxed mb-3 text-pretty hidden sm:block">
                      {product.description}
                    </p>

                    {/* Available sizes indicator */}
                    {product.variants && product.variants.length > 0 && (
                      <>
                        <p className="text-[10px] font-sans text-[#705a4c] mb-2 sm:hidden truncate">
                          Tallas: {product.variants.map((v) => v.size).join(", ")}
                        </p>
                        <div className="hidden sm:flex items-center gap-1.5 mb-4 flex-wrap">
                          <span className="text-[10px] font-sans font-semibold text-[#705a4c] uppercase tracking-wider mr-1">
                            Tallas:
                          </span>
                          {product.variants.slice(0, 5).map((v) => (
                            <span
                              key={v.id || v.size}
                              className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded bg-[#ebe8e1] text-[#26170c] border border-[#d2c4bc]/50"
                            >
                              {v.size}
                            </span>
                          ))}
                          {product.variants.length > 5 && (
                            <span className="text-[10px] font-sans text-[#725a39] font-bold">
                              +{product.variants.length - 5}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-1 sm:mt-0">
                    {/* Add to Cart button */}
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
                      className="w-full bg-[#26170c] hover:bg-[#3d2b1f] active:scale-[0.98] text-white font-sans text-[11px] sm:text-xs font-semibold py-2 sm:py-3.5 px-2 rounded transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] focus-visible:ring-offset-2"
                    >
                      <span className="material-symbols-outlined text-sm sm:text-base" aria-hidden="true">shopping_cart</span>
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
                      className="w-full text-center text-[11px] sm:text-xs font-sans font-semibold text-[#725a39] mt-1.5 sm:mt-3 hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#725a39] rounded py-0.5 sm:py-1 truncate"
                    >
                      <span className="inline sm:hidden">Detalles</span>
                      <span className="hidden sm:inline">Ver Detalles y Tallas</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View full collection button */}
        <div className="mt-14 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2.5 bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-sm font-semibold px-8 py-4 rounded shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] focus-visible:ring-offset-2"
          >
            <span>Ver Toda la Colección</span>
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-product-title"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#26170c]/50 backdrop-blur-xs"
              onClick={() => setSelectedProduct(null)}
            />

            {/* Modal Content */}
            <div className="relative bg-[#fcf9f2] w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl border border-[#d2c4bc]/50 z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 bg-white/80 p-2 min-w-[44px] min-h-[44px] rounded-full hover:bg-white shadow-md transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
                aria-label="Cerrar ventana de detalles del producto"
              >
                <span className="material-symbols-outlined text-[#26170c]" aria-hidden="true">close</span>
              </button>

              {/* Product Gallery */}
              <div className="w-full md:w-1/2 bg-[#e5e2db] relative aspect-square md:aspect-[4/5]">
                <Image
                  src={selectedProduct.images?.[0] || DEFAULT_IMAGE}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Details & Size Picker */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {selectedProduct.isNew && (
                      <span className="bg-[#ba1a1a] text-white font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                        Nuevo
                      </span>
                    )}
                    {selectedProduct.material && (
                      <span className="bg-[#fbdbb0] text-[#765f3d] font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                        {selectedProduct.material}
                      </span>
                    )}
                  </div>

                  <h3 id="modal-product-title" className="font-display text-2xl font-bold text-[#26170c] mb-2 text-balance">
                    {selectedProduct.name}
                  </h3>
                  <p className="font-sans text-xl font-bold text-[#26170c] mb-4">
                    ${selectedProduct.price.toFixed(2)}
                  </p>
                  <p className="font-sans text-xs md:text-sm text-[#4f453f] leading-relaxed mb-6 text-pretty">
                    {selectedProduct.description}
                  </p>

                  {/* Size Selector */}
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div className="mb-6">
                      <span className="block font-sans text-xs font-semibold text-[#26170c] mb-3">
                        Seleccionar Talla:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.variants.map((v) => (
                          <button
                            key={v.id || v.size}
                            onClick={() => setSelectedSize(v.size)}
                            aria-pressed={selectedSize === v.size}
                            aria-label={`Talla ${v.size}${v.stock > 0 && v.stock < 5 ? ", pocas unidades" : ""}`}
                            className={`min-w-[40px] h-10 px-2 flex items-center justify-center rounded font-sans text-xs font-semibold transition-all border relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] ${
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
                  )}
                </div>

                <div>
                  <button
                    disabled={!selectedSize}
                    onClick={() => {
                      handleAddToCart(selectedProduct, selectedSize);
                      setSelectedProduct(null);
                    }}
                    className={`w-full py-4 rounded font-sans text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] focus-visible:ring-offset-2 ${
                      selectedSize
                        ? "bg-[#26170c] hover:bg-[#3d2b1f] text-white cursor-pointer"
                        : "bg-[#e5e2db] text-[#81756e] cursor-not-allowed border border-[#d2c4bc]/40"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base" aria-hidden="true">shopping_cart</span>
                    {selectedSize ? `Añadir Talla ${selectedSize} al Carrito` : "Seleccione una talla"}
                  </button>
                  <p className="font-sans text-[10px] text-center text-[#4f453f] mt-3 leading-tight text-pretty">
                    *Al agregar el producto podrás finalizar tu compra directamente por WhatsApp conversando con Dario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
