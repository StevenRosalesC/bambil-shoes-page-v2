"use server";

import { strapiClient } from "@/lib/strapi";

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageResult {
  success: boolean;
  message?: string;
  error?: string;
}

const VALID_SUBJECTS = [
  "Consulta sobre producto",
  "Pedido personalizado",
  "Seguimiento de envío",
  "Otro",
] as const;

export type ValidSubject = (typeof VALID_SUBJECTS)[number];

const SUBJECT_MAP: Record<string, ValidSubject> = {
  "pedido a medida / personalización": "Pedido personalizado",
  "pedido personalizado": "Pedido personalizado",
  "consulta sobre catálogo y tallas": "Consulta sobre producto",
  "consulta sobre producto": "Consulta sobre producto",
  "seguimiento de envío": "Seguimiento de envío",
  "seguimiento de envio": "Seguimiento de envío",
  "visita al taller en colonche": "Otro",
  "otra consulta": "Otro",
  "otro": "Otro",
};

function normalizeSubject(input?: string): ValidSubject {
  if (!input) return "Consulta sobre producto";
  const clean = input.trim().toLowerCase();
  return SUBJECT_MAP[clean] || (VALID_SUBJECTS.includes(input as ValidSubject) ? (input as ValidSubject) : "Otro");
}

export async function sendContactMessageAction(
  payload: ContactMessagePayload
): Promise<ContactMessageResult> {
  try {
    const trimmedName = payload.name?.trim();
    const trimmedEmail = payload.email?.trim();
    const validatedSubject = normalizeSubject(payload.subject);
    const trimmedMessage = payload.message?.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return {
        success: false,
        error: "Por favor completa todos los campos requeridos.",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return {
        success: false,
        error: "Por favor ingresa un correo electrónico válido.",
      };
    }

    await strapiClient.collection("contact-messages").create({
      name: trimmedName,
      email: trimmedEmail,
      subject: validatedSubject,
      message: trimmedMessage,
      statusEmail: "unread",
    });

    return {
      success: true,
      message: "¡Tu mensaje ha sido enviado exitosamente! Nos pondremos en contacto contigo a la brevedad.",
    };
  } catch (error) {
    console.error("Error creating contact message in Strapi:", error);
    return {
      success: false,
      error: "Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente o contáctanos por WhatsApp.",
    };
  }
}
