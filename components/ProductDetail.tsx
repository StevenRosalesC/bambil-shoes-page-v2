"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { useGlobalInfo } from "@/providers/global-info-provider";

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductDetail({
  product,
  relatedProducts = [],
}: ProductDetailProps) {
  const { globalInfo } = useGlobalInfo();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  // Gallery state
  const images = product.images && product.images.length > 0 ? product.images : ["/images/hero-about1.jpeg"];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Available Sizes
  const standardSizes = ["35", "36", "37", "38", "39", "40", "41"];
  const availableSizes =
    product.variants && product.variants.length > 0
      ? product.variants.map((v) => v.size)
      : standardSizes;

  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || "37");
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"details" | "care">("details");
  const [showSizeModal, setShowSizeModal] = useState<boolean>(false);

  // Check stock and custom-order status for selected size
  const matchedVariant = product.variants?.find((v) => v.size === selectedSize);
  const isMadeToOrder = !matchedVariant || matchedVariant.stock <= 0;

  // WhatsApp numbers
  const whatsappNumber = (
    globalInfo?.whatsappNumber ||
    globalInfo?.phone ||
    "593993833765"
  ).replace(/\D/g, "");

  // Add to Cart handler (always allowed, made to order if out of stock)
  const handleAddToCart = () => {
    const variant: ProductVariant = matchedVariant || {
      id: `${product.id}-${selectedSize}`,
      size: selectedSize,
      stock: 0,
      productId: product.id,
    };
    addItem(product, variant, quantity);
    setCartOpen(true);
  };

  // Direct WhatsApp purchase handler
  const handleWhatsAppBuy = () => {
    const orderNote = isMadeToOrder ? " (Bajo pedido)" : "";
    const message = `¡Hola Bambil Shoes! Deseo encargar el siguiente calzado artesanal:%0A%0A*Producto:* ${encodeURIComponent(product.name)}%0A*Talla:* ${selectedSize}${orderNote}%0A*Cantidad:* ${quantity}%0A*Precio unitario:* $${product.price.toFixed(2)}%0A*Total:* $${(product.price * quantity).toFixed(2)}%0A%0A¿Podrían brindarme información para coordinar el pedido y envío?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  // Direct WhatsApp inquiry handler
  const handleWhatsAppChat = () => {
    const message = `¡Hola! Quisiera realizar una consulta sobre el producto *${encodeURIComponent(product.name)}* (SKU: ${product.sku || product.id}). ¿Podrían brindarme más información?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  // Share link
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | Bambil Shoes`,
          text: `Descubre este calzado artesanal: ${product.name}`,
          url: window.location.href,
        });
      } catch {
        // User dismissed share dialog
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* 1. Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 md:mb-8 text-xs font-sans text-[#705a4c] flex items-center flex-wrap gap-2">
        <Link href="/" className="hover:text-[#26170c] transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-[#26170c] transition-colors">
          Catálogo
        </Link>
        {product.category?.name && (
          <>
            <span>/</span>
            <Link
              href={`/catalog?categoryId=${product.category.documentId || product.category.id}`}
              className="hover:text-[#26170c] transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#26170c] font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* 2. Main Product Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-20">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Big Featured Image */}
          <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-[#f6f3ec] border border-[#d2c4bc]/40 shadow-sm group">
            <Image
              src={images[selectedImageIndex] || images[0]}
              alt={`${product.name} - Imagen ${selectedImageIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10">
              {product.isNew && (
                <span className="bg-[#ba1a1a] text-white font-sans text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-sm">
                  Nuevo
                </span>
              )}
              {product.featured && (
                <span className="bg-[#26170c] text-[#D2B48C] font-sans text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-sm">
                  Destacado
                </span>
              )}
              {product.material && (
                <span className="bg-white/95 backdrop-blur-xs text-[#26170c] border border-[#d2c4bc]/60 font-sans text-[11px] font-semibold tracking-wide px-3 py-1 rounded-sm shadow-xs">
                  {product.material}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img, idx) => {
                const isSelected = selectedImageIndex === idx;
                const isFourthOrMore = idx === 3 && images.length > 4;

                return (
                  <button
                    key={`thumb-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-[#f6f3ec] ${
                      isSelected
                        ? "border-[#26170c] shadow-md ring-2 ring-[#26170c]/20"
                        : "border-[#d2c4bc]/60 hover:border-[#705a4c]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} miniatura ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover object-center"
                    />
                    {isFourthOrMore && !isSelected && (
                      <div className="absolute inset-0 bg-[#26170c]/70 text-white font-sans text-xs font-bold flex items-center justify-center">
                        +{images.length - 3} más
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Purchase Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & SKU */}
            <div className="flex items-center justify-between gap-2 text-xs font-sans uppercase tracking-wider text-[#705a4c]">
              <span>{product.category?.name || "Colección Artesanal"}</span>
              {product.sku && <span>SKU: {product.sku}</span>}
            </div>

            {/* Product Title */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#26170c] leading-tight">
              {product.name}
            </h1>

            {/* Subtitle / Description excerpt */}
            <p className="font-sans text-sm text-[#4f453f] leading-relaxed">
              {product.description || "Calzado exclusivo confeccionado a mano en el taller artesanal de Bambil Shoes por el maestro Darío Catuto en Colonche, Santa Elena."}
            </p>

            {/* Stock / Made-to-order Status */}
            <div className="flex items-center gap-3 pt-1 pb-2 border-b border-[#d2c4bc]/30 text-xs font-sans">
              {isMadeToOrder ? (
                <span className="text-[#8c6239] font-medium flex items-center gap-1.5 bg-[#8c6239]/10 px-2.5 py-1 rounded-md">
                  <span className="material-symbols-outlined text-sm">handyman</span>
                  <span>Disponible bajo pedido (Confección artesanal a mano)</span>
                </span>
              ) : (
                <span className="text-[#2e7d32] font-semibold flex items-center gap-1.5 bg-[#2e7d32]/10 px-2.5 py-1 rounded-md">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>En stock (Entrega inmediata)</span>
                </span>
              )}
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-sans text-3xl sm:text-4xl font-bold text-[#26170c]">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="font-sans text-lg text-[#81756e] line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                  {discountPercent && (
                    <span className="bg-[#ba1a1a]/10 text-[#ba1a1a] text-xs font-bold px-2 py-0.5 rounded font-sans">
                      -{discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Size Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <p className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider">
                  Talla: <span className="font-semibold normal-case text-[#4f453f]">{selectedSize}</span>
                  {isMadeToOrder && (
                    <span className="ml-2 font-normal text-[11px] text-[#8c6239] normal-case italic">
                      (Bajo pedido)
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setShowSizeModal(true)}
                  className="font-sans text-xs font-semibold text-[#725a39] hover:text-[#26170c] underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">straighten</span>
                  <span>Guía de Tallas</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={`size-${size}`}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 rounded-lg font-sans text-sm font-semibold transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? "bg-[#26170c] text-white shadow-sm ring-2 ring-[#26170c]/20"
                          : "bg-white text-[#26170c] border border-[#d2c4bc] hover:border-[#26170c]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center gap-4">
              <span className="font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider">
                Cantidad:
              </span>
              <div className="flex items-center border border-[#d2c4bc] rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-[#4f453f] hover:bg-[#f6f3ec] transition-colors cursor-pointer"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-semibold text-[#26170c] min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm font-bold text-[#4f453f] hover:bg-[#f6f3ec] transition-colors cursor-pointer"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-[#d2c4bc]/40">
            {/* Primary: Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-[#1e6f47] hover:bg-[#165636] text-white font-sans text-sm font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
              <span>{isMadeToOrder ? "+ Añadir al Carrito (Bajo pedido)" : "+ Añadir al Carrito"}</span>
            </button>
            {isMadeToOrder && (
              <p className="text-[11px] font-sans text-[#705a4c] text-center">
                * Esta talla se confeccionará artesanalmente en nuestro taller tras confirmar tu orden.
              </p>
            )}

            {/* Secondary: Buy via WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppBuy}
              className="w-full bg-[#25D366] hover:bg-[#20bd5c] text-white font-sans text-sm font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
              <span>Comprar por WhatsApp</span>
            </button>

            {/* Utility Links Row (Chat, Share) */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-sans font-semibold text-[#4f453f]">
              <button
                type="button"
                onClick={handleWhatsAppChat}
                className="py-2.5 px-3 rounded-lg border border-[#d2c4bc]/60 hover:bg-[#f6f3ec] hover:text-[#26170c] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">support_agent</span>
                <span>Asesoría personalizada</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-2.5 px-3 rounded-lg border border-[#d2c4bc]/60 hover:bg-[#f6f3ec] hover:text-[#26170c] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">share</span>
                <span>{copiedLink ? "¡Copiado!" : "Compartir"}</span>
              </button>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="p-4 bg-[#f6f3ec] rounded-xl border border-[#d2c4bc]/40 space-y-2.5 text-xs font-sans text-[#4f453f]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#725a39] text-base">local_shipping</span>
              <span>Envíos seguros a todo el Ecuador por Servientrega</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#725a39] text-base">pan_tool</span>
              <span>Calzado 100% hecho a mano en Bambil Collao, Santa Elena</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#725a39] text-base">published_with_changes</span>
              <span>Garantía artesanal y cambios de talla previa coordinación</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lower Section: Tabs (Technical Specs, Care Instructions) & Made-to-order Workshop Guarantee */}
      <div className="border-t border-[#d2c4bc]/50 pt-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Tabs Content (Left: 7 Cols) */}
          <div className="lg:col-span-7">
            {/* Tabs Header */}
            <div className="flex border-b border-[#d2c4bc]/40 mb-8 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`pb-4 px-4 font-sans text-sm font-bold tracking-wide transition-all border-b-2 cursor-pointer shrink-0 ${
                  activeTab === "details"
                    ? "border-[#26170c] text-[#26170c]"
                    : "border-transparent text-[#705a4c] hover:text-[#26170c]"
                }`}
              >
                Ficha Técnica
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("care")}
                className={`pb-4 px-4 font-sans text-sm font-bold tracking-wide transition-all border-b-2 cursor-pointer shrink-0 ${
                  activeTab === "care"
                    ? "border-[#26170c] text-[#26170c]"
                    : "border-transparent text-[#705a4c] hover:text-[#26170c]"
                }`}
              >
                Instrucciones de Cuidado
              </button>
            </div>

            {/* Tab 1: Technical Details */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-[#d2c4bc]/40 p-6 shadow-xs">
                  <h3 className="font-display text-lg font-bold text-[#26170c] mb-4">
                    Especificaciones del Calzado
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs sm:text-sm font-sans">
                    <div>
                      <dt className="text-[#705a4c] font-medium">Material Exterior:</dt>
                      <dd className="font-semibold text-[#26170c]">{product.material || "Cuero Genuino"}</dd>
                    </div>
                    <div>
                      <dt className="text-[#705a4c] font-medium">Plantilla Interior:</dt>
                      <dd className="font-semibold text-[#26170c]">{product.insoleMaterial || "Badana suave con almohadilla de metatarso"}</dd>
                    </div>
                    <div>
                      <dt className="text-[#705a4c] font-medium">Altura de Tacón / Suela:</dt>
                      <dd className="font-semibold text-[#26170c]">{product.heelHeight || "Horma anatómica estándar"}</dd>
                    </div>
                    <div>
                      <dt className="text-[#705a4c] font-medium">Tipo de Cierre:</dt>
                      <dd className="font-semibold text-[#26170c]">{product.closureType || "Hebilla / Calce ergonómico"}</dd>
                    </div>
                    <div>
                      <dt className="text-[#705a4c] font-medium">Género / Horma:</dt>
                      <dd className="font-semibold text-[#26170c]">{product.gender || product.category?.name || "Unisex"}</dd>
                    </div>
                    <div>
                      <dt className="text-[#705a4c] font-medium">Lugar de Confección:</dt>
                      <dd className="font-semibold text-[#26170c]">Comuna Bambil Collao, Santa Elena</dd>
                    </div>
                  </dl>
                </div>

                <div className="p-6 bg-[#f6f3ec] rounded-xl border border-[#d2c4bc]/30 text-xs sm:text-sm font-sans text-[#4f453f] leading-relaxed">
                  <h4 className="font-display text-base font-bold text-[#26170c] mb-2">
                    Tradición Marroquinera Ecuatoriana
                  </h4>
                  <p>
                    Cada ejemplar de Bambil Shoes pasa por más de 100 pasos artesanales: desde la rigurosa selección de la flor del cuero, corte manual con cuchilla, biselado de bordes, costura reforzada de alta tensión y pulido final con ceras nobles.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Care Guide (Only from DB) */}
            {activeTab === "care" && (
              <div className="bg-white rounded-xl border border-[#d2c4bc]/40 p-6 shadow-xs space-y-4 text-xs sm:text-sm font-sans text-[#4f453f] leading-relaxed">
                <h3 className="font-display text-lg font-bold text-[#26170c] mb-2">
                  Instrucciones de Cuidado
                </h3>
                {product.careInstructions ? (
                  <p className="whitespace-pre-line leading-relaxed">
                    {product.careInstructions}
                  </p>
                ) : (
                  <p className="text-[#705a4c] italic">
                    No se han registrado instrucciones de cuidado específicas para este modelo.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Artisan Guarantee & Made-to-order Commitment */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#d2c4bc]/50 shadow-sm space-y-6">
              <div className="flex items-center gap-3.5 pb-5 border-b border-[#d2c4bc]/40">
                <div className="w-12 h-12 rounded-xl bg-[#f6f3ec] text-[#725a39] flex items-center justify-center shrink-0 border border-[#d2c4bc]/40">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    workspace_premium
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#26170c]">
                    Garantía y Confección
                  </h3>
                  <p className="font-sans text-xs text-[#705a4c]">
                    Taller Bambil Shoes By Dario
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-sans text-[#4f453f] leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#725a39] text-lg shrink-0 mt-0.5">
                    handyman
                  </span>
                  <div>
                    <strong className="text-[#26170c] block text-xs font-bold mb-0.5">Elaboración Bajo Pedido</strong>
                    <span>Si tu talla no cuenta con stock para despacho inmediato, nuestro taller inicia el corte, aparado y armado manual especialmente para ti.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#725a39] text-lg shrink-0 mt-0.5">
                    schedule
                  </span>
                  <div>
                    <strong className="text-[#26170c] block text-xs font-bold mb-0.5">Tiempo de Confección</strong>
                    <span>De 3 a 5 días laborables dedicados a asegurar costuras reforzadas, calce anatómico y máxima durabilidad.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#725a39] text-lg shrink-0 mt-0.5">
                    verified
                  </span>
                  <div>
                    <strong className="text-[#26170c] block text-xs font-bold mb-0.5">100% Cuero Genuino</strong>
                    <span>Pieles vacunas nobles seleccionadas a mano, suaves al tacto y resistentes a la fatiga del uso diario.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#d2c4bc]/40 flex items-center justify-between">
                <div>
                  <p className="font-display text-xs font-bold text-[#26170c]">Hecho a mano en Ecuador</p>
                  <p className="font-sans text-[11px] text-[#705a4c]">Colonche, Santa Elena</p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-sans font-bold text-[#725a39] hover:text-[#26170c] transition-colors"
                >
                  <span>Consultar</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="border-t border-[#d2c4bc]/50 pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#26170c]">
                También te puede interesar
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#705a4c] mt-1">
                Modelos complementarios con la misma excelencia artesanal
              </p>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-sans font-bold text-[#725a39] hover:text-[#26170c] underline flex items-center gap-1"
            >
              <span>Ver catálogo completo</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rel) => {
              const relImage = rel.images && rel.images.length > 0 ? rel.images[0] : "/images/hero-about1.jpeg";
              return (
                <div
                  key={rel.id}
                  className="bg-[#f6f3ec] rounded-xl overflow-hidden border border-transparent hover:border-[#d2c4bc]/40 transition-all duration-300 flex flex-col group shadow-xs hover:shadow-md"
                >
                  <Link
                    href={`/product/${rel.slug || rel.documentId || rel.id}`}
                    className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-[#e5e2db]"
                  >
                    <Image
                      src={relImage}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {rel.featured && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#26170c]/90 text-[#D2B48C] font-sans text-[9px] sm:text-[10px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-sm shadow-xs">
                        Destacado
                      </span>
                    )}
                  </Link>

                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${rel.slug || rel.documentId || rel.id}`}
                        className="font-display text-sm sm:text-base font-semibold text-[#26170c] hover:text-[#725a39] transition-colors line-clamp-1"
                      >
                        {rel.name}
                      </Link>
                      <p className="font-sans text-[11px] sm:text-xs text-[#705a4c] line-clamp-1 mt-0.5">
                        {rel.material || "Cuero Genuino"}
                      </p>
                    </div>

                    <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#d2c4bc]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-sans text-xs sm:text-base font-bold text-[#26170c]">
                        ${rel.price.toFixed(2)}
                      </span>
                      <Link
                        href={`/product/${rel.slug || rel.documentId || rel.id}`}
                        className="bg-white hover:bg-[#26170c] hover:text-white text-[#26170c] border border-[#d2c4bc] text-[11px] sm:text-xs font-sans font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors shadow-xs text-center"
                      >
                        Ver modelo
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#d2c4bc]/40 space-y-6">
            <div className="flex items-center justify-between border-b border-[#d2c4bc]/40 pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#725a39]">straighten</span>
                <h3 className="font-display text-xl font-bold text-[#26170c]">Guía de Tallas de Calzado</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="text-[#705a4c] hover:text-[#26170c] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#4f453f] leading-relaxed">
              Nuestras hormas corresponden al estándar nacional ecuatoriano. Para saber tu talla exacta, mide la distancia desde el talón hasta la punta del dedo más largo:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-[#f6f3ec] text-[#26170c] border-b border-[#d2c4bc]">
                    <th className="py-2.5 px-3 text-left font-bold">Talla Ecuador</th>
                    <th className="py-2.5 px-3 text-left font-bold">Largo del pie (cm)</th>
                    <th className="py-2.5 px-3 text-left font-bold">Equivalencia US</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d2c4bc]/30 text-[#4f453f]">
                  <tr><td className="py-2 px-3 font-semibold text-[#26170c]">35</td><td className="py-2 px-3">22.5 cm</td><td className="py-2 px-3">5.0</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-[#26170c]">36</td><td className="py-2 px-3">23.0 cm</td><td className="py-2 px-3">5.5 - 6.0</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-[#26170c]">37</td><td className="py-2 px-3">23.8 cm</td><td className="py-2 px-3">6.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-[#26170c]">38</td><td className="py-2 px-3">24.5 cm</td><td className="py-2 px-3">7.0 - 7.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-[#26170c]">39</td><td className="py-2 px-3">25.1 cm</td><td className="py-2 px-3">8.0 - 8.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-[#26170c]">40</td><td className="py-2 px-3">25.8 cm</td><td className="py-2 px-3">9.0</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-[#26170c]">41</td><td className="py-2 px-3">26.5 cm</td><td className="py-2 px-3">9.5 - 10.0</td></tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-xs font-bold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
