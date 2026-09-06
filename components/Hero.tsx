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
    <section className="relative w-full bg-[#fcf9f2] overflow-hidden border-b border-[#d2c4bc]/30">
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d2c4bc_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Brand Story & CTA */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            {/* Handcrafted Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0eee7] border border-[#d2c4bc]/60 mb-6 shadow-xs w-fit">
                <span className="w-2 h-2 rounded-full bg-[#725a39] animate-pulse"></span>
                <span className="font-sans text-xs font-semibold text-[#725a39] uppercase tracking-widest">
                  {badge}
                </span>
              </div>
            )}

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-[#26170c] leading-[1.12] mb-6 tracking-tight">
              {renderTitle(title)}
            </h1>

            {/* Description */}
            <p className="font-sans text-base sm:text-lg text-[#4f453f] leading-relaxed mb-8 max-w-xl">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 w-full sm:w-auto">
              <a
                href="#colecciones"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-sm font-semibold px-8 py-4 rounded shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] text-center"
              >
                <span>Explorar Colecciones</span>
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </a>
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#f6f3ec] border border-[#81756e] text-[#26170c] font-sans text-sm font-semibold px-8 py-4 rounded transition-all duration-300 text-center"
              >
                <span>Nuestra Empresa</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-[#d2c4bc]/40 grid grid-cols-3 gap-4 max-w-lg w-full text-center lg:text-left">
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#26170c]">
                  100%
                </p>
                <p className="font-sans text-xs text-[#705a4c] uppercase tracking-wider mt-0.5">
                  Artesanal
                </p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#26170c]">
                  Cuero
                </p>
                <p className="font-sans text-xs text-[#705a4c] uppercase tracking-wider mt-0.5">
                  Seleccionado
                </p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#26170c]">
                  A Medida
                </p>
                <p className="font-sans text-xs text-[#705a4c] uppercase tracking-wider mt-0.5">
                  Confort Total
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Workshop Photography Card */}
          <div className="lg:col-span-6 xl:col-span-6 relative w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto">
            {/* Background layered accent card */}
            <div className="absolute -inset-3 sm:-inset-4 bg-[#ebe8e1] rounded-2xl -z-10 shadow-[0_20px_40px_-15px_rgba(61,43,31,0.12)] translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#d2c4bc]/40 aspect-[4/3] sm:aspect-[1280/1173] bg-[#ebe8e1] group">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />

              {/* Floating artisan caption badge */}
              {(captionTitle || captionSubtitle) && (
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-lg shadow-md border border-[#d2c4bc]/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f6f3ec] flex items-center justify-center text-[#725a39] shrink-0">
                    <span className="material-symbols-outlined text-xl">
                      handyman
                    </span>
                  </div>
                  <div>
                    {captionTitle && (
                      <p className="font-display text-sm font-bold text-[#26170c] leading-tight">
                        {captionTitle}
                      </p>
                    )}
                    {captionSubtitle && (
                      <p className="font-sans text-xs text-[#4f453f]">
                        {captionSubtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

