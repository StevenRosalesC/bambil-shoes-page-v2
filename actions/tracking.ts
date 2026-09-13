"use server";

import {
  TrackedOrder,
  TrackingActionResult,
  VerifyOtpResultData,
} from "@/types/OrderTracking";

function getStrapiApiUrl(): string {
  const base = process.env.STRAPI_API_URL || "http://localhost:1337/api";
  return base.replace(/\/$/, "");
}

/**
 * Request an 8-digit OTP code sent to the customer's email
 */
export async function requestOrderOtpAction(
  orderNumber: string,
  email: string
): Promise<TrackingActionResult<{ maskedEmail?: string }>> {
  try {
    const cleanOrderNumber = orderNumber?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanOrderNumber || !cleanEmail) {
      return {
        success: false,
        error: "Por favor ingresa el número de pedido y tu correo electrónico.",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return {
        success: false,
        error: "Por favor ingresa un correo electrónico válido.",
      };
    }

    const response = await fetch(`${getStrapiApiUrl()}/orders/request-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderNumber: cleanOrderNumber,
        email: cleanEmail,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        "No se pudo enviar el código de verificación. Por favor verifica los datos ingresados.";

      // Check if cooldown wait is mentioned
      const waitMatch = errorMessage.match(/espera\s+(\d+)\s+segundos/i);
      const waitSeconds = waitMatch ? parseInt(waitMatch[1], 10) : undefined;

      return {
        success: false,
        error: errorMessage,
        waitSeconds,
      };
    }

    const [userPart, domainPart] = cleanEmail.split("@");
    const fallbackMasked =
      userPart.length > 2
        ? `${userPart[0]}***${userPart[userPart.length - 1]}@${domainPart}`
        : `${userPart[0]}***@${domainPart}`;

    return {
      success: true,
      message:
        data?.message ||
        `Hemos enviado un código de verificación de 8 dígitos a ${fallbackMasked}.`,
      data: {
        maskedEmail: data?.maskedEmail || fallbackMasked,
      },
    };
  } catch (error) {
    console.error("Error in requestOrderOtpAction:", error);
    return {
      success: false,
      error:
        "No fue posible conectar con el servidor. Por favor verifica tu conexión o intenta de nuevo más tarde.",
    };
  }
}

/**
 * Verify the 8-digit OTP code and retrieve the order details + session token
 */
export async function verifyOrderOtpAction(
  orderNumber: string,
  email: string,
  code: string
): Promise<TrackingActionResult<VerifyOtpResultData>> {
  try {
    const cleanOrderNumber = orderNumber?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanCode = code?.trim().replace(/\D/g, "");

    if (!cleanOrderNumber || !cleanEmail || !cleanCode) {
      return {
        success: false,
        error: "Por favor ingresa el código de 8 dígitos recibido en tu correo.",
      };
    }

    if (cleanCode.length !== 8) {
      return {
        success: false,
        error: "El código de verificación debe tener exactamente 8 dígitos.",
      };
    }

    const response = await fetch(`${getStrapiApiUrl()}/orders/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderNumber: cleanOrderNumber,
        email: cleanEmail,
        code: cleanCode,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        "El código ingresado es incorrecto o ha expirado.";

      // Check if attempts remaining are mentioned
      const attemptsMatch = errorMessage.match(/quedan?\s+(\d+)\s+intento/i);
      const remainingAttempts = attemptsMatch
        ? parseInt(attemptsMatch[1], 10)
        : undefined;

      return {
        success: false,
        error: errorMessage,
        remainingAttempts,
      };
    }

    if (!data?.order) {
      return {
        success: false,
        error: "No se pudieron obtener los datos del pedido.",
      };
    }

    return {
      success: true,
      message: data.message || "Autenticación exitosa",
      data: {
        token: data.token,
        order: data.order as TrackedOrder,
      },
    };
  } catch (error) {
    console.error("Error in verifyOrderOtpAction:", error);
    return {
      success: false,
      error:
        "Ocurrió un problema de comunicación al verificar el código. Por favor intenta de nuevo.",
    };
  }
}

/**
 * Re-fetch the tracked order details using the valid session token
 */
export async function getTrackedOrderAction(
  orderNumber: string,
  token: string
): Promise<TrackingActionResult<TrackedOrder>> {
  try {
    const cleanOrderNumber = orderNumber?.trim();
    const cleanToken = token?.trim();

    if (!cleanOrderNumber || !cleanToken) {
      return {
        success: false,
        error: "La sesión ha expirado o faltan credenciales de consulta.",
      };
    }

    const response = await fetch(
      `${getStrapiApiUrl()}/orders/track/${encodeURIComponent(cleanOrderNumber)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error:
            "Tu sesión de consulta ha expirado (válida por 2 horas). Por favor solicita un nuevo código.",
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          error: "El token de sesión no coincide con este número de pedido.",
        };
      }

      return {
        success: false,
        error:
          data?.error?.message ||
          data?.message ||
          "No fue posible actualizar la información del pedido.",
      };
    }

    if (!data?.order) {
      return {
        success: false,
        error: "No se encontró información para este pedido.",
      };
    }

    return {
      success: true,
      data: data.order as TrackedOrder,
    };
  } catch (error) {
    console.error("Error in getTrackedOrderAction:", error);
    return {
      success: false,
      error:
        "Error de red al actualizar los datos del pedido. Por favor intenta de nuevo.",
    };
  }
}

/**
 * Retrieve order details for Strapi Live Preview mode (Draft Mode)
 * Server-only action, protected by draftMode and PREVIEW_SECRET
 */
export async function getPreviewOrderAction(params: {
  orderNumber?: string;
  documentId?: string;
}): Promise<TrackingActionResult<TrackedOrder>> {
  try {
    const { draftMode } = await import("next/headers");
    const draft = await draftMode();

    if (!draft.isEnabled) {
      return {
        success: false,
        error: "Modo previsualización no habilitado.",
      };
    }

    const { orderNumber, documentId } = params;
    if (!orderNumber && !documentId) {
      return {
        success: false,
        error: "Se requiere un identificador de pedido para la previsualización.",
      };
    }

    const previewSecret =
      process.env.PREVIEW_SECRET || "bambil_preview_secret_key_2026";

    const queryParams = new URLSearchParams();
    queryParams.set("secret", previewSecret);
    if (documentId) queryParams.set("documentId", documentId.trim());
    if (orderNumber) queryParams.set("orderNumber", orderNumber.trim());

    const response = await fetch(
      `${getStrapiApiUrl()}/orders/preview?${queryParams.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.order) {
      return {
        success: false,
        error:
          data?.error?.message ||
          data?.message ||
          "No se encontró el pedido para previsualizar.",
      };
    }

    return {
      success: true,
      data: data.order as TrackedOrder,
    };
  } catch (error) {
    console.error("Error in getPreviewOrderAction:", error);
    return {
      success: false,
      error: "Error al cargar la previsualización del pedido.",
    };
  }
}
