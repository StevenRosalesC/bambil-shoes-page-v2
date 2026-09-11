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
          style="display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #ffffff; background-color: #26170c; padding: 6px 12px; border-radius: 6px; text-decoration: none; transition: background-color 0.2s;"
        >
          <span>Abrir en Google Maps</span>
          <span class="material-symbols-outlined" style="font-size: 14px;">open_in_new</span>
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
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xs shadow-xs overflow-hidden flex flex-col">
      {/* Workshop Map Header Bar */}
      <div className="px-6 sm:px-8 py-5 bg-surface-container-low border-b border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xs bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-xl">storefront</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-primary leading-tight">
                Taller Artesanal Bambil Shoes
              </h3>
              <span className="text-xs font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-secondary-container text-on-secondary-container">
                Colonche
              </span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant mt-0.5">
              {address}
            </p>
          </div>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-wider font-bold bg-primary hover:bg-primary-container text-on-primary px-5 py-3 rounded-xs transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">directions</span>
          <span>Abrir en Google Maps</span>
        </a>
      </div>

      {/* Leaflet Interactive Map Container */}
      <div ref={mapContainerRef} className="w-full h-[380px] sm:h-[440px] z-0" />
    </div>
  );
}
