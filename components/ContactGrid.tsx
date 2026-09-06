"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ContactMap = dynamic(() => import("@/components/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-[#f6f3ec] rounded-xl border border-[#d2c4bc]/50 shadow-[0_10px_30px_-5px_rgba(61,43,31,0.06)] h-[410px] flex items-center justify-center animate-pulse">
      <div className="flex items-center gap-2 text-[#705a4c] font-sans text-sm font-semibold">
        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
        <span>Cargando mapa interactivo...</span>
      </div>
    </div>
  ),
});

const phoneNumber = process.env.NEXT_PUBLIC_ENTERPRISE_PHONE || "+593 99 383 3765";
const enterpriseEmail = process.env.NEXT_PUBLIC_ENTERPRISE_EMAIL || "bambilshoes@gmail.com";

export default function ContactGrid() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Consulta sobre producto");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }

    // Simulate sending email/message
    setStatus("success");
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
      {/* Direct Contact (Left/Top) */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-[#f6f3ec] rounded-xl p-8 shadow-[0_10px_30px_-5px_rgba(61,43,31,0.06)] border border-[#d2c4bc]/30 h-full flex flex-col justify-between">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#26170c] mb-6 border-b border-[#d2c4bc] pb-4">
              Atención Directa
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="material-symbols-outlined text-[#725a39] mt-1">call</span>
                <div>
                  <p className="font-sans text-xs font-bold text-[#4f453f] mb-1">Teléfono &amp; WhatsApp</p>
                  <p className="font-sans text-base md:text-lg font-bold text-[#26170c]">{phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="material-symbols-outlined text-[#725a39] mt-1">mail</span>
                <div>
                  <p className="font-sans text-xs font-bold text-[#4f453f] mb-1">Correo Electrónico</p>
                  <p className="font-sans text-base md:text-lg font-bold text-[#26170c]">{enterpriseEmail}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="material-symbols-outlined text-[#725a39] mt-1">location_on</span>
                <div>
                  <p className="font-sans text-xs font-bold text-[#4f453f] mb-1">Taller Principal</p>
                  <p className="font-sans text-sm md:text-base text-[#26170c] font-semibold">
                    Santa Elena, Ecuador<br />
                    <span className="text-xs text-[#4f453f] font-normal">Atención con cita previa</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#d2c4bc]">
            <Link
              className="w-full bg-[#25D366] hover:bg-[#20bd5c] text-white font-sans text-sm font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg"
              href={`https://wa.me/${phoneNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
              <span>Iniciar chat en WhatsApp</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Message Form & Map (Right/Bottom) */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white rounded-xl p-8 border border-[#d2c4bc]/50 shadow-[0_10px_30px_-5px_rgba(61,43,31,0.06)]">
          <h2 className="font-display text-xl md:text-2xl font-bold text-[#26170c] mb-6">Envíanos un Mensaje</h2>

          {status === "success" && (
            <div className="mb-6 p-4 bg-secondary-container text-[#765f3d] rounded-lg border border-[#fbdbb0]/50 font-sans text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              ¡Mensaje enviado con éxito! Nos pondremos en contacto muy pronto.
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 bg-error-container text-[#ba1a1a] rounded-lg border border-[#ffdad6] font-sans text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              Por favor completa todos los campos del formulario.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs font-bold text-[#4f453f] mb-2 uppercase tracking-wider">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FCF9F2] border border-[#d2c4bc] rounded-lg px-4 py-3 text-sm text-[#1c1c18] focus:border-[#26170c] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block font-sans text-xs font-bold text-[#4f453f] mb-2 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FCF9F2] border border-[#d2c4bc] rounded-lg px-4 py-3 text-sm text-[#1c1c18] focus:border-[#26170c] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs font-bold text-[#4f453f] mb-2 uppercase tracking-wider">
                Asunto
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#FCF9F2] border border-[#d2c4bc] rounded-lg px-4 py-3 text-sm text-[#1c1c18] focus:border-[#26170c] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Consulta sobre producto">Consulta sobre producto</option>
                <option value="Pedido personalizado">Pedido personalizado</option>
                <option value="Seguimiento de envío">Seguimiento de envío</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-sans text-xs font-bold text-[#4f453f] mb-2 uppercase tracking-wider">
                Mensaje
              </label>
              <textarea
                required
                placeholder="¿En qué te podemos ayudar?"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#FCF9F2] border border-[#d2c4bc] rounded-lg px-4 py-3 text-sm text-[#1c1c18] focus:border-[#26170c] focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-[#3d2b1f] hover:bg-[#26170c] text-white font-sans text-sm font-semibold py-3.5 px-8 rounded-lg transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>

        {/* Interactive Leaflet Map */}
        <ContactMap />
      </div>
    </div>
  );
}
