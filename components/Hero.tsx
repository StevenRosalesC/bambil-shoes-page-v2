import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomePageData } from "@/types/HomePage";

export interface HeroProps {
  data?: HomePageData | null;
  heroBadge?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: HomePageData["heroImage"] | string | null;
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroCaptionTitle?: string;
  heroCaptionSubtitle?: string;
}

const resolveImageUrl = (url?: string | null): string => {
  if (!url) return "/images/hero.jpeg";
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

const renderTitle = (text: string) => {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);

  if (words.length <= 2) {
    return (
      <span className="italic font-normal text-[#725a39]">
        {trimmed}
      </span>
    );
  }

  const mainPart = words.slice(0, -2).join(" ");
  const lastTwoWords = words.slice(-2).join(" ");

  return (
    <>
      {mainPart}{" "}
      <span className="italic font-normal text-[#725a39]">
        {lastTwoWords}
      </span>
    </>
  );
};

export default function Hero({
  data,
  heroBadge,
  heroTitle,
  heroDescription,
  heroImage,
  heroImageUrl,
  heroImageAlt,
  heroCaptionTitle,
  heroCaptionSubtitle,
}: HeroProps = {}) {
  const badge =
    heroBadge ??
    data?.heroBadge ??
    "Calzado Hecho a Mano • Santa Elena • Colonche";

  const title =
    heroTitle ??
    data?.heroTitle ??
    "Artesanía que se siente en cada paso";

  const description =
    heroDescription ??
    data?.heroDescription ??
    "Descubre la fusión perfecta entre la robustez del cuero natural y la elegancia del diseño a medida. Cada par cuenta una historia de dedicación, confort y maestría ecuatoriana.";

  const rawImageUrl =
    heroImageUrl ??
    (typeof heroImage === "string" ? heroImage : heroImage?.url) ??
    data?.heroImage?.url;

  const imageUrl = resolveImageUrl(rawImageUrl);

  const imageAlt =
    heroImageAlt ??
    (typeof heroImage === "object" ? heroImage?.alternativeText : undefined) ??
    data?.heroImageAlt ??
    data?.heroImage?.alternativeText ??
    "Maestro artesano Darío Catuto confeccionando calzado en su taller";

  const captionTitle =
    heroCaptionTitle ??
    data?.heroCaptionTitle ??
    "Darío Catuto en el Taller";

  const captionSubtitle =
    heroCaptionSubtitle ??
    data?.heroCaptionSubtitle ??
    "Confección manual de cada par en Santa Elena";

  return (
    <section className="relative w-full bg-[#fcf9f2] overflow-hidden border-b border-[#d2c4bc]/40 pt-6 pb-20 md:pb-28">
      {/* Subtle fine atelier dot grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#d2c4bc_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        {/* 1. Atelier Masthead Index Ribbon */}
        <div className="flex items-center justify-between gap-4 text-[11px] font-sans font-semibold text-[#725a39] uppercase tracking-[0.22em] pb-5 mb-10 md:mb-14 border-b border-[#d2c4bc]/50 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#725a39]" aria-hidden="true" />
            <span>{badge}</span>
          </div>
          <span className="text-[#26170c] font-display text-sm tracking-normal normal-case font-bold hidden sm:inline">
            Bambil Shoes By Dario
          </span>
          <span className="flex items-center gap-1.5 text-[#705a4c] font-medium tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
            Taller Activo en Colonche
          </span>
        </div>

        {/* 2. Grand Magazine Display Headline */}
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[4.8rem] font-bold text-[#26170c] leading-[1.05] tracking-tight mb-6 text-balance">
            {renderTitle(title)}
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-xl text-[#4f453f] leading-relaxed max-w-2xl mx-auto text-pretty font-normal">
            {description}
          </p>
        </div>

        {/* 3. Immersive Cinematic Atelier Canvas */}
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-[#d2c4bc]/70 shadow-[0_24px_60px_-15px_rgba(38,23,12,0.18)] mb-14 md:mb-18 bg-[#ebe8e1]">
          {/* Main Visual Window (Expansive Aspect) */}
          <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] w-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-[center_35%]"
            />

            {/* Subtle atmospheric vignette gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#26170c]/90 via-[#26170c]/25 to-transparent pointer-events-none" />

            {/* Top overlay stamps */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-20 pointer-events-none">
              <span className="px-3.5 py-1.5 rounded-full bg-[#fcf9f2]/90 backdrop-blur-md text-[#26170c] text-[10px] font-sans font-semibold uppercase tracking-widest border border-[#d2c4bc]/60 shadow-md">
                Pieza a Medida • Hecho a Mano
              </span>
            </div>

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:flex items-center gap-2 z-20 pointer-events-none">
              <span className="px-3.5 py-1.5 rounded-full bg-[#26170c]/85 text-[#feddb3] backdrop-blur-md text-[10px] font-sans font-semibold uppercase tracking-widest border border-[#feddb3]/30 shadow-md flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-[#feddb3]" aria-hidden="true">verified</span>
                Santa Elena • Taller N° 1
              </span>
            </div>

            {/* Bottom floating atelier badge inside the canvas */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-20">
              <div className="max-w-md bg-[#fcf9f2]/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-[#d2c4bc]/70 shadow-lg">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-9 h-9 rounded-lg bg-[#26170c] flex items-center justify-center text-[#feddb3] shrink-0 shadow-inner">
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">handyman</span>
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-[#26170c] leading-tight">
                      {captionTitle}
                    </p>
                    <p className="font-sans text-xs text-[#705a4c]">
                      {captionSubtitle}
                    </p>
                  </div>
                </div>
                <p className="font-sans text-xs text-[#4f453f] leading-relaxed pt-2 border-t border-[#d2c4bc]/40 mt-2 text-pretty">
                  Darío Catuto confecciona cada molde artesanalmente, garantizando equilibrio, confort y la nobleza del cuero genuino.
                </p>
              </div>

              {/* Direct Quick Action inside Canvas for High Visual Impact */}
              <div className="flex items-center gap-3">
                <a
                  href="#colecciones"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#feddb3] hover:bg-white text-[#26170c] font-sans text-xs sm:text-sm font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Explorar Colecciones 2026</span>
                  <span className="material-symbols-outlined text-sm sm:text-base transition-transform group-hover:translate-x-1" aria-hidden="true">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Atelier Ground Curation Rail (3 Narrative Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-6 border-t border-[#d2c4bc]/50 text-left">
          {/* Column 1: Origin */}
          <div className="bg-[#f6f3ec] p-5 sm:p-6 rounded-xl border border-[#d2c4bc]/50 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-sans font-semibold text-[#725a39] uppercase tracking-widest block mb-2">
                01 • Origen & Oficio
              </span>
              <h3 className="font-display text-lg font-bold text-[#26170c] mb-2 text-balance">
                Artesanía de Santa Elena
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#4f453f] leading-relaxed text-pretty">
                Sin líneas industriales de ensamblaje. Cada zapato nace en el taller de Colonche con técnicas tradicionales de corte y costura.
              </p>
            </div>
          </div>

          {/* Column 2: Materials */}
          <div className="bg-[#f6f3ec] p-5 sm:p-6 rounded-xl border border-[#d2c4bc]/50 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-sans font-semibold text-[#725a39] uppercase tracking-widest block mb-2">
                02 • Nobleza de Materiales
              </span>
              <h3 className="font-display text-lg font-bold text-[#26170c] mb-2 text-balance">
                Cuero Natural & Pátina
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#4f453f] leading-relaxed text-pretty">
                Seleccionamos cueros de grano completo que respiran y se adaptan a tu silueta, envejeciendo con elegancia y carácter único.
              </p>
            </div>
          </div>

          {/* Column 3: Customization & CTA */}
          <div className="bg-[#26170c] text-white p-5 sm:p-6 rounded-xl border border-[#3d2b1f] shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-sans font-semibold text-[#feddb3] uppercase tracking-widest block mb-2">
                03 • Confección Exclusiva
              </span>
              <h3 className="font-display text-lg font-bold text-[#fcf9f2] mb-2 text-balance">
                Calzado Bajo Pedido
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#e5e2db]/90 leading-relaxed text-pretty mb-4">
                ¿Buscas una talla especial o diseño a medida? Conversa directamente con el maestro artesano.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-sans font-bold text-[#feddb3] hover:text-white transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#feddb3] rounded w-fit"
            >
              <span>Conocer la historia de Darío</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

