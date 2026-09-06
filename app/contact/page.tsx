import Navbar from "@/components/Navbar";
import ContactGrid from "@/components/ContactGrid";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] antialiased">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-24 pt-[100px] md:pt-[120px]">
        {/* Editorial Header */}
        <header className="text-center mb-16 md:mb-20">
          <h1 className="font-display text-4xl md:text-5xl text-[#26170c] mb-4 font-bold">
            Hablemos de Arte
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4f453f] max-w-2xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte a encontrar el par perfecto o crear algo único. Contáctanos para asesoría personalizada.
          </p>
        </header>

        {/* Contact info, form and map */}
        <ContactGrid />
      </main>
    </div>
  );
}
