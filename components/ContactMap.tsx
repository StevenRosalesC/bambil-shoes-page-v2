"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGlobalInfo } from "@/providers/global-info-provider";

export default function ContactMap() {
  const { globalInfo } = useGlobalInfo();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const latitude = globalInfo?.latitude || -1.9599131;
  const longitude = globalInfo?.longitude || -80.6548942;
  const mapsUrl = globalInfo?.googleMapsUrl || "https://maps.app.goo.gl/BCUBi3XebM3DN3nz5";
  const address = globalInfo?.address || "Santa Elena, Parroquia Colonche — Comuna Bambil Collao";
  const storeName = globalInfo?.storeName || "Bambil Shoes By Dario";

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer as shown in Leaflet quick start guide
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom branded marker icon
    const customIcon = L.divIcon({
      className: "bambil-custom-marker",
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          <div class="absolute w-9 h-9 rounded-full bg-[#725a39]/30 animate-ping"></div>
          <div class="relative w-9 h-9 rounded-full bg-[#26170c] border-2 border-[#dec1af] shadow-lg flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">location_on</span>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });

    // Create marker with popup
    const popupContent = `
      <div style="font-family: var(--font-montserrat), sans-serif; padding: 4px 2px; min-width: 190px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
          <span style="font-weight: 700; font-size: 14px; color: #26170c;">${storeName}</span>
        </div>
        <p style="font-size: 12px; color: #4f453f; line-height: 1.4; margin: 0 0 10px 0;">
          ${address}
        </p>
        <a
          href="${mapsUrl}"
          target="_blank"
          rel="noopener noreferrer"
          style="display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #ffffff; background-color: #26170c; padding: 6px 12px; border-radius: 6px; text-decoration: none; transition: background-color 0.2s;"
        >
          <span>Abrir en Google Maps</span>
          <span class="material-symbols-outlined" style="font-size: 13px;">open_in_new</span>
        </a>
      </div>
    `;

    const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    marker.bindPopup(popupContent).openPopup();

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, mapsUrl, address, storeName]);

  return (
    <div className="bg-white rounded-xl border border-[#d2c4bc]/50 shadow-[0_10px_30px_-5px_rgba(61,43,31,0.06)] overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="px-6 py-4 bg-[#f6f3ec] border-b border-[#d2c4bc]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#26170c] text-[#fcf9f2] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">storefront</span>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-[#26170c] leading-tight">
              Taller Bambil Shoes
            </h3>
            <p className="font-sans text-xs text-[#4f453f]">
              {address}
            </p>
          </div>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-sans font-semibold bg-[#26170c] hover:bg-[#3d2b1f] text-white px-4 py-2 rounded transition-all shadow-xs shrink-0"
        >
          <span className="material-symbols-outlined text-sm">directions</span>
          <span>Cómo llegar</span>
        </a>
      </div>

      {/* Leaflet Interactive Map Container */}
      <div ref={mapContainerRef} className="w-full h-[360px] z-0" />
    </div>
  );
}
