"use server";

import { strapi } from "@strapi/client";

const client = strapi({
  baseURL: process.env.STRAPI_API_URL || "http://localhost:1337/api",
});

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

export async function sendContactMessageAction(
  payload: ContactMessagePayload
): Promise<ContactMessageResult> {
  try {
    const trimmedName = payload.name?.trim();
    const trimmedEmail = payload.email?.trim();
    const trimmedSubject = payload.subject?.trim() || "Consulta sobre producto";
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

    await client.collection("contact-messages").create({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
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
