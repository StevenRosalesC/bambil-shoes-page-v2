"use client";

import React from "react";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesList() {
  const { data: response, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="w-full h-auto md:h-[650px] min-h-[500px] flex flex-col md:flex-row bg-[#26170c]" id="colecciones">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="w-full md:w-1/3 h-[350px] md:h-full animate-pulse bg-[#3d2b1f]/40 flex flex-col justify-end p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#3d2b1f]/30"
          >
            <div className="h-10 bg-white/10 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-1/3"></div>
          </div>
        ))}
      </section>
    );
  }

  const categories = response?.data || [];

  return (
    <section
      className="w-full h-auto md:h-[650px] min-h-[500px] flex flex-col md:flex-row bg-[#26170c]"
      id="colecciones"
    >
      {categories.map((category) => (
        <a
          key={category.id}
          className="relative w-full md:w-1/3 h-[350px] md:h-full group overflow-hidden border-b md:border-b-0 md:border-r border-[#3d2b1f]/30 block"
          href={`#productos`}
        >
          {category.image && (
            <Image
              alt={`Colección ${category.name}`}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out opacity-70 group-hover:opacity-90"
              src={category.image}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#26170c]/90 via-[#26170c]/20 to-transparent flex flex-col justify-end p-8 md:p-12 z-10">
            <h3 className="font-display text-3xl md:text-4xl text-[#fcf9f2] mb-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 font-bold">
              {category.name}
            </h3>
            <p className="text-xs text-[#e5e2db] mb-4 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 delay-75 max-w-xs font-sans leading-relaxed">
              {category.description}
            </p>
            <span className="font-sans text-xs md:text-sm font-semibold text-[#feddb3] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex items-center gap-2">
              Ver Colección{" "}
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </span>
          </div>
        </a>
      ))}
    </section>
  );
}
