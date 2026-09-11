"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { SocialPostData } from "@/types/SocialPost";
import { useGlobalInfo } from "@/providers/global-info-provider";

export interface InstagramFeedProps {
  items?: SocialPostData[];
  instagramUrl?: string;
}

const resolveImageUrl = (url?: string | null): string => {
  if (!url) return "/images/instagramImages/01.jpg";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/uploads")) {
    const strapiBase =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    return `${strapiBase}${url}`;
  }
  return url;
};

const DEFAULT_POSTS: SocialPostData[] = [
  {
    image: {
      url: "/images/instagramImages/01.jpg",
      alternativeText:
        "Una noche llena de elegancia, belleza y grandes momentos en el Miss Ecuador 2026",
    },
    alt: "Una noche llena de elegancia, belleza y grandes momentos en el Miss Ecuador 2026",
    url: "https://www.instagram.com/p/DcrZSz5G5O6",
    displayOrder: 1,
    isActive: true,
  },
  {
    image: {
      url: "/images/instagramImages/02.jpg",
      alternativeText: "Una noche para recordar",
    },
    alt: "Una noche para recordar",
    url: "https://www.instagram.com/p/DcrYf3hm5bH",
    displayOrder: 2,
    isActive: true,
  },
  {
    image: {
      url: "/images/instagramImages/03.jpg",
      alternativeText: "Los mejores diseños solo en Bambil Shoes",
    },
    alt: "Los mejores diseños solo en Bambil Shoes",
    url: "https://www.instagram.com/p/DZwD8c1NynY",
    displayOrder: 3,
    isActive: true,
  },
  {
    image: {
      url: "/images/instagramImages/04.jpg",
      alternativeText: "Dali Model y Asesora de Reina 👸 y Bambil Shoes",
    },
    alt: "Dali Model y Asesora de Reina 👸 y Bambil Shoes",
    url: "https://www.instagram.com/p/DZaQWL2yVTo",
    displayOrder: 4,
    isActive: true,
  },
];

export default function InstagramFeed({ items, instagramUrl }: InstagramFeedProps = {}) {
  const { globalInfo } = useGlobalInfo();
  const feedItems = items && items.length > 0 ? items : DEFAULT_POSTS;
  const targetInstagramUrl =
    instagramUrl ||
    globalInfo?.instagramUrl ||
    "https://www.instagram.com/bambil_shoes_oficial";

  return (
    <section className="py-24 px-4 md:px-10 bg-[#f6f3ec]" id="instagram">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="material-symbols-outlined text-[#725a39] text-4xl mb-4" aria-hidden="true">
            photo_camera
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-[#26170c] mb-2 font-semibold text-balance">
            #PasosConHistoria
          </h2>
          <p className="font-sans text-sm md:text-base text-[#4f453f] max-w-lg text-pretty">
            Nuestros diseños, tu estilo de vida. Etiquétanos para aparecer en
            nuestra galería.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {feedItems.map((item, index) => {
            const imageUrl = resolveImageUrl(item.image?.url);
            const isOffset = index % 2 === 1;

            return (
              <div
                key={item.id || item.url || index}
                className={`aspect-square bg-[#e5e2db] rounded-xl overflow-hidden relative group cursor-pointer shadow-xs hover:shadow-lg transition-all duration-500 border border-[#d2c4bc]/40 hover:border-[#725a39]/40 ${
                  isOffset ? "mt-0 md:mt-8" : ""
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={item.alt || item.image?.alternativeText || "Instagram post"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#26170c]/85 via-[#26170c]/40 to-transparent backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 z-10">
                  <div className="flex justify-end">
                    <span className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white/90">
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">
                        open_in_new
                      </span>
                    </span>
                  </div>
                  <div>
                    {item.alt && (
                      <p className="font-sans text-xs text-[#fcf9f2] line-clamp-2 leading-tight mb-2.5 text-pretty">
                        {item.alt}
                      </p>
                    )}
                    <Link
                      href={item.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver publicación en Instagram: ${item.alt || item.image?.alternativeText || "calzado artesanal"}`}
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#feddb3] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded py-0.5"
                    >
                      <span className="material-symbols-outlined text-sm text-[#feddb3]" aria-hidden="true">favorite</span>
                      <span>Ver en Instagram</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            className="inline-flex items-center gap-2 font-sans text-xs md:text-sm font-semibold text-[#26170c] border-b border-[#26170c] pb-1 hover:text-[#725a39] hover:border-[#725a39] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
            href={targetInstagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Síguenos en @BambilShoes{" "}
            <span className="material-symbols-outlined text-sm font-bold" aria-hidden="true">
              open_in_new
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

