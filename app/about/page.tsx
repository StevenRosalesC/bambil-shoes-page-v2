import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { getAboutPageAction } from "@/actions/about";
import { getMaterialsAction } from "@/actions/materials";
import { getGlobalInfoAction } from "@/actions/global";
import type { CorporateValue, ManufacturingStep } from "@/types/AboutPage";
import type { MaterialData } from "@/types/Material";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Bambil Shoes By Dario",
  description:
    "Conoce la historia, misión, visión y el proceso artesanal de calzado de Bambil Shoes By Dario.",
};

const resolveImageUrl = (url?: string | null, fallback = ""): string => {
  if (!url || typeof url !== "string" || url.trim() === "") return fallback;
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

const DEFAULT_CORPORATE_VALUES: CorporateValue[] = [
  {
    title: "Honestidad",
    description: "Ser recto y veraz en todo acto.",
    icon: "verified",
  },
  {
    title: "Compromiso asociativo y empresarial",
    description:
      "Sincronizar objetivos personales con las metas organizacionales.",
    icon: "handshake",
  },
  {
    title: "Lealtad",
    description:
      "Actitud de profundo compromiso de una persona a una organización.",
    icon: "loyalty",
  },
  {
    title: "Responsabilidad social y empresarial",
    description: "Asumir y aceptar las consecuencias.",
    icon: "volunteer_activism",
  },
  {
    title: "Trabajo en equipo",
    description:
      "Mantener los objetivos comunes, tareas definidas, procesos claros y una buena relación que lleven a un alto grado de cooperación y buenos resultados a la organización.",
    icon: "groups",
  },
];

const DEFAULT_MANUFACTURING_STEPS: ManufacturingStep[] = [
  {
    stepNumber: 1,
    title: "1. Corte Preciso",
    description:
      "Seleccionamos las mejores partes de cada piel, asegurando que la flor del material sea impecable antes de realizar el primer corte manual.",
    image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmMCSqNiGaJello7QedMQ74f8guO8HMVhPj0XQEUQ1rbFKWRfFqfGXdQSuaX3b_BWNYgo-oAoInmTqdbI70gWZFy11aj7KbYqycqc9CdJoh0P45GTqu5Vui8yIAdFEZYfLIUlRRvuDtGTRokIaQmUHzFS_fVGP4hGiAPlssjotJrnwA6wpIDvnUoIg2rNHwI0RXav0yKbKRlNXQ-ZT1LMBSgcxiJnbKSVenWp0iH2QBe6DiWG7tNyEntAuY46tcR45q_aUKWGOWeWF",
      alternativeText: "Corte artesanal preciso de cuero",
    },
  },
  {
    stepNumber: 2,
    title: "2. Ensamblaje",
    description:
      "Unimos las piezas con hilos de alta resistencia, empleando técnicas de costura tradicionales que garantizan la durabilidad de por vida.",
    image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFyBlki9sLXWr-aa-gBDKrn_5WHBF4si9YeShOvkoEkg2BsdT-g08aPaxwoiP3EtFE99xAwerejHhMafK024H5vgnGUzIp6NwzHin05bQyIcOiihFa7tr4I5jP7xOJPkLh2_xQfoEWDBhIjpPzeWV3nJMWG8UGgYrVGggE8_FTz3gbZ5zfnnH8zmSq1sX88lkX7c9WBEeCwbR8tSWe7gfymngeHGFMs94K8xzlqsbMcEJj8nEforwqbAbfIH3PxlcfMzaTinw09agK",
      alternativeText: "Costura tradicional y ensamblado de calzado",
    },
  },
  {
    stepNumber: 3,
    title: "3. Acabado Final",
    description:
      "El pulido manual con ceras naturales resalta la pátina única de cada zapato, otorgándole ese carácter distintivo y elegante de Bambil.",
    image: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkZTCfoMYFYHnJNLtSaD1U_X5rYM6TQlsjay-y5tiQ5ZslI5V6R8MxutJ5PuKhQ21F8kM2l662srAUF3t92wpMCYLFL2WABDoyKUttPboSM45YB89EPAqdCV6vp_S9B9bfRxGYhAU9yMKzW1QPE54NQxzrIUkf01m0he-mNb3EOaDOWrsuODK01WgPfBc7hAaODZPrNj89fRnp_I3vikY6iDfWDatEQDQvlB42uPN-t8Hq6t3nB43bAtrqi-CAiKcz8lZ1XRZStwM3",
      alternativeText: "Pulido y brillo con ceras naturales",
    },
  },
];

const DEFAULT_MATERIALS: Partial<MaterialData>[] = [
  {
    name: "Cueros Naturales",
    description:
      "Pátina que mejora con el tiempo. Nuestros cueros de grano completo ofrecen una transpirabilidad superior y se adaptan a la forma de tu pie, creando una experiencia verdaderamente personalizada.",
    icon: "verified",
    textureImage: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG50EtqMj6Op2bKTOf6FDZ51JEboFi8YjD1xiTVf113FGapmgkUg3eAPB0OCWxpmgfimSYJABI3u07rvbBrMSOMTGoPZM5z4Ie8O6pQafoD1zgHoyTSZNCUny-Z4huNBDodL0g4b1w7R3S2WfNYN0WT7COy9ct_nYdw-K9QUtk8GmcSYQ1yCmmH3OpiWtz9Cp-fE0FsjJhfGO6pWJZEsetCzZIy6p63iS-aDX6X3PZt1XOBuL6LJFiQ6d7zK3393rfXFGlsRJE5vHj",
      alternativeText: "Muestrario de cuero natural de grano fino",
    },
    benefits: [
      { text: "Mayor durabilidad" },
      { text: "Envejecimiento elegante" },
    ],
  },
  {
    name: "Sintéticos Premium",
    description:
      "Innovación para el ritmo moderno. Alternativas de alta gama que replican la sensación del cuero con ventajas adicionales de resistencia al agua y mantenimiento mínimo.",
    icon: "eco",
    textureImage: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgrhfEpVASo6ALK6_GZLr4qQsaW222zmPs6feQ_mS5sb0Sqva-PCmN79iifgrkZx8bPvD2rCIdIxfJM31XCV9VmIXSjLD2cI4dyUpQZH6op8YMcuL8tyeuvnRgYoJABZSvf4Kal6oWSxtYChsztzGnaTT5vDt2IQ66l5iWEE8MyvkOIscX5FYECI_WOROjfzS_CIBJgibHLsT2UB6RpYaGlKLdXCWjJzWaZcFNgy2EqlNz6-AjocyT3iWOc82e0TA_3JfH2yE4GU1l",
      alternativeText: "Muestrario de material sintético de alta resistencia",
    },
    benefits: [
      { text: "Resistencia al clima" },
      { text: "Limpieza sencilla" },
    ],
  },
];

const DEFAULT_HERO_TITLE = "El Arte del Calzado";
const DEFAULT_HERO_SUBTITLE =
  "Donde la tradición se encuentra con la elegancia contemporánea.";

const DEFAULT_HERO_BANNER_URL = "/images/hero-about1.jpeg";
const DEFAULT_HERO_BANNER_ALT = "Taller artesanal de Bambil Shoes";

const DEFAULT_FOUNDER_PHOTO_URL = "/images/owner.jpg";
const DEFAULT_FOUNDER_ALT =
  "Darío Catuto, fundador y maestro artesano de Bambil Shoes";

const DEFAULT_MISSION =
  "Comercializar calzado para mujeres de excelente calidad, sus artesanos realizan los productos con responsabilidad, compromiso, trabajo en equipo, honestidad y respeto generando así oportunidades para su entorno.";

const DEFAULT_VISION =
  "Ser una de las organizaciones asociativas con mayor volumen de comercialización de calzado para mujeres en la provincia de Santa Elena, y mejorar sus condiciones de vida.";

const DEFAULT_STORE_NAME = "Bambil Shoes By Dario";
const DEFAULT_STORE_ADDRESS = "Bambil Collao, Colonche, Santa Elena, Ecuador";
const DEFAULT_WORKING_HOURS = "Lunes a Sábado: 8:00 AM - 6:00 PM";
const DEFAULT_WHATSAPP_NUMBER = "573009998877";
const DEFAULT_WHATSAPP_MESSAGE =
  "¡Hola! Quisiera realizar una consulta sobre sus calzados.";

export default async function AboutPage() {
  const [aboutData, materialsData, globalInfo] = await Promise.all([
    getAboutPageAction(),
    getMaterialsAction(),
    getGlobalInfoAction(),
  ]);

  const heroTitle = aboutData?.heroTitle || DEFAULT_HERO_TITLE;
  const heroSubtitle = aboutData?.heroSubtitle || DEFAULT_HERO_SUBTITLE;
  const mission = aboutData?.mission || DEFAULT_MISSION;
  const vision = aboutData?.vision || DEFAULT_VISION;

  const heroBannerUrl = resolveImageUrl(
    aboutData?.heroBanner?.url,
    DEFAULT_HERO_BANNER_URL
  );
  const heroBannerAlt =
    aboutData?.heroBanner?.alternativeText || DEFAULT_HERO_BANNER_ALT;

  const founderPhotoUrl = resolveImageUrl(
    aboutData?.founderPhoto?.url,
    DEFAULT_FOUNDER_PHOTO_URL
  );
  const founderPhotoAlt =
    aboutData?.founderPhoto?.alternativeText || DEFAULT_FOUNDER_ALT;

  const corporateValues =
    aboutData?.corporateValues && aboutData.corporateValues.length > 0
      ? aboutData.corporateValues
      : DEFAULT_CORPORATE_VALUES;

  const steps =
    aboutData?.manufacturingSteps && aboutData.manufacturingSteps.length > 0
      ? aboutData.manufacturingSteps
      : DEFAULT_MANUFACTURING_STEPS;

  const materials =
    materialsData && materialsData.length > 0
      ? materialsData
      : DEFAULT_MATERIALS;

  // Format WhatsApp consultation URL with Strapi or default fallback
  const storeName = globalInfo?.storeName || DEFAULT_STORE_NAME;
  const address = globalInfo?.address || DEFAULT_STORE_ADDRESS;
  const workingHours = globalInfo?.workingHours || DEFAULT_WORKING_HOURS;
  const rawPhoneNumber = globalInfo?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
  const cleanPhone = rawPhoneNumber.replace(/\D/g, "");
  const defaultConsultMsg =
    globalInfo?.whatsappDefaultMessage || DEFAULT_WHATSAPP_MESSAGE;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    defaultConsultMsg
  )}`;

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background antialiased selection:bg-[#fbdbb0] selection:text-primary">
      {/* Navigation Bar */}
      <Navbar />

      <main className="grow pt-16 sm:pt-20">
        {/* =========================================================
            HERO: Panoramic Canvas with Master's Open Letter
           ========================================================= */}
        <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center py-20 sm:py-28 lg:py-32 overflow-hidden">
          {/* Panoramic Background: Bambil Shoes Workshop */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroBannerUrl}
              alt={heroBannerAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Warm roasted leather scrim for readability and atmosphere */}
            <div className="absolute inset-0 bg-[#26170c]/80 sm:bg-[#26170c]/75 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#26170c] via-transparent to-[#26170c]/60" />
          </div>

          {/* Foreground Open Letter: Workshop Document */}
          <div className="relative z-10 max-w-3xl w-full mx-auto px-4 sm:px-6">
            <div className="bg-[#fcf9f2] text-[#1c1c18] border border-[#d2c4bc]/80 rounded-xs shadow-2xl p-8 sm:p-12 lg:p-16 relative">
              {/* Subtle inner frame of handcrafted paper */}
              <div className="absolute inset-3 sm:inset-4 border border-[#d2c4bc]/40 pointer-events-none rounded-xs" />

              {/* Workshop Masthead / Archival Header */}
              <div className="text-center pb-6 mb-8 border-b border-[#d2c4bc]/60">
                <span className="block font-sans text-xs uppercase tracking-[0.25em] text-secondary font-semibold mb-1">
                  {storeName}
                </span>
                {address && (
                  <span className="block font-sans text-xs text-on-surface-variant/80 tracking-wider">
                    {address}
                  </span>
                )}
              </div>

              {/* Central Content: Title and Subtitle */}
              <div className="text-center space-y-6">
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-[1.15] text-balance">
                  {heroTitle}
                </h1>
                {heroSubtitle && (
                  <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed text-pretty max-w-xl mx-auto">
                    {heroSubtitle}
                  </p>
                )}
              </div>

              {/* Letter Footer / Master Sign-off */}
              <div className="mt-10 pt-6 border-t border-[#d2c4bc]/50 flex flex-col items-center text-center">
                <span className="font-display italic text-lg sm:text-xl text-primary font-medium">
                  Darío Catuto
                </span>
                <span className="font-sans text-xs text-secondary uppercase tracking-[0.18em] font-semibold mt-1">
                  Maestro Zapatero &amp; Fundador
                </span>
                <a
                  href="#historia"
                  className="inline-flex items-center gap-1.5 mt-6 font-sans text-xs text-secondary hover:text-primary transition-colors uppercase tracking-widest font-semibold group"
                >
                  <span>Conocer al maestro y su misión</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-y-0.5 transition-transform">
                    expand_more
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            HISTORY & FOUNDER: Mission, Vision, and Master's Portrait
           ========================================================= */}
        <section
          id="historia"
          className="bg-surface-container-low/60 py-20 sm:py-28 border-b border-outline-variant/30 scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Founder's Portrait */}
              <div className="lg:col-span-5">
                <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-xs border border-outline-variant/60 shadow-sm">
                  <div className="relative aspect-[4/5] w-full rounded-xs overflow-hidden bg-surface-container-high">
                    <Image
                      src={founderPhotoUrl}
                      alt={founderPhotoAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="pt-4 pb-1">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider block mb-1">
                      Darío Catuto
                    </span>
                    <p className="font-sans text-xs text-on-surface-variant/90 italic">
                      {founderPhotoAlt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission and Vision with Fallbacks */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="p-8 sm:p-10 bg-surface-container-lowest border border-outline-variant/40 rounded-sm shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="material-symbols-outlined text-secondary text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      flag
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
                      Misión
                    </h2>
                  </div>
                  <p className="font-sans text-base text-on-surface-variant leading-relaxed text-pretty">
                    {mission}
                  </p>
                </div>

                <div className="p-8 sm:p-10 bg-surface-container-lowest border border-outline-variant/40 rounded-sm shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="material-symbols-outlined text-secondary text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      visibility
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
                      Visión
                    </h2>
                  </div>
                  <p className="font-sans text-base text-on-surface-variant leading-relaxed text-pretty">
                    {vision}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            MANUFACTURING PROCESS: Craftsmanship Steps
           ========================================================= */}
        {steps && steps.length > 0 && (
          <section id="oficio" className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-12 text-center text-balance">
                Proceso de Manufactura
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, idx) => {
                  const defaultStep =
                    DEFAULT_MANUFACTURING_STEPS[
                      idx % DEFAULT_MANUFACTURING_STEPS.length
                    ];
                  const stepImageUrl = resolveImageUrl(
                    step.image?.url,
                    defaultStep?.image?.url || DEFAULT_HERO_BANNER_URL
                  );
                  const stepImageAlt =
                    step.image?.alternativeText ||
                    defaultStep?.image?.alternativeText ||
                    step.title ||
                    `Paso ${step.stepNumber ?? idx + 1}`;

                  return (
                    <div
                      key={step.id ?? `step-${idx}`}
                      className="bg-surface-container-lowest border border-outline-variant/40 rounded-sm overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      {stepImageUrl && (
                        <div className="relative aspect-[16/10] w-full bg-surface-container-high border-b border-outline-variant/30">
                          <Image
                            src={stepImageUrl}
                            alt={stepImageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                          <div className="absolute top-3 left-3 bg-primary text-white font-sans text-xs font-bold px-2.5 py-1 rounded-xs">
                            Paso {step.stepNumber ?? idx + 1}
                          </div>
                        </div>
                      )}

                      <div className="p-6 sm:p-7 grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-display text-xl font-bold text-primary mb-3">
                            {step.title}
                          </h3>
                          {step.description && (
                            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            MATERIALS: Materials Collection
           ========================================================= */}
        {materials && materials.length > 0 && (
          <section
            id="materiales"
            className="bg-surface-container-low/60 py-20 sm:py-28 border-y border-outline-variant/30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-12 text-center text-balance">
                Materiales
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {materials.map((mat, idx) => {
                  const defaultMat =
                    DEFAULT_MATERIALS[idx % DEFAULT_MATERIALS.length];
                  const textureUrl = resolveImageUrl(
                    mat.textureImage?.url,
                    defaultMat?.textureImage?.url || ""
                  );
                  const textureAlt =
                    mat.textureImage?.alternativeText ||
                    defaultMat?.textureImage?.alternativeText ||
                    mat.name ||
                    "Muestrario de textura de material";

                  return (
                    <div
                      key={mat.id ?? `mat-${idx}`}
                      className="bg-surface-container-lowest border border-outline-variant/40 rounded-sm p-7 sm:p-8 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Material Icon & Name */}
                        <div className="flex items-center gap-3 mb-4">
                          {mat.icon && (
                            <span
                              className="material-symbols-outlined text-secondary text-2xl"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {mat.icon}
                            </span>
                          )}
                          <h3 className="font-display text-2xl font-bold text-primary">
                            {mat.name}
                          </h3>
                        </div>

                        {/* Description */}
                        {mat.description && (
                          <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
                            {mat.description}
                          </p>
                        )}

                        {/* Texture Image with Fallback */}
                        {textureUrl && (
                          <div className="relative aspect-[16/9] w-full rounded-xs overflow-hidden mb-6 bg-surface-container-high border border-outline-variant/30">
                            <Image
                              src={textureUrl}
                              alt={textureAlt}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Benefits list from Strapi */}
                      {mat.benefits && mat.benefits.length > 0 && (
                        <div className="pt-5 border-t border-outline-variant/30">
                          <ul className="space-y-2.5">
                            {mat.benefits.map((b, bIdx) => (
                              <li
                                key={b.id ?? `b-${bIdx}`}
                                className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-primary font-sans"
                              >
                                <span
                                  className="material-symbols-outlined text-secondary text-base shrink-0"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  check_circle
                                </span>
                                <span>{b.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            CORPORATE VALUES
           ========================================================= */}
        {corporateValues && corporateValues.length > 0 && (
          <section id="valores" className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-12 text-center text-balance">
                Valores Corporativos
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {corporateValues.map((val, idx) => (
                  <div
                    key={val.id ?? `val-${idx}`}
                    className="bg-surface-container-lowest p-7 sm:p-8 rounded-sm border border-outline-variant/40 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        {val.icon && (
                          <span
                            className="material-symbols-outlined text-secondary text-2xl shrink-0"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {val.icon}
                          </span>
                        )}
                        <h3 className="font-display text-lg sm:text-xl font-bold text-primary">
                          {val.title}
                        </h3>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            GLOBAL CONTACT INFORMATION (Strapi Global Info with Fallbacks)
           ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20 sm:pb-28">
          <div className="bg-primary text-[#fcf9f2] rounded-sm p-8 sm:p-12 border border-[#d2c4bc]/20 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#fcf9f2] mb-3">
                  {storeName}
                </h2>
                <div className="space-y-2 text-sm text-[#e5e2db] font-sans">
                  {address && (
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-base shrink-0">
                        location_on
                      </span>
                      <span>{address}</span>
                    </p>
                  )}
                  {workingHours && (
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-base shrink-0">
                        schedule
                      </span>
                      <span>{workingHours}</span>
                    </p>
                  )}
                </div>
              </div>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] text-[#1c1c18] font-sans text-xs uppercase tracking-wider font-bold px-6 py-3.5 rounded-xs hover:brightness-105 transition-all self-start md:self-auto shrink-0 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Contactar por WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
