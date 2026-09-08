"use client";

import React, { useState } from "react";
import { useGlobalInfo } from "@/providers/global-info-provider";

export default function WhatsAppFAB() {
  const [showBubble, setShowBubble] = useState(true);
  const { globalInfo } = useGlobalInfo();

  const rawPhoneNumber =
    globalInfo?.whatsappNumber ||
    "593993833765";
  const phoneNumber = rawPhoneNumber.replace(/\D/g, "");

  const defaultMessage =
    globalInfo?.whatsappDefaultMessage || "¡Hola! ¿En qué puedo ayudarte?";

  const whatsappUrl = defaultMessage
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`
    : `https://wa.me/${phoneNumber}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end">
      {/* Speech bubble */}
      {showBubble && (
        <div className="relative mb-3 bg-white text-[#1c1c18] font-sans text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg border border-[#d2c4bc]/40 flex items-center gap-2 max-w-[260px]">
          <span className="line-clamp-2">{defaultMessage}</span>
          <button
            type="button"
            onClick={() => setShowBubble(false)}
            className="text-[#81756e] hover:text-[#26170c] transition-colors min-w-[44px] min-h-[44px] -my-2 -mr-2 flex items-center justify-center shrink-0 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
            aria-label="Cerrar mensaje"
          >
            <span className="material-symbols-outlined text-[14px] font-bold" aria-hidden="true">close</span>
          </button>
          {/* Arrow pointing down */}
          <div className="absolute right-6 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
        </div>
      )}

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white rounded-full p-3.5 sm:p-4 min-w-[48px] min-h-[48px] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
        aria-label="Chatear en WhatsApp"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
          chat
        </span>
      </a>
    </div>
  );
}
