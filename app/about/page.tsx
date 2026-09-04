import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import CartDrawer from "@/components/CartDrawer";
import Image from "next/image";

export default function AboutPage() {
  const steps = [
    {
      title: "1. Corte Preciso",
      description:
        "Seleccionamos las mejores partes de cada piel, asegurando que la flor del material sea impecable antes de realizar el primer corte manual.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCmMCSqNiGaJello7QedMQ74f8guO8HMVhPj0XQEUQ1rbFKWRfFqfGXdQSuaX3b_BWNYgo-oAoInmTqdbI70gWZFy11aj7KbYqycqc9CdJoh0P45GTqu5Vui8yIAdFEZYfLIUlRRvuDtGTRokIaQmUHzFS_fVGP4hGiAPlssjotJrnwA6wpIDvnUoIg2rNHwI0RXav0yKbKRlNXQ-ZT1LMBSgcxiJnbKSVenWp0iH2QBe6DiWG7tNyEntAuY46tcR45q_aUKWGOWeWF",
      translate: false,
    },
    {
      title: "2. Ensamblaje",
      description:
        "Unimos las piezas con hilos de alta resistencia, empleando técnicas de costura tradicionales que garantizan la durabilidad de por vida.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAFyBlki9sLXWr-aa-gBDKrn_5WHBF4si9YeShOvkoEkg2BsdT-g08aPaxwoiP3EtFE99xAwerejHhMafK024H5vgnGUzIp6NwzHin05bQyIcOiihFa7tr4I5jP7xOJPkLh2_xQfoEWDBhIjpPzeWV3nJMWG8UGgYrVGggE8_FTz3gbZ5zfnnH8zmSq1sX88lkX7c9WBEeCwbR8tSWe7gfymngeHGFMs94K8xzlqsbMcEJj8nEforwqbAbfIH3PxlcfMzaTinw09agK",
      translate: true,
    },
    {
      title: "3. Acabado Final",
      description:
        "El pulido manual con ceras naturales resalta la pátina única de cada zapato, otorgándole ese carácter distintivo y elegante de Bambil.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCkZTCfoMYFYHnJNLtSaD1U_X5rYM6TQlsjay-y5tiQ5ZslI5V6R8MxutJ5PuKhQ21F8kM2l662srAUF3t92wpMCYLFL2WABDoyKUttPboSM45YB89EPAqdCV6vp_S9B9bfRxGYhAU9yMKzW1QPE54NQxzrIUkf01m0he-mNb3EOaDOWrsuODK01WgPfBc7hAaODZPrNj89fRnp_I3vikY6iDfWDatEQDQvlB42uPN-t8Hq6t3nB43bAtrqi-CAiKcz8lZ1XRZStwM3",
      translate: false,
    },
  ];

  const corporateValues = [
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

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] antialiased">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-[72px]">
        {/* Hero Banner Section */}
        <section className="relative w-full h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#e5e2db]">
          <Image
            fill
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-multiply"
            alt="Lienzo de cueros en el taller"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzMAVDQmJPemQqY276x5UcZdkLL8QR5kUIf3aAYbgesoV1y2x1p1YQU9krRiDTiy1ewj7-2Q-7ILJct2xzKW-v2CUZFBEgTDoMLoI2SOIhopyBcRpP_ZKSYtreYH4-QoAa1_tDICYhtlWzFfZZA_PEH-bbIckoI2bbZjf3FUIJ_ZCh-y4GHpRE1lWPKph68NZonAx9Q5CSWJPV9RUdvEUwo5qM1vtP63fYOjAv0IYASHkana8K9bj2HacQ2zw65z3ltG8FUHpXcQdG"
          />
          <div className="relative z-10 text-center px-4">
            <span className="inline-block bg-[#D2B48C] text-[#26170c] font-sans text-xs font-bold px-4 py-1.5 rounded mb-4 tracking-widest uppercase shadow-sm">
              Nuestra Esencia
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#26170c] mb-4">
              El Arte del Calzado
            </h1>
            <p className="font-sans text-sm md:text-base text-[#4f453f] max-w-2xl mx-auto leading-relaxed">
              Donde la tradición se encuentra con la elegancia contemporánea.
            </p>
          </div>
        </section>

        {/* Mission, Vision & Values Section */}
        <section
          className="max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-28"
          id="historia"
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-[#D2B48C]/30 text-[#26170c] font-sans text-xs font-bold px-4 py-1.5 rounded mb-4 tracking-widest uppercase shadow-xs">
              Nuestra Identidad
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#26170c] mb-4">
              Misión, Visión y Valores
            </h2>
            <div className="w-16 h-[2px] bg-[#D2B48C] mx-auto mt-4"></div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_10px_30px_-5px_rgba(61,43,31,0.06)] border border-[#d2c4bc]/30 relative overflow-hidden group hover:shadow-[0_15px_35px_-5px_rgba(61,43,31,0.1)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D2B48C]/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 rounded-xl bg-[#f6f3ec] flex items-center justify-center mb-6 text-[#D2B48C]">
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  flag
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-[#26170c] mb-4 font-semibold">
                Misión
              </h3>
              <p className="font-sans text-sm md:text-base text-[#4f453f] leading-relaxed">
                Comercializar calzado para mujeres de excelente calidad, sus artesanos realizan los productos con responsabilidad, compromiso, trabajo en equipo, honestidad y respeto generando así oportunidades para su entorno.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_10px_30px_-5px_rgba(61,43,31,0.06)] border border-[#d2c4bc]/30 relative overflow-hidden group hover:shadow-[0_15px_35px_-5px_rgba(61,43,31,0.1)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D2B48C]/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 rounded-xl bg-[#f6f3ec] flex items-center justify-center mb-6 text-[#D2B48C]">
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  visibility
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-[#26170c] mb-4 font-semibold">
                Visión
              </h3>
              <p className="font-sans text-sm md:text-base text-[#4f453f] leading-relaxed">
                Ser una de las organizaciones asociativas con mayor volumen de comercialización de calzado para mujeres en la provincia de Santa Elena, y mejorar sus condiciones de vida.
              </p>
            </div>
          </div>

          {/* Corporate Values */}
          <div>
            <div className="text-center mb-12">
              <span className="inline-block bg-[#D2B48C]/30 text-[#26170c] font-sans text-xs font-bold px-4 py-1.5 rounded mb-3 tracking-widest uppercase">
                Pilares Fundamentales
              </span>
              <h3 className="font-display text-2xl md:text-4xl font-semibold text-[#26170c]">
                Valores Corporativos
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {corporateValues.map((val, idx) => (
                <div
                  key={idx}
                  className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-7 rounded-xl border border-[#d2c4bc]/30 shadow-[0_10px_30px_-5px_rgba(61,43,31,0.04)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#f6f3ec] flex items-center justify-center mb-4 text-[#D2B48C]">
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {val.icon}
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-semibold text-[#26170c] mb-2">
                      {val.title}
                    </h4>
                    <p className="font-sans text-xs md:text-sm text-[#4f453f] leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing Process Steps */}
        <section className="bg-[#f6f3ec] py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl text-[#26170c] mb-4 font-semibold">
                El Proceso de Manufactura
              </h2>
              <p className="font-sans text-sm md:text-base text-[#4f453f] max-w-2xl mx-auto">
                Una sinfonía de herramientas precisas y manos expertas. Cada par
                requiere más de 100 pasos individuales para alcanzar la
                perfección.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-xl overflow-hidden shadow-[0_10px_30px_-5px_rgba(61,43,31,0.06)] border border-[#d2c4bc]/30 group transition-all duration-500 ${
                    step.translate ? "translate-y-0 md:translate-y-8" : ""
                  }`}
                >
                  <div className="h-60 md:h-64 overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={step.title}
                      src={step.image}
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="font-display text-xl text-[#26170c] mb-3 font-semibold">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-[#4f453f] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Swatches Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-24 md:py-32">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="font-display text-3xl md:text-4xl text-[#26170c] mb-6 font-semibold">
                Compromiso con la Calidad
              </h2>
              <p className="font-sans text-sm md:text-base text-[#4f453f] mb-8 leading-relaxed">
                Nuestra devoción por el calce perfecto nos lleva a seleccionar
                rigurosamente nuestros materiales. Trabajamos en armonía tanto
                con cueros naturales de la más alta pureza como con pieles
                sintéticas premium de última generación.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start">
                  <span
                    className="material-symbols-outlined text-[#D2B48C] mr-4 mt-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-[#26170c] mb-1">
                      Cueros Naturales
                    </h4>
                    <p className="font-sans text-xs md:text-sm text-[#4f453f] leading-relaxed">
                      Mantenemos la transpirabilidad y flexibilidad, logrando
                      una pátina que mejora y cuenta tu historia con el tiempo.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span
                    className="material-symbols-outlined text-[#D2B48C] mr-4 mt-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-[#26170c] mb-1">
                      Materiales Sintéticos Premium
                    </h4>
                    <p className="font-sans text-xs md:text-sm text-[#4f453f] leading-relaxed">
                      Opciones innovadoras de alta resistencia que ofrecen
                      acabados impecables y consistencia superior sin
                      comprometer la elegancia.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#f6f3ec] rounded-xl -z-10 shadow-[0_10px_30px_-5px_rgba(61,43,31,0.04)]"></div>
                <img
                  className="w-full h-auto rounded-xl shadow-[0_10px_30px_rgba(61,43,31,0.08)] object-cover aspect-[4/3] lg:aspect-square"
                  alt="Muestrario de materiales premium"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFL-3rE2zyLi_S3v4pIBlOZhWe3lFiA2LSlqCzQaBPwHSdGStaOpb72AIn2vWYtKT2X5qa7hyN8idMurHrsVubMKn49bYFIiH6l2L6rPB0al26XrfxEOXjKABAKqeRiPwSCvxPV84Wz89uDToI9jY9_itdhVuyfhNcl5A5A_yMXRDXSVU5QKFSTqeLO51DxkgVQU_3KRXRGmvdt3Tw_s31uxhWy22aKnX8kiqw8QfvZgcqhRRe7RVDy8lCUL3ZkFG0jApakj7aoExx"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Layers */}
      <WhatsAppFAB />
      <CartDrawer />
    </div>
  );
}
