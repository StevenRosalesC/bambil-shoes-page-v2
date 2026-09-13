import { OrderStatus, OrderType, PaymentMethod, TrackingOrderItemProduct } from "@/types/OrderTracking";

export const DEFAULT_SHOE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD_dNoiXnJaWGkaO5zFoLW99yActG5gx032RgLySpxypzs3oiMQiOFy4j6EPfnhz-BOp7prPWR3rYM5px5zQuLjxOMP-3ZZ00wQTdlHLSkM83oDo1GQ3YL5sPOtrbOMCSKIgQV0N_I7EIwyYnVlMkURM6f26knM89Yp_h1dIwHpCulSoWVgBFTgEBma9FCwdTsnBylUDsa4UiDtflyhe_kySFb7iIDmoJ6Ca8BWvO4z6jEm8be0JrLhmroyjW0Y5cD_onFUquGih9pm";

export function formatCurrency(value?: number | null): string {
  const num = typeof value === "number" ? value : 0;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function resolveTrackingProductImage(
  product?: TrackingOrderItemProduct | null
): string {
  if (!product || !product.images || product.images.length === 0) {
    return DEFAULT_SHOE_IMAGE;
  }

  const firstImg = product.images[0];
  let rawUrl: string | undefined;

  if (typeof firstImg === "string") {
    rawUrl = firstImg;
  } else if (typeof firstImg === "object" && firstImg !== null) {
    const imgObj = firstImg as {
      url?: string;
      formats?: Record<string, { url?: string } | undefined>;
    };
    rawUrl =
      imgObj.formats?.small?.url ||
      imgObj.formats?.thumbnail?.url ||
      imgObj.url;
  }

  if (!rawUrl) return DEFAULT_SHOE_IMAGE;

  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  if (rawUrl.startsWith("/uploads")) {
    const strapiBase =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    return `${strapiBase}${rawUrl}`;
  }

  return rawUrl;
}

export interface StatusConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: string;
  description: string;
  stepIndex: number;
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    label: "Pedido Confirmado",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    icon: "receipt_long",
    description: "Tu pedido ha sido recibido y está en cola para preparación de materiales.",
    stepIndex: 1,
  },
  IN_WORKSHOP: {
    label: "En Taller Artesanal",
    badgeBg: "bg-[#fbdbb0]/60",
    badgeText: "text-[#584324]",
    badgeBorder: "border-[#dec1af]",
    icon: "handyman",
    description: "Nuestros artesanos en Colonche están confeccionando tu calzado a mano.",
    stepIndex: 2,
  },
  READY_FOR_SHIPPING: {
    label: "Listo para Envío",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-200",
    icon: "inventory_2",
    description: "Tu calzado pasó el control de calidad, está empacado y esperando a la transportadora.",
    stepIndex: 3,
  },
  SHIPPED: {
    label: "En Camino",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-800",
    badgeBorder: "border-indigo-200",
    icon: "local_shipping",
    description: "El paquete ya fue entregado a la empresa de mensajería y va rumbo a tu dirección.",
    stepIndex: 4,
  },
  DELIVERED: {
    label: "Entregado",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-200",
    icon: "task_alt",
    description: "¡El pedido ha sido entregado exitosamente! Esperamos que disfrutes tu calzado artesanal.",
    stepIndex: 5,
  },
  CANCELLED: {
    label: "Pedido Cancelado",
    badgeBg: "bg-red-50",
    badgeText: "text-red-800",
    badgeBorder: "border-red-200",
    icon: "cancel",
    description: "Este pedido ha sido cancelado. Si tienes dudas, contáctanos directamente por WhatsApp.",
    stepIndex: -1,
  },
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  IMMEDIATE_DELIVERY: "Entrega Inmediata (Stock listo)",
  ON_DEMAND: "Confección Bajo Pedido (Hecho a Mano)",
  MIXED: "Pedido Mixto (Stock + Confección)",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, { label: string; icon: string }> = {
  BANK_TRANSFER: {
    label: "Transferencia Bancaria",
    icon: "account_balance",
  },
  CASH_ON_DELIVERY: {
    label: "Pago Contra Entrega",
    icon: "payments",
  },
  ARRANGE_VIA_WHATSAPP: {
    label: "Coordinado por WhatsApp",
    icon: "chat",
  },
};
