import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import CatalogGrid from "@/components/CatalogGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getProductsAction } from "@/actions/products";
import { getCategoriesAction } from "@/actions/categories";

export const metadata: Metadata = {
  title: "Catálogo de Calzado Artesanal",
  description:
    "Descubre la colección completa de calzado artesanal para dama y caballero de Bambil Shoes. Diseños exclusivos hechos a mano en Colonche, Santa Elena.",
};

// Revalidate catalog page every 60 seconds (1 minute)
export const revalidate = 60;

function CatalogSkeleton() {
  return (
    <div className="space-y-8 animate-pulse mt-6">
      {/* Quick-Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-hidden pb-2">
        <div className="h-10 bg-[#e5e2db] rounded-full w-28 shrink-0"></div>
        <div className="h-10 bg-[#e5e2db] rounded-full w-36 shrink-0"></div>
        <div className="h-10 bg-[#e5e2db] rounded-full w-32 shrink-0"></div>
        <div className="h-10 bg-[#e5e2db] rounded-full w-28 shrink-0"></div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/30">
        <div className="h-10 bg-[#e5e2db] rounded-lg w-full sm:w-64"></div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="h-10 bg-[#e5e2db] rounded-lg w-28"></div>
          <div className="h-10 bg-[#e5e2db] rounded-lg w-36"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-surface-container-low rounded-xl overflow-hidden h-85 sm:h-105 flex flex-col justify-between p-3 sm:p-4 border border-outline-variant/40"
          >
            <div className="aspect-3/4 sm:aspect-4/5 bg-[#e5e2db] rounded-lg w-full mb-3 sm:mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 sm:h-5 bg-[#e5e2db] rounded w-3/4"></div>
              <div className="h-3 sm:h-4 bg-[#e5e2db] rounded w-1/2"></div>
            </div>
            <div className="h-8 sm:h-10 bg-[#e5e2db] rounded w-full mt-3 sm:mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function CatalogPage() {
  const [productsRes, categoriesRes] = await Promise.all([
    getProductsAction({ limit: 100 }),
    getCategoriesAction(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] antialiased">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-16 pt-24 md:pt-29">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs className="mb-6" />

        {/* Atelier Catalog Masthead */}
        <header className="mb-10 md:mb-14 pb-8 border-b border-outline-variant/50">
          {/* Index hallmark ribbon */}
          <div className="flex items-center justify-between gap-4 text-[11px] font-sans font-semibold text-secondary uppercase tracking-[0.2em] mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" aria-hidden="true" />
              <span>Santa Elena • Taller en Colonche</span>
            </div>
            <span className="flex items-center gap-1.5 text-[#705a4c] font-medium tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
              Colección Activa 2026
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-primary font-bold tracking-tight mb-4 text-balance">
              Catálogo de Siluetas <span className="italic font-normal text-secondary">&amp; Colecciones</span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-2xl text-pretty font-normal">
              Cada par es confeccionado artesanalmente sobre hormas anatómicas y cueros genuinos seleccionados. Explora nuestras líneas activas o filtra por material para descubrir tu próxima pieza.
            </p>
          </div>
        </header>

        {/* Catalog Filtering Grid with Horizon Quick-Tabs */}
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogGrid
            initialProducts={productsRes?.data || []}
            initialCategories={categoriesRes?.data || []}
          />
        </Suspense>
      </main>
    </div>
  );
}
