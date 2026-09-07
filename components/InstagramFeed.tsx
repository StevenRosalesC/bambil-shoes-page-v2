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
          <span className="material-symbols-outlined text-[#725a39] text-4xl mb-4">
            photo_camera
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-[#26170c] mb-2 font-semibold">
            #PasosConHistoria
          </h2>
          <p className="font-sans text-sm md:text-base text-[#4f453f]">
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
                className={`aspect-square bg-[#e5e2db] rounded overflow-hidden relative group cursor-pointer shadow-sm ${
                  isOffset ? "mt-0 md:mt-8" : ""
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={item.alt || item.image?.alternativeText || "Instagram post"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#26170c]/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={item.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-white text-3xl">
                      favorite
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            className="inline-flex items-center gap-2 font-sans text-xs md:text-sm font-semibold text-[#26170c] border-b border-[#26170c] pb-1 hover:text-[#725a39] hover:border-[#725a39] transition-colors"
            href={targetInstagramUrl}
            target="_blank"
          >
            Síguenos en @BambilShoes{" "}
            <span className="material-symbols-outlined text-sm font-bold">
              open_in_new
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

