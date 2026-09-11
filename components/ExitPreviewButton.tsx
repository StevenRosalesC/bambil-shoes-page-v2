"use client";

import React, { useState } from "react";

export default function ExitPreviewButton() {
  const [loading, setLoading] = useState(false);

  const handleExit = () => {
    setLoading(true);
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/api/exit-preview?redirect=${encodeURIComponent(currentPath)}`;
  };

  return (
    <button
      type="button"
      onClick={handleExit}
      disabled={loading}
      className="ml-2 bg-[#D2B48C] hover:bg-[#c5a374] text-[#26170c] font-bold px-3 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-60"
    >
      {loading ? (
        <span>Saliendo...</span>
      ) : (
        <>
          <span>Salir</span>
          <span className="material-symbols-outlined text-sm">close</span>
        </>
      )}
    </button>
  );
}
