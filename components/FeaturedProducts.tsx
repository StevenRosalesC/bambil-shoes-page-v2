"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { Product } from "@/types";

export default function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { data: response, isLoading } = useProducts({
    filterBy: selectedCategory ? "categoryId" : undefined,
    filterValue: selectedCategory,
  });
  const { addItem } = useCartStore();
  const { setCartOpen } = useUIStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const products = response?.data || [];

  const handleAddToCart = (product: Product, size: string) => {
    if (!size) return;
    const variant = product.variants?.find((v) => v.size === size);
    if (!variant) return;
    addItem(product, variant, 1);
    setCartOpen(true);
  };

  return (
    <section className="py-24 px-4 md:px-10 bg-[#fcf9f2]" id="productos">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#26170c] font-semibold">Nuestra Selección Exclusiva</h2>
            <p className="font-sans text-sm md:text-base text-[#4f453f] mt-2">
              Calzado diseñado y confeccionado a mano, prestando atención a cada costura.
            </p>
          </div>
          
          {/* Category Tabs */}
          <div className="flex bg-[#f6f3ec] p-1.5 rounded-lg border border-[#d2c4bc]/40">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-5 py-2 font-sans text-xs md:text-sm font-semibold rounded-md transition-all ${
                selectedCategory === undefined
                  ? "bg-[#26170c] text-white shadow-sm"
                  : "text-[#4f453f] hover:text-[#26170c]"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory("cat-dama")}
              className={`px-5 py-2 font-sans text-xs md:text-sm font-semibold rounded-md transition-all ${
                selectedCategory === "cat-dama"
                  ? "bg-[#26170c] text-white shadow-sm"
                  : "text-[#4f453f] hover:text-[#26170c]"
              }`}
            >
              Dama
            </button>
            <button
              onClick={() => setSelectedCategory("cat-caballeros")}
              className={`px-5 py-2 font-sans text-xs md:text-sm font-semibold rounded-md transition-all ${
                selectedCategory === "cat-caballeros"
                  ? "bg-[#26170c] text-white shadow-sm"
                  : "text-[#4f453f] hover:text-[#26170c]"
              }`}
            >
              Caballeros
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
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
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-[#4f453f] font-sans text-base">
            No se encontraron productos en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const defaultSize = product.variants?.[0]?.size || "";
              return (
                <div
                  key={product.id}
                  className="bg-[#f6f3ec] rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(112,90,76,0.04)] hover:shadow-[0_8px_30px_rgba(112,90,76,0.12)] border border-transparent hover:border-[#d2c4bc]/40 transition-all duration-300 flex flex-col group"
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-[#26170c] text-white font-sans text-[10px] tracking-wider font-semibold uppercase px-3 py-1 rounded-sm shadow-sm z-10">
                      {product.material}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className="font-display text-lg font-semibold text-[#26170c] hover:text-[#725a39] transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedSize(defaultSize);
                          }}
                        >
                          {product.name}
                        </h3>
                        <span className="font-sans text-base font-bold text-[#26170c]">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#4f453f] line-clamp-2 leading-relaxed mb-4">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      {/* Add to Cart button */}
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
                </div>
              );
            })}
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#26170c]/50 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
            
            {/* Modal Content */}
            <div className="relative bg-[#fcf9f2] w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl border border-[#d2c4bc]/50 z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-full hover:bg-white shadow-md transition-all flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[#26170c]">close</span>
              </button>
              
              {/* Product Gallery */}
              <div className="w-full md:w-1/2 bg-[#e5e2db] relative aspect-square md:aspect-[4/5]">
                <Image
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Details & Size Picker */}
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

                  {/* Size Selector */}
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
    </section>
  );
}
