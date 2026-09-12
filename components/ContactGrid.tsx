"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useGlobalInfo } from "@/providers/global-info-provider";
import { sendContactMessageAction } from "@/actions/contact";
import type { GlobalDataData } from "@/types/GlobalInfo";

const ContactMap = dynamic(() => import("@/components/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-surface-container-low rounded-xs border border-outline-variant/60 shadow-xs h-[400px] flex items-center justify-center animate-pulse">
      <div className="flex items-center gap-2.5 text-secondary font-sans text-sm font-semibold">
        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
        <span>Cargando mapa interactivo del taller...</span>
      </div>
    </div>
  ),
});

interface ContactGridProps {
  initialGlobalInfo?: GlobalDataData | null;
}

const DEFAULT_PHONE = "+593 99 383 3765";
const DEFAULT_WHATSAPP = "573009998877";
const DEFAULT_EMAIL = "bambilshoes@gmail.com";
const DEFAULT_ADDRESS = "Santa Elena, Parroquia Colonche · Comuna Bambil Collao";
const DEFAULT_WORKING_HOURS = "Lunes a Sábado: 8:00 AM - 6:00 PM";
const DEFAULT_WHATSAPP_MESSAGE =
  "¡Hola! Quisiera realizar una consulta sobre sus calzados artesanales.";

export default function ContactGrid({ initialGlobalInfo }: ContactGridProps) {
  const { globalInfo: contextGlobalInfo } = useGlobalInfo();
  const globalInfo = initialGlobalInfo || contextGlobalInfo;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Pedido personalizado");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const rawPhone = globalInfo?.phone || globalInfo?.whatsappNumber || DEFAULT_PHONE;
  const phoneNumber = rawPhone;
  const cleanPhone = rawPhone.replace(/\D/g, "");

  const rawWhatsApp = globalInfo?.whatsappNumber || DEFAULT_WHATSAPP;
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, "");

  const enterpriseEmail = globalInfo?.email || DEFAULT_EMAIL;
  const address = globalInfo?.address || DEFAULT_ADDRESS;
  const workingHours = globalInfo?.workingHours || DEFAULT_WORKING_HOURS;

  const whatsappMessage =
    globalInfo?.whatsappDefaultMessage || DEFAULT_WHATSAPP_MESSAGE;

  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const instagramUrl = globalInfo?.instagramUrl;
  const facebookUrl = globalInfo?.facebookUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setFeedbackMessage("Por favor completa todos los campos requeridos del formulario.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendContactMessageAction({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });

      if (res.success) {
        setStatus("success");
        setFeedbackMessage(
          res.message || "¡Mensaje enviado con éxito! Nos pondremos en contacto muy pronto."
        );
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setStatus("idle"), 6000);
      } else {
        setStatus("error");
        setFeedbackMessage(
          res.error || "Ocurrió un error al enviar el mensaje. Intenta nuevamente o contáctanos por WhatsApp."
        );
      }
    } catch {
      setStatus("error");
      setFeedbackMessage("Ocurrió un error inesperado al enviar el mensaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Upper Two-Column Layout: Concierge (Left) & Inquiry Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Atelier Concierge & Direct Channels */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-xs p-7 sm:p-9 shadow-xs flex flex-col justify-between grow">
            <div>
              {/* Card Header with Live Workshop Badge */}
              <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-outline-variant/50">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-secondary block mb-1">
                    Atención Inmediata
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
                    Atelier Concierge
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-emerald-100/80 text-emerald-800 text-xs font-sans font-bold uppercase tracking-wider shrink-0 border border-emerald-300/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Taller Activo</span>
                </div>
              </div>

              <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
                Para resolver dudas de tallas, consultar disponibilidad de pieles en taller o coordinar pedidos especiales con entrega directa, comunícate con nosotros por WhatsApp.
              </p>

              {/* Prominent WhatsApp Priority Card */}
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xs p-5 sm:p-6 mb-8 shadow-xs">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-xs bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      chat
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-primary leading-snug">
                      WhatsApp Prioritario
                    </h3>
                    <p className="font-sans text-xs text-on-surface-variant/90 mt-0.5">
                      Respuesta directa del equipo artesano
                    </p>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:brightness-105 text-[#1c1c18] font-sans text-xs uppercase tracking-wider font-bold py-3.5 px-5 rounded-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                  <span>Iniciar conversación en WhatsApp</span>
                </a>
              </div>

              {/* Direct Channels List */}
              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <span className="material-symbols-outlined text-secondary text-xl mt-0.5 shrink-0">
                    call
                  </span>
                  <div>
                    <span className="block font-sans text-xs uppercase tracking-wider text-secondary font-semibold">
                      Línea Telefónica
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="font-sans text-sm sm:text-base font-bold text-primary hover:text-secondary transition-colors"
                    >
                      {phoneNumber}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <span className="material-symbols-outlined text-secondary text-xl mt-0.5 shrink-0">
                    mail
                  </span>
                  <div>
                    <span className="block font-sans text-xs uppercase tracking-wider text-secondary font-semibold">
                      Correo Electrónico
                    </span>
                    <a
                      href={`mailto:${enterpriseEmail}`}
                      className="font-sans text-sm sm:text-base font-medium text-primary hover:text-secondary transition-colors"
                    >
                      {enterpriseEmail}
                    </a>
                  </div>
                </div>

                {/* Workshop Address */}
                <div className="flex items-start gap-3.5">
                  <span className="material-symbols-outlined text-secondary text-xl mt-0.5 shrink-0">
                    location_on
                  </span>
                  <div>
                    <span className="block font-sans text-xs uppercase tracking-wider text-secondary font-semibold">
                      Taller Principal
                    </span>
                    <p className="font-sans text-sm text-primary font-medium leading-relaxed">
                      {address}
                    </p>
                    <span className="text-xs text-on-surface-variant italic block mt-0.5">
                      Atención con cita previa
                    </span>
                  </div>
                </div>

                {/* Working Hours */}
                {workingHours && (
                  <div className="flex items-start gap-3.5">
                    <span className="material-symbols-outlined text-secondary text-xl mt-0.5 shrink-0">
                      schedule
                    </span>
                    <div>
                      <span className="block font-sans text-xs uppercase tracking-wider text-secondary font-semibold">
                        Horario de Atención
                      </span>
                      <p className="font-sans text-sm text-primary font-medium">
                        {workingHours}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Channels Footer */}
            {(instagramUrl || facebookUrl) && (
              <div className="mt-8 pt-6 border-t border-outline-variant/40">
                <span className="block font-sans text-xs uppercase tracking-wider text-secondary font-semibold mb-3">
                  Presencia Digital
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xs bg-surface-container-lowest hover:bg-surface-container-high text-primary text-xs font-semibold border border-outline-variant/60 transition-colors shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      <span>Instagram</span>
                    </a>
                  )}
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xs bg-surface-container-lowest hover:bg-surface-container-high text-primary text-xs font-semibold border border-outline-variant/60 transition-colors shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">public</span>
                      <span>Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inquiry and Custom Order Form */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xs p-7 sm:p-10 shadow-xs flex flex-col justify-between grow">
            <div>
              {/* Form Section Header */}
              <div className="pb-5 mb-8 border-b border-outline-variant/50">
                <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-secondary block mb-1">
                  Cuaderno de Consultas
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
                  Envíanos un Mensaje
                </h2>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed mt-2">
                  Completa el formulario para solicitar cotizaciones de modelos a medida, resolver inquietudes sobre materiales o coordinar una cita.
                </p>
              </div>

              {/* Feedback State Banners */}
              {status === "success" && (
                <div className="mb-6 p-4 bg-secondary-container/70 text-on-secondary-container rounded-xs border border-secondary/30 font-sans text-sm font-medium flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-xl text-secondary shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span>{feedbackMessage || "¡Mensaje enviado con éxito! Nos pondremos en contacto muy pronto."}</span>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 bg-error-container/70 text-on-error-container rounded-xs border border-error/30 font-sans text-sm font-medium flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl text-error shrink-0">
                    error
                  </span>
                  <span>{feedbackMessage || "Por favor completa todos los campos requeridos."}</span>
                </div>
              )}

              {/* Contact Form Connected to Strapi */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs font-bold text-primary mb-2 uppercase tracking-wider">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isSubmitting}
                      placeholder="Tu nombre y apellido"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface border border-outline-variant/80 rounded-xs px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-outline/70"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-bold text-primary mb-2 uppercase tracking-wider">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      disabled={isSubmitting}
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-outline-variant/80 rounded-xs px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-outline/70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold text-primary mb-2 uppercase tracking-wider">
                    Motivo de Consulta
                  </label>
                  <select
                    value={subject}
                    disabled={isSubmitting}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/80 rounded-xs px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="Pedido personalizado">Pedido a medida / Personalización</option>
                    <option value="Consulta sobre producto">Consulta sobre catálogo y tallas</option>
                    <option value="Seguimiento de envío">Seguimiento de envío</option>
                    <option value="Otro">Otra consulta o visita al taller</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold text-primary mb-2 uppercase tracking-wider">
                    Mensaje o Detalles del Calzado *
                  </label>
                  <textarea
                    required
                    disabled={isSubmitting}
                    placeholder="Escribe aquí los detalles de tu consulta o las características del zapato que deseas..."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/80 rounded-xs px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-outline/70"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-xs transition-all shadow-xs flex items-center justify-center gap-2.5 ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : "cursor-pointer hover:shadow-md"
                    }`}
                  >
                    {isSubmitting && (
                      <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    )}
                    <span>{isSubmitting ? "Enviando mensaje..." : "Enviar Mensaje"}</span>
                  </button>
                  <span className="text-xs text-on-surface-variant font-sans">
                    Tus datos se gestionan con absoluta confidencialidad.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Lower Section: Workshop Geography & Interactive Map */}
      <div>
        <ContactMap />
      </div>
    </div>
  );
}
