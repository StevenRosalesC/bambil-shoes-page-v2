import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import CartDrawer from "@/components/CartDrawer";
import CatalogGrid from "@/components/CatalogGrid";

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
        <CatalogGrid />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Floating Action Modules */}
      <WhatsAppFAB />
      <CartDrawer />
    </div>
  );
}
