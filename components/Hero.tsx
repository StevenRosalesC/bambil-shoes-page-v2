import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center bg-[#e5e2db] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Artesano trabajando cuero"
          className="w-full h-full object-cover object-center scale-102 transform origin-center animate-subtle-zoom"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx5u850eIDqxOrqlU72d95E4dsq_DJAbNV42WkGFgaIL0LFrTEmR1wm45PpTydPfZxWVt4ff1Ih7vozdlHD7q8NFvDLaybl5xcU490Oe-5VzoUe0QsjSP4FBNuIXtFtbWOQBe1V3sYrwGW2umjAdTxICizCA7G65FfB3AxL_8HZb9ZFZwZ34w6kvSwOu98hugQpiaPyUkX7qSBjNWEqXfc-Mvw4dWvcmebBao-DcMUTHDZQAuoMr5uU8Ghwa657d4P4atm1kZFmTzy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#26170c]/95 via-[#26170c]/45 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 md:px-10 max-w-5xl mx-auto mt-20">
        <span className="inline-block px-4 py-1.5 mb-6 bg-white/10 backdrop-blur-md border border-[#dec1af]/40 rounded-full font-sans text-xs font-semibold text-white tracking-widest uppercase">
          Hecho a Mano
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md">
          Artesanía que se siente en cada paso
        </h1>
        <p className="font-sans text-base md:text-lg text-[#e5e2db] max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
          Descubre la fusión perfecta entre la robustez del cuero natural y la elegancia del diseño a medida. Cada par cuenta una historia de dedicación y maestría.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            className="w-full sm:w-auto bg-[#3d2b1f] text-[#fcf9f2] hover:text-white font-sans text-sm font-semibold px-8 py-4 rounded hover:bg-[#26170c] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-center"
            href="#colecciones"
          >
            Explorar Colecciones
          </a>
          <a
            className="w-full sm:w-auto bg-transparent border border-[#dec1af] text-white font-sans text-sm font-semibold px-8 py-4 rounded hover:bg-white/10 backdrop-blur-xs transition-all duration-300 text-center"
            href="#historia"
          >
            Nuestra Historia
          </a>
        </div>
      </div>
    </section>
  );
}
