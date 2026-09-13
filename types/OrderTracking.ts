export type OrderStatus =
  | "PENDING"
  | "IN_WORKSHOP"
  | "READY_FOR_SHIPPING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderType = "IMMEDIATE_DELIVERY" | "ON_DEMAND" | "MIXED";

export type PaymentMethod =
  | "BANK_TRANSFER"
  | "CASH_ON_DELIVERY"
  | "ARRANGE_VIA_WHATSAPP";

export interface TrackingOrderItemProduct {
  documentId?: string;
  name: string;
  slug?: string;
  images?: Array<string | { url?: string; formats?: Record<string, unknown> }>;
}

export interface TrackingOrderItem {
  id?: number;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  fulfillmentType: "IMMEDIATE_DELIVERY" | "ON_DEMAND";
  productionDays?: number | null;
  notes?: string | null;
  product?: TrackingOrderItemProduct | null;
}

export interface TrackedOrder {
  documentId?: string;
  orderNumber: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingCity?: string;
  shippingAddress?: string;
  paymentMethod: PaymentMethod;
  estimatedReadyDate?: string | null;
  trackingNumber?: string | null;
  customerNotes?: string | null;
  subtotal: number;
  discount?: number;
  shippingCost?: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: TrackingOrderItem[];
}

export interface TrackingActionResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  remainingAttempts?: number;
  waitSeconds?: number;
}

export interface VerifyOtpResultData {
  token: string;
  order: TrackedOrder;
}
