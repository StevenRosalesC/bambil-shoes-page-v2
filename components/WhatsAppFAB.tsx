"use client";

import React, { useState } from "react";

export default function WhatsAppFAB() {
  const [showBubble, setShowBubble] = useState(true);
  const rawPhoneNumber =
    process.env.NEXT_PUBLIC_ENTERPRISE_PHONE_NUMBER ||
    process.env.NEXT_PUBLIC_ENTERPRICE_PHONE_NUMBER ||
    "573009998877";
  const phoneNumber = rawPhoneNumber.replace(/\D/g, "");

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Speech bubble */}
      {showBubble && (
        <div className="relative mb-3 bg-white text-[#1c1c18] font-sans text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg border border-[#d2c4bc]/40 flex items-center gap-2">
          <span>¡Hola! ¿En qué puedo ayudarte?</span>
          <button
            onClick={() => setShowBubble(false)}
            className="text-[#81756e] hover:text-[#26170c] transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[14px] font-bold">close</span>
          </button>
          {/* Arrow pointing down */}
          <div className="absolute right-6 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
        </div>
      )}

      {/* Button */}
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white rounded-full p-4 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
        aria-label="Chatear en WhatsApp"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          chat
        </span>
      </a>
    </div>
  );
}
