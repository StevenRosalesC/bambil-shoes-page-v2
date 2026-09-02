"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";

export default function Navbar() {
  const { setCartOpen, isMenuOpen, setMenuOpen } = useUIStore();
  const { getTotalItems } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
          ? "bg-[#ffffff] border-[#d2c4bc] shadow-md py-3"
          : "bg-[#fcf9f2] border-transparent py-4"
      }`}
    >
      <div className="flex justify-between items-center px-4 md:px-10 py-1 max-w-7xl mx-auto">
        {/* Navigation Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors"
            href="/#colecciones"
          >
            Colecciones
          </a>
          <a
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors"
            href="/catalog"
          >
            Productos
          </a>
          <a
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors"
            href="/#materiales"
          >
            Materiales
          </a>
          <a
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors"
            href="/about"
          >
            Nosotros
          </a>
          <a
            className="font-sans text-sm font-semibold text-[#4f453f] hover:text-[#26170c] transition-colors"
            href="/contact"
          >
            Contacto
          </a>
        </div>

        {/* Brand Logo */}
        <a
          className="font-display text-xl md:text-2xl font-bold text-[#26170c] tracking-tight transition-all duration-300"
          href="/"
        >
          Bambil Shoes By Dario
        </a>

        {/* Right Links & Icons */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-[#26170c]">
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-[#e5e2db] rounded-full transition-colors group"
              aria-label="Abrir carrito"
            >
              <span className="material-symbols-outlined text-[#26170c] group-hover:text-[#3d2b1f] transition-colors">
                shopping_cart
              </span>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#725a39] text-white font-sans text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#fcf9f2] shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-[#e5e2db] rounded-full transition-colors"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-[#26170c]">
                {isMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#fcf9f2] border-t border-[#d2c4bc] px-4 py-4 space-y-3 shadow-lg">
          <a
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2 border-b border-[#d2c4bc]/30"
            href="/#colecciones"
          >
            Colecciones
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2 border-b border-[#d2c4bc]/30"
            href="/catalog"
          >
            Productos
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2 border-b border-[#d2c4bc]/30"
            href="/#materiales"
          >
            Materiales
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2 border-b border-[#d2c4bc]/30"
            href="/about"
          >
            Nosotros
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-base font-semibold text-[#4f453f] hover:text-[#26170c] py-2"
            href="/contact"
          >
            Contacto
          </a>
        </div>
      )}
    </nav>
  );
}
