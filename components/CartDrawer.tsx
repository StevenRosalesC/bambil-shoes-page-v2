"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { useGlobalInfo } from "@/providers/global-info-provider";

export default function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { globalInfo } = useGlobalInfo();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#26170c]/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[101] h-full w-full max-w-md bg-[#fcf9f2] border-l border-[#d2c4bc] shadow-2xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-[#d2c4bc]">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 shrink-0">
                <Image
                  src="/Logo.png"
                  alt="Logo Bambil Shoes"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#26170c]">Tu Carrito</h3>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 hover:bg-[#f0eee7] rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[#26170c]">close</span>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-[#4f453f]">
                <div className="relative w-16 h-16 mb-4 opacity-40">
                  <Image
                    src="/Logo.png"
                    alt="Logo Bambil Shoes"
                    fill
                    className="object-contain grayscale"
                  />
                </div>
                <p className="font-sans text-base">Tu carrito está vacío.</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-6 bg-[#26170c] text-white font-sans text-sm font-semibold px-6 py-3 rounded hover:bg-[#3d2b1f] transition-all"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.size}`}
                  className="flex gap-4 p-4 bg-[#f6f3ec] rounded-lg shadow-sm border border-[#d2c4bc]/30"
                >
                  <Link
                    href={`/product/${item.product.slug || item.product.documentId || item.product.id}`}
                    onClick={() => setCartOpen(false)}
                    className="relative w-20 h-20 shrink-0 rounded overflow-hidden bg-[#e5e2db] block hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${item.product.slug || item.product.documentId || item.product.id}`}
                        onClick={() => setCartOpen(false)}
                        className="font-display text-base font-semibold text-[#26170c] hover:text-[#725a39] transition-colors line-clamp-1 block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="font-sans text-xs text-[#4f453f] mt-0.5">
                        Talla: {item.variant.size} | {item.product.material?.name || "Cuero Genuino"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-[#d2c4bc] rounded bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.variant.size, item.quantity - 1)
                          }
                          className="px-2.5 py-1 hover:bg-[#f0eee7] text-[#26170c] text-sm font-semibold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-sans text-sm text-[#26170c] font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.variant.size, item.quantity + 1)
                          }
                          className="px-2.5 py-1 hover:bg-[#f0eee7] text-[#26170c] text-sm font-semibold transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-sans text-sm font-bold text-[#26170c]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.variant.size)}
                    className="self-start text-[#4f453f] hover:text-[#ba1a1a] transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#d2c4bc] bg-[#f6f3ec]">
              <div className="flex justify-between items-center mb-6">
                <span className="font-sans text-base text-[#4f453f]">Total:</span>
                <span className="font-sans text-xl font-bold text-[#26170c]">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const orderSummary = items
                      .map(
                        (item) =>
                          `- ${item.product.name} (Talla: ${item.variant.size}) x${item.quantity}: $${(
                            item.product.price * item.quantity
                          ).toFixed(2)}`
                      )
                      .join("\n");
                    const storeName = globalInfo?.storeName || "Bambil Shoes";
                    const text = encodeURIComponent(
                      `¡Hola ${storeName}! Quisiera realizar un pedido:\n\n${orderSummary}\n\n*Total: $${getTotalPrice().toFixed(
                        2
                      )}*`
                    );
                    const rawPhoneNumber =
                      globalInfo?.whatsappNumber ||
                      "593993833765";
                    const phoneNumber = rawPhoneNumber.replace(/\D/g, "");
                    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
                  }}
                  className="w-full bg-[#26170c] text-white font-sans text-sm font-semibold py-4 rounded hover:bg-[#3d2b1f] transition-all duration-300 shadow-md flex justify-center items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">shopping_cart_checkout</span>
                  Proceder a Comprar via WhatsApp
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-transparent border border-[#81756e] text-[#4f453f] font-sans text-xs font-medium py-2 rounded hover:bg-[#f0eee7] transition-all"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
