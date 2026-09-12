import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactGrid from "@/components/ContactGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getGlobalInfoAction } from "@/actions/global";

export const metadata: Metadata = {
  title: "Contacto & Atención al Cliente | Bambil Shoes By Dario",
  description:
    "Ponte en contacto directo con nuestro taller artesanal en Bambil Collao, Colonche. Consultas sobre calzado a medida, tallas y pedidos por WhatsApp o formulario.",
};

// Revalidate contact page every 10 minutes (600 seconds)
export const revalidate = 600;

const DEFAULT_STORE_NAME = "Bambil Shoes By Dario";
const DEFAULT_STORE_ADDRESS =
  "Comuna Bambil Collao, Parroquia Colonche · Santa Elena, Ecuador";

export default async function ContactPage() {
  const globalInfo = await getGlobalInfoAction();

  const storeName = globalInfo?.storeName || DEFAULT_STORE_NAME;
  const address = globalInfo?.address || DEFAULT_STORE_ADDRESS;

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background antialiased selection:bg-[#fbdbb0] selection:text-primary">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="grow pt-16 sm:pt-20">
        {/* Editorial Header Section */}
        <section className="pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-outline-variant/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            {/* Breadcrumbs Navigation */}
            <Breadcrumbs className="mb-6" />

            {/* Archival Masthead Bar */}
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4 mb-10 sm:mb-14 text-xs font-sans text-secondary font-medium tracking-[0.22em] uppercase">
              <span>{storeName}</span>
              <span className="hidden sm:inline">{address}</span>
            </div>

            {/* Editorial Title & Lead */}
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-secondary-container/50 text-on-secondary-container font-sans text-xs font-bold px-3.5 py-1.5 rounded-xs mb-5 tracking-[0.18em] uppercase border border-secondary/20">
                Atención Personalizada &amp; Encargos
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-[1.1] mb-6 text-balance">
                Hablemos de Arte y Calzado
              </h1>
              <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed text-pretty">
                Estamos a tu entera disposición para asesorarte en la elección de tu calzado, coordinar confecciones personalizadas a medida o recibirte en nuestro taller artesanal en Colonche.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Grid & Map Container */}
        <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <ContactGrid initialGlobalInfo={globalInfo} />
          </div>
        </section>
      </main>
    </div>
  );
}
