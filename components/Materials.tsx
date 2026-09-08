import React from "react";
import Image from "next/image";
import type { MaterialData } from "@/types/Material";

export interface MaterialsProps {
  data?: MaterialData[];
}

const resolveImageUrl = (url?: string | null): string => {
  if (!url) return "";
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

const DEFAULT_MATERIALS: MaterialData[] = [
  {
    name: "Cueros Naturales",
    icon: "verified",
    description:
      "Pátina que mejora con el tiempo. Nuestros cueros de grano completo ofrecen una transpirabilidad superior y se adaptan a la forma de tu pie, creando una experiencia verdaderamente personalizada.",
    textureImage: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG50EtqMj6Op2bKTOf6FDZ51JEboFi8YjD1xiTVf113FGapmgkUg3eAPB0OCWxpmgfimSYJABI3u07rvbBrMSOMTGoPZM5z4Ie8O6pQafoD1zgHoyTSZNCUny-Z4huNBDodL0g4b1w7R3S2WfNYN0WT7COy9ct_nYdw-K9QUtk8GmcSYQ1yCmmH3OpiWtz9Cp-fE0FsjJhfGO6pWJZEsetCzZIy6p63iS-aDX6X3PZt1XOBuL6LJFiQ6d7zK3393rfXFGlsRJE5vHj",
      alternativeText: "Textura de Cuero Natural",
    },
    benefits: [
      { text: "Mayor durabilidad" },
      { text: "Envejecimiento elegante" },
    ],
  },
  {
    name: "Sintéticos Premium",
    icon: "eco",
    description:
      "Innovación para el ritmo moderno. Alternativas de alta gama que replican la sensación del cuero con ventajas adicionales de resistencia al agua y mantenimiento mínimo.",
    textureImage: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgrhfEpVASo6ALK6_GZLr4qQsaW222zmPs6feQ_mS5sb0Sqva-PCmN79iifgrkZx8bPvD2rCIdIxfJM31XCV9VmIXSjLD2cI4dyUpQZH6op8YMcuL8tyeuvnRgYoJABZSvf4Kal6oWSxtYChsztzGnaTT5vDt2IQ66l5iWEE8MyvkOIscX5FYECI_WOROjfzS_CIBJgibHLsT2UB6RpYaGlKLdXCWjJzWaZcFNgy2EqlNz6-AjocyT3iWOc82e0TA_3JfH2yE4GU1l",
      alternativeText: "Textura Sintética Premium",
    },
    benefits: [
      { text: "Resistencia al clima" },
      { text: "Limpieza sencilla" },
    ],
  },
];

export default function Materials({ data }: MaterialsProps = {}) {
  const materials = data && data.length > 0 ? data : DEFAULT_MATERIALS;

  return (
    <section className="py-24 px-4 md:px-10 bg-[#fcf9f2]" id="materiales">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-[#26170c] mb-4 font-semibold text-balance">
            El Alma de Nuestro Calzado
          </h2>
          <p className="font-sans text-sm md:text-base text-[#4f453f] max-w-2xl mx-auto text-pretty">
            Seleccionamos meticulosamente cada pieza de cuero, asegurando que la
            belleza visual esté respaldada por una durabilidad inquebrantable.
            Conoce nuestros materiales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {materials.map((mat, index) => {
            const fallbackImage =
              DEFAULT_MATERIALS[index % DEFAULT_MATERIALS.length]?.textureImage
                ?.url || "";
            const imageUrl = resolveImageUrl(
              mat.textureImage?.url || fallbackImage
            );
            const isAlternate = index % 2 === 1;

            return (
              <div
                key={mat.id || mat.name}
                className="bg-[#f6f3ec] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-[0_8px_30px_rgba(112,90,76,0.06)] hover:shadow-[0_16px_36px_rgba(112,90,76,0.12)] border border-[#d2c4bc]/40 hover:border-[#d2c4bc] hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-full md:w-1/2 h-64 rounded-lg overflow-hidden relative border border-[#d2c4bc]/40 shadow-xs ${
                    isAlternate ? "order-first md:order-last" : ""
                  }`}
                >
                  {imageUrl ? (
                    <Image
                      alt={mat.textureImage?.alternativeText || mat.name}
                      className="object-cover"
                      src={imageUrl}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e5e2db] flex items-center justify-center text-[#725a39]">
                      <span className="material-symbols-outlined text-4xl" aria-hidden="true">
                        {mat.icon || "texture"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0eee7] border border-[#d2c4bc]/60 text-[10px] font-sans font-semibold text-[#725a39] uppercase tracking-wider mb-2.5 w-fit">
                      <span>{index === 0 ? "Selección Tradicional" : "Innovación y Confort"}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-[#725a39]">
                      <span className="material-symbols-outlined text-xl" aria-hidden="true">
                        {mat.icon || "verified"}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl text-[#26170c] font-semibold text-balance">
                        {mat.name}
                      </h3>
                    </div>
                    <p className="font-sans text-xs md:text-sm text-[#4f453f] mb-5 leading-relaxed text-pretty">
                      {mat.description}
                    </p>
                  </div>

                  {mat.benefits && mat.benefits.length > 0 && (
                    <ul className="space-y-2.5 pt-3 border-t border-[#d2c4bc]/40">
                      {mat.benefits.map((benefit, i) => (
                        <li
                          key={benefit.id || i}
                          className="flex items-center gap-2.5 font-sans text-xs md:text-sm text-[#26170c] font-medium"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#feddb3]/60 text-[#725a39] flex items-center justify-center shrink-0 shadow-2xs" aria-hidden="true">
                            <span className="material-symbols-outlined text-xs font-bold">check</span>
                          </span>
                          <span>{benefit.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

