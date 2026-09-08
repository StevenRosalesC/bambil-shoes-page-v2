"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types";

export interface CategoriesListProps {
  data?: Category[];
}

export default function CategoriesList({ data }: CategoriesListProps = {}) {
  const { data: response, isLoading } = useCategories();
  const categories = data && data.length > 0 ? data : response?.data || [];

  if (categories.length === 0 && isLoading) {
    return (
      <section className="py-20 md:py-28 px-4 md:px-10 bg-[#f6f3ec] border-b border-[#d2c4bc]/40" id="colecciones">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-[#d2c4bc]/30 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-4 bg-[#d2c4bc]/20 rounded w-1/2 mb-12 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
            <div className="lg:col-span-7 h-[460px] bg-[#d2c4bc]/30 rounded-2xl animate-pulse" />
            <div className="lg:col-span-5 h-[460px] bg-[#d2c4bc]/30 rounded-2xl animate-pulse" />
            <div className="lg:col-span-6 h-[380px] bg-[#d2c4bc]/30 rounded-2xl animate-pulse" />
            <div className="lg:col-span-6 h-[380px] bg-[#d2c4bc]/30 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 px-4 md:px-10 bg-[#f6f3ec] border-b border-[#d2c4bc]/40" id="colecciones">
      <div className="max-w-7xl mx-auto">
        {/* Curated Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 pb-6 border-b border-[#d2c4bc]/50">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#26170c] font-bold text-balance tracking-tight">
              Colecciones de Autor
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#725a39] font-medium tracking-wide uppercase mt-2">
              Líneas moldeadas a mano sobre hormas anatómicas
            </p>
          </div>
          <p className="font-sans text-xs md:text-sm text-[#4f453f] max-w-md text-pretty leading-relaxed">
            Desde calzado de gala y pasarela hasta siluetas de confort diario en puro cuero ecuatoriano. Selecciona una colección para descubrir los modelos confeccionados a mano.
          </p>
        </div>

        {/* Asymmetric Lookbook Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
          {categories.map((category, index) => {
            const isHeroCard = index === 0;
            const colSpanClass =
              categories.length === 4
                ? index === 0
                  ? "lg:col-span-7 md:col-span-2 min-h-[420px] lg:min-h-[480px]"
                  : index === 1
                  ? "lg:col-span-5 md:col-span-2 min-h-[420px] lg:min-h-[480px]"
                  : "lg:col-span-6 md:col-span-1 min-h-[380px]"
                : categories.length === 3
                ? index === 0
                  ? "lg:col-span-7 md:col-span-2 min-h-[440px]"
                  : "lg:col-span-5 md:col-span-1 min-h-[400px]"
                : "lg:col-span-6 min-h-[420px]";

            return (
              <Link
                key={category.id}
                href={`/catalog?categoryId=${category.documentId || category.id}`}
                className={`relative rounded-2xl overflow-hidden border border-[#d2c4bc]/70 shadow-[0_10px_30px_rgba(38,23,12,0.06)] hover:shadow-[0_20px_48px_rgba(38,23,12,0.14)] hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-end p-6 sm:p-8 lg:p-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] focus-visible:ring-offset-2 ${colSpanClass}`}
              >
                {/* Background Image with natural lighting */}
                {category.image ? (
                  <Image
                    alt={`Colección ${category.name}`}
                    src={category.image}
                    fill
                    sizes={isHeroCard ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 100vw, 50vw"}
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#ebe8e1]" />
                )}

                {/* Subtle parchment-tinted dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#26170c]/90 via-[#26170c]/40 to-transparent transition-opacity duration-300 z-10" />

                {/* Top badges bar */}
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-[#fcf9f2]/95 backdrop-blur-md text-[#26170c] text-[10px] font-sans font-semibold uppercase tracking-widest border border-[#d2c4bc]/60 shadow-2xs">
                    <span>{index === 0 ? "Colección Insignia" : `Línea N° ${String(index + 1).padStart(2, "0")}`}</span>
                  </div>

                  <span
                    className="font-display text-3xl sm:text-4xl text-[#feddb3]/30 font-light select-none group-hover:text-[#feddb3]/60 transition-colors duration-500"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content Block */}
                <div className="relative z-20">
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#fcf9f2] font-bold mb-2 text-balance leading-tight">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs sm:text-sm text-[#e5e2db] mb-5 line-clamp-2 max-w-lg leading-relaxed text-pretty font-sans font-normal">
                      {category.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-semibold text-[#feddb3] group-hover:text-white transition-colors">
                    <span>Explorar {category.name}</span>
                    <span
                      className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1.5 transition-transform duration-300"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
