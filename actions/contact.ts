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
    const { name, email, subject, message } = payload;

    if (!name || !email || !message) {
      return {
        success: false,
        error: "Por favor completa todos los campos requeridos.",
      };
    }

    await client.collection("contact-messages").create({
      name,
      email,
      subject: subject || "Consulta sobre producto",
      message,
      statusEmail: "unread",
    });

    return {
      success: true,
      message: "Tu mensaje ha sido enviado exitosamente. Nos pondremos en contacto pronto.",
    };
  } catch (error) {
    console.error("Error creating contact message in Strapi:", error);
    return {
      success: false,
      error: "Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente o contáctanos por WhatsApp.",
    };
  }
}
