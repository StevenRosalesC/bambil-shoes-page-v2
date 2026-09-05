import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import CartDrawer from "@/components/CartDrawer";
import CatalogGrid from "@/components/CatalogGrid";

function CatalogSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-pulse">
      <div className="hidden lg:block w-64 shrink-0 space-y-8">
        <div className="h-10 bg-[#f6f3ec] rounded w-full"></div>
        <div className="h-32 bg-[#f6f3ec] rounded w-full"></div>
        <div className="h-32 bg-[#f6f3ec] rounded w-full"></div>
        <div className="h-20 bg-[#f6f3ec] rounded w-full"></div>
      </div>
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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

export default function CatalogPage() {
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
          <CatalogGrid />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Floating Action Modules */}
      <WhatsAppFAB />
      <CartDrawer />
    </div>
  );
}
