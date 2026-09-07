import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactGrid from "@/components/ContactGrid";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto con Bambil Shoes By Dario. Visita nuestro taller artesanal en Santa Elena, comunícate por WhatsApp o envíanos tu consulta personalizada.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] antialiased">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-24 pt-[100px] md:pt-[120px]">
        {/* Editorial Header */}
        <header className="text-center mb-16 md:mb-20">
          <span className="inline-block bg-[#D2B48C]/30 text-[#26170c] font-sans text-xs font-bold px-4 py-1.5 rounded mb-4 tracking-widest uppercase shadow-xs">
            Atención Personalizada
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-[#26170c] mb-4 font-bold">
            Hablemos de Arte y Calzado
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4f453f] max-w-2xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte a encontrar el par perfecto o coordinar pedidos a medida. Escríbenos directamente o visítanos en nuestro taller.
          </p>
        </header>

        {/* Contact info, form and map */}
        <ContactGrid />
      </main>
    </div>
  );
}
