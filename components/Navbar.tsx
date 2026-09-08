"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { useGlobalInfo } from "@/providers/global-info-provider";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";

export default function Navbar() {
  const { setCartOpen, isMenuOpen, setMenuOpen } = useUIStore();
  const { getTotalItems } = useCartStore();
  const { globalInfo } = useGlobalInfo();
  const storeName = globalInfo?.storeName || "Bambil Shoes By Dario";
  const [scrolled, setScrolled] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-[#d2c4bc]/60 shadow-[0_4px_20px_rgba(112,90,76,0.06)] py-3"
          : "bg-[#fcf9f2]/90 backdrop-blur-sm border-transparent py-4"
      }`}
    >
      <div className="flex justify-between items-center px-4 md:px-10 py-1 max-w-7xl mx-auto">
        {/* Navigation Links (Hidden on Mobile and Tablets) */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] rounded"
            href="/#colecciones"
          >
            Colecciones
          </Link>
          <Link
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] rounded"
            href="/catalog"
          >
            Productos
          </Link>
          <Link
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] rounded"
            href="/#materiales"
          >
            Materiales
          </Link>
          <Link
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] rounded"
            href="/about"
          >
            Nosotros
          </Link>
          <Link
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] rounded"
            href="/contact"
          >
            Contacto
          </Link>
        </div>

        {/* Brand Logo */}
        <Link
          className="flex items-center gap-2 font-display text-base sm:text-lg lg:text-2xl font-bold text-[#26170c] tracking-tight transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c] rounded"
          href="/"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-11 lg:h-11 shrink-0">
            <Image
              src="/Logo.png"
              alt="Logo Bambil Shoes"
              fill
              sizes="(max-width: 1024px) 36px, 44px"
              className="object-contain"
              priority
            />
          </div>
          <span className="group-hover:text-[#5a4030] transition-colors whitespace-nowrap">
            {storeName}
          </span>
        </Link>

        {/* Right Links & Icons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-1 sm:space-x-2 text-[#26170c]">
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[#e5e2db] rounded-full transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
              aria-label="Abrir carrito"
            >
              <span className="material-symbols-outlined text-[#26170c] group-hover:text-[#3d2b1f] transition-colors" aria-hidden="true">
                shopping_cart
              </span>
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#725a39] text-white font-sans text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#fcf9f2] shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[#e5e2db] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
              aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <span className="material-symbols-outlined text-[#26170c]" aria-hidden="true">
                {isMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Menu Dropdown */}
      {isMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden bg-[#fcf9f2] border-t border-[#d2c4bc] px-4 py-4 space-y-3 shadow-lg">
          <Link
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2 border-b border-[#d2c4bc]/30"
            href="/#colecciones"
          >
            Colecciones
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2 border-b border-[#d2c4bc]/30"
            href="/catalog"
          >
            Productos
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2 border-b border-[#d2c4bc]/30"
            href="/#materiales"
          >
            Materiales
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2 border-b border-[#d2c4bc]/30"
            href="/about"
          >
            Nosotros
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2"
            href="/contact"
          >
            Contacto
          </Link>
        </div>
      )}
    </nav>
  );
}
