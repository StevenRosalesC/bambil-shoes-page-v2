import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import CatalogGrid from "@/components/CatalogGrid";
import { getProductsAction } from "@/actions/products";
import { getCategoriesAction } from "@/actions/categories";

export const metadata: Metadata = {
  title: "Catálogo de Calzado Artesanal",
  description:
    "Descubre la colección completa de calzado artesanal para dama y caballero de Bambil Shoes. Diseños exclusivos hechos a mano en Colonche, Santa Elena.",
};

function CatalogSkeleton() {
  return (
    <div className="space-y-8 animate-pulse mt-8">
      {/* Top Bar Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#d2c4bc]/20">
        <div className="h-10 bg-[#e5e2db] rounded-lg w-32"></div>
        <div className="h-10 bg-[#e5e2db] rounded-lg w-48"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-[#f6f3ec] rounded-lg overflow-hidden h-[420px] flex flex-col justify-between p-4"
          >
            <div className="h-[250px] bg-[#e5e2db] rounded w-full mb-4"></div>
            <div className="space-y-2">
              <div className="h-5 bg-[#e5e2db] rounded w-3/4"></div>
              <div className="h-4 bg-[#e5e2db] rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-[#e5e2db] rounded w-full mt-4"></div>
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
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-24 pt-[100px] md:pt-[120px]">
        {/* Header Intro */}
        <header className="mb-12 md:mb-16 text-center md:text-left max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl text-[#26170c] mb-6 font-bold">
            Nuestra Colección
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4f453f] leading-relaxed">
            Descubre la perfecta fusión entre la artesanía tradicional y el diseño contemporáneo. Cada par de zapatos es cuidadosamente elaborado a mano utilizando los cueros más finos, asegurando confort, durabilidad y un estilo inconfundible que perdura en el tiempo.
          </p>
        </header>

        {/* Catalog Filtering Grid */}
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
