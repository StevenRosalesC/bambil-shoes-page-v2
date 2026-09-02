"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import CartDrawer from "@/components/CartDrawer";

export default function NotFound() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / 80;
      const y = (e.clientY - window.innerHeight / 2) / 80;
      setCoords({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] antialiased overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative flex-grow min-h-[75vh] flex items-center justify-center py-16 px-4 pt-[100px]">
        {/* Parallax Background Cobbler Workspace */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply md:opacity-60 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${coords.x}px, ${coords.y}px)`,
          }}
        >
          <div className="w-full h-full max-w-7xl mx-auto">
            <img
              alt="Mesa de herramientas de artesano"
              className="w-full h-full object-cover rounded-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLGRaDh4Wj-j-Gttvwukv_88d5jQRpMeIJfHiz5tc0USnnaqP3yLFISuQ2V5fNIv0jRiKW2s-FwF6ZIzaNGTYxrDn_EjmWJYKwNueIhZ-paljhds8Z9PpvLUlKIYJkFe9BUxRgxjD18mg3ztLtqnJCRhf01MIZg6SYCPb-K9Muc1hhnc694I9uCMPgKFzzhr9o4DnTiwd-gZ8PrABvjYq_HO74z0MhE2pUA3SZJ_5WR6GeuMWc9aEDUIFNOQJxuDPQoRB8BFOu7978"
            />
          </div>
        </div>

        {/* Content Box with Backdrop Glassmorphism */}
        <div className="relative z-10 max-w-2xl w-full text-center space-y-8 p-8 md:p-12 bg-[#fcf9f2]/30 backdrop-blur-xl border border-[#d2c4bc]/30 rounded-lg shadow-xl mx-auto">
          <div className="relative pt-6">
            <span className="font-display text-[90px] md:text-[140px] leading-none text-[#26170c]/5 select-none absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none font-bold">
              404
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-[#26170c] font-bold">
              Parece que este camino no lleva a ninguna parte
            </h2>
            <p className="font-sans text-sm md:text-base text-[#4f453f] max-w-lg mx-auto mt-4 leading-relaxed">
              Incluso los mejores artesanos a veces pierden el rumbo. Permítenos guiarte de vuelta a nuestra colección.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              className="w-full sm:w-auto px-8 py-4 bg-[#3d2b1f] hover:bg-[#26170c] text-white font-sans text-sm font-semibold rounded hover:shadow-lg transition-all active:scale-95 text-center"
              href="/"
            >
              Volver al Inicio
            </a>
            <a
              className="w-full sm:w-auto px-8 py-4 border border-[#81756e] text-[#26170c] font-sans text-sm font-semibold rounded hover:bg-[#f6f3ec] transition-all active:scale-95 text-center"
              href="/catalog"
            >
              Explorar Catálogo
            </a>
          </div>

          {/* Micro-interaction hand tool decoration */}
          <div className="pt-8 flex justify-center items-center gap-2 text-[#725a39]/40">
            <div className="h-[1px] w-12 bg-[#725a39]/20"></div>
            <span className="material-symbols-outlined text-[18px]">handyman</span>
            <div className="h-[1px] w-12 bg-[#725a39]/20"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Elements */}
      <WhatsAppFAB />
      <CartDrawer />
    </div>
  );
}
