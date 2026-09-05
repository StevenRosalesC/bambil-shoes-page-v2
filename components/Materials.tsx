import React from "react";
import Image from "next/image";

export default function Materials() {
  return (
    <section className="py-24 px-4 md:px-10 bg-[#fcf9f2]" id="materiales">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-[#26170c] mb-4 font-semibold">El Alma de Nuestro Calzado</h2>
          <p className="font-sans text-sm md:text-base text-[#4f453f] max-w-2xl mx-auto">
            Seleccionamos meticulosamente cada pieza de cuero, asegurando que la belleza visual esté respaldada por una durabilidad inquebrantable. Conoce nuestros materiales.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Natural Leather Card */}
          <div className="bg-[#f6f3ec] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-[0_8px_30px_rgba(112,90,76,0.08)] border border-transparent hover:border-[#d2c4bc] transition-all duration-300 group">
            <div className="w-full md:w-1/2 h-60 rounded overflow-hidden relative">
              <Image
                alt="Textura de Cuero Natural"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG50EtqMj6Op2bKTOf6FDZ51JEboFi8YjD1xiTVf113FGapmgkUg3eAPB0OCWxpmgfimSYJABI3u07rvbBrMSOMTGoPZM5z4Ie8O6pQafoD1zgHoyTSZNCUny-Z4huNBDodL0g4b1w7R3S2WfNYN0WT7COy9ct_nYdw-K9QUtk8GmcSYQ1yCmmH3OpiWtz9Cp-fE0FsjJhfGO6pWJZEsetCzZIy6p63iS-aDX6X3PZt1XOBuL6LJFiQ6d7zK3393rfXFGlsRJE5vHj"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 mb-3 text-[#725a39]">
                <span className="material-symbols-outlined">verified</span>
                <h3 className="font-display text-xl md:text-2xl text-[#26170c] font-semibold">Cueros Naturales</h3>
              </div>
              <p className="font-sans text-xs md:text-sm text-[#4f453f] mb-6 leading-relaxed">
                Pátina que mejora con el tiempo. Nuestros cueros de grano completo ofrecen una transpirabilidad superior y se adaptan a la forma de tu pie, creando una experiencia verdaderamente personalizada.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-sans text-xs md:text-sm text-[#1c1c18] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#725a39]"></span> Mayor durabilidad
                </li>
                <li className="flex items-center gap-3 font-sans text-xs md:text-sm text-[#1c1c18] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#725a39]"></span> Envejecimiento elegante
                </li>
              </ul>
            </div>
          </div>

          {/* Premium Synthetic Card */}
          <div className="bg-[#f6f3ec] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-[0_8px_30px_rgba(112,90,76,0.08)] border border-transparent hover:border-[#d2c4bc] transition-all duration-300 group">
            <div className="w-full md:w-1/2 h-60 rounded overflow-hidden relative order-first md:order-last">
              <Image
                alt="Textura Sintética Premium"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgrhfEpVASo6ALK6_GZLr4qQsaW222zmPs6feQ_mS5sb0Sqva-PCmN79iifgrkZx8bPvD2rCIdIxfJM31XCV9VmIXSjLD2cI4dyUpQZH6op8YMcuL8tyeuvnRgYoJABZSvf4Kal6oWSxtYChsztzGnaTT5vDt2IQ66l5iWEE8MyvkOIscX5FYECI_WOROjfzS_CIBJgibHLsT2UB6RpYaGlKLdXCWjJzWaZcFNgy2EqlNz6-AjocyT3iWOc82e0TA_3JfH2yE4GU1l"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 mb-3 text-[#725a39]">
                <span className="material-symbols-outlined">eco</span>
                <h3 className="font-display text-xl md:text-2xl text-[#26170c] font-semibold">Sintéticos Premium</h3>
              </div>
              <p className="font-sans text-xs md:text-sm text-[#4f453f] mb-6 leading-relaxed">
                Innovación para el ritmo moderno. Alternativas de alta gama que replican la sensación del cuero con ventajas adicionales de resistencia al agua y mantenimiento mínimo.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-sans text-xs md:text-sm text-[#1c1c18] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#725a39]"></span> Resistencia al clima
                </li>
                <li className="flex items-center gap-3 font-sans text-xs md:text-sm text-[#1c1c18] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#725a39]"></span> Limpieza sencilla
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
