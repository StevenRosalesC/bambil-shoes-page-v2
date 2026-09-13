"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrackedOrder } from "@/types/OrderTracking";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  resolveTrackingProductImage,
  ORDER_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/tracking-utils";

interface OrderDetailViewProps {
  order: TrackedOrder;
  onRefresh: () => Promise<void>;
  onTrackAnother: () => void;
  isRefreshing: boolean;
  storeWhatsappNumber?: string;
}

export default function OrderDetailView({
  order,
  onRefresh,
  onTrackAnother,
  isRefreshing,
  storeWhatsappNumber = "593993833765",
}: OrderDetailViewProps) {
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleCopyTrackingNumber = () => {
    if (!order.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // WhatsApp helper
  const cleanPhone = (storeWhatsappNumber || "593993833765").replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `¡Hola Bambil Shoes! Deseo hacer una consulta sobre mi pedido *${order.orderNumber}* a nombre de ${order.customerName}.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  const paymentInfo = PAYMENT_METHOD_LABELS[order.paymentMethod] || {
    label: order.paymentMethod,
    icon: "payments",
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#d2c4bc]/60 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#d2c4bc]/30">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans text-xs font-bold text-[#725a39] uppercase tracking-widest">
                Detalle del Pedido
              </span>
              <span className="text-[#a8998f]">•</span>
              <span className="font-sans text-xs text-[#705a4c]">
                Realizado el {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#26170c]">
                {order.orderNumber}
              </h1>

              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                title="Copiar número de pedido"
                className="inline-flex items-center gap-1 p-1.5 rounded-md hover:bg-[#f0eee7] text-[#705a4c] hover:text-[#26170c] transition-colors text-xs font-sans"
              >
                <span className="material-symbols-outlined text-base">
                  {copiedNumber ? "check" : "content_copy"}
                </span>
                <span className="text-[11px]">
                  {copiedNumber ? "¡Copiado!" : "Copiar"}
                </span>
              </button>
            </div>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <OrderStatusBadge status={order.orderStatus} size="lg" />

            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#d2c4bc] bg-[#fcf9f2] hover:bg-white text-[#26170c] text-xs font-sans font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <span
                className={`material-symbols-outlined text-base ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              >
                refresh
              </span>
              <span>{isRefreshing ? "Actualizando..." : "Actualizar"}</span>
            </button>
          </div>
        </div>

        {/* Sub-header meta information */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-[#705a4c]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#26170c]">Tipo de Pedido:</span>
            <span className="bg-[#f0eee7] px-2.5 py-1 rounded-full text-[#4f453f] font-medium">
              {ORDER_TYPE_LABELS[order.orderType] || order.orderType}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-[#725a39]">
              update
            </span>
            <span>Última actualización: {formatDateTime(order.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Progress Stepper & Timeline */}
      <OrderTimeline
        status={order.orderStatus}
        estimatedReadyDate={order.estimatedReadyDate}
        trackingNumber={order.trackingNumber}
      />

      {/* Grid: Items (Left) vs Shipping & Financial Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Items (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-[#d2c4bc]/60 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#d2c4bc]/30">
              <h3 className="font-display text-lg font-bold text-[#26170c]">
                Artículos del Pedido ({order.items?.length || 0})
              </h3>
              <span className="font-sans text-xs text-[#705a4c] font-medium">
                Calzado Hecho a Mano
              </span>
            </div>

            <div className="divide-y divide-[#d2c4bc]/30 mt-4">
              {order.items?.map((item, idx) => {
                const imageUrl = resolveTrackingProductImage(item.product);
                const productHref =
                  item.product?.slug || item.product?.documentId
                    ? `/product/${item.product.slug || item.product.documentId}`
                    : null;

                return (
                  <div key={item.id || idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {/* Shoe Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#f6f3ec] border border-[#d2c4bc]/50 shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.productName}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    {/* Shoe Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          {productHref ? (
                            <Link
                              href={productHref}
                              className="font-display text-base font-semibold text-[#26170c] hover:text-[#725a39] transition-colors leading-tight"
                            >
                              {item.productName}
                            </Link>
                          ) : (
                            <h4 className="font-display text-base font-semibold text-[#26170c] leading-tight">
                              {item.productName}
                            </h4>
                          )}
                          <span className="font-sans text-sm font-bold text-[#26170c] shrink-0">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>

                        {/* Size & Quantity */}
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs font-sans text-[#705a4c]">
                          <span className="inline-flex items-center bg-[#f0eee7] px-2 py-0.5 rounded font-semibold text-[#26170c]">
                            Talla: {item.size}
                          </span>
                          <span>
                            Cant: <strong className="text-[#26170c]">{item.quantity}</strong> ×{" "}
                            {formatCurrency(item.unitPrice)}
                          </span>
                        </div>

                        {/* Fulfillment Badge */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.fulfillmentType === "ON_DEMAND" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-[#765f3d] bg-[#fbdbb0]/50 px-2 py-0.5 rounded-full border border-[#fbdbb0]">
                              <span className="material-symbols-outlined text-[13px]">
                                precision_manufacturing
                              </span>
                              Bajo Pedido ({item.productionDays || 7} días hábiles)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <span className="material-symbols-outlined text-[13px]">bolt</span>
                              Entrega Inmediata
                            </span>
                          )}
                        </div>

                        {/* Customer notes on item */}
                        {item.notes && (
                          <p className="mt-2 text-[11px] font-sans text-[#705a4c] bg-[#fcf9f2] p-2 rounded border border-[#d2c4bc]/40 italic">
                            &quot;{item.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Shipping & Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping & Delivery Info */}
          <div className="bg-white rounded-2xl border border-[#d2c4bc]/60 p-6 shadow-xs">
            <h3 className="font-display text-lg font-bold text-[#26170c] pb-3 border-b border-[#d2c4bc]/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-[#725a39]">
                local_shipping
              </span>
              <span>Datos de Entrega</span>
            </h3>

            <div className="mt-4 space-y-3 font-sans text-xs sm:text-sm">
              <div>
                <span className="block text-[11px] uppercase tracking-wider font-bold text-[#725a39]">
                  Destinatario
                </span>
                <p className="font-semibold text-[#26170c]">{order.customerName}</p>
                {order.customerPhone && (
                  <p className="text-xs text-[#705a4c] mt-0.5">{order.customerPhone}</p>
                )}
              </div>

              <div>
                <span className="block text-[11px] uppercase tracking-wider font-bold text-[#725a39]">
                  Dirección de Envío
                </span>
                <p className="text-[#26170c]">{order.shippingAddress || "Por coordinar"}</p>
                {order.shippingCity && (
                  <p className="text-xs text-[#705a4c] font-medium mt-0.5">
                    {order.shippingCity}
                  </p>
                )}
              </div>

              {/* Courier tracking number if available */}
              {order.trackingNumber && (
                <div className="pt-2 border-t border-[#d2c4bc]/30">
                  <span className="block text-[11px] uppercase tracking-wider font-bold text-[#725a39]">
                    Número de Guía Transportadora
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm font-bold text-[#26170c] bg-[#f0eee7] px-2.5 py-1 rounded">
                      {order.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTrackingNumber}
                      className="p-1 rounded hover:bg-[#f0eee7] text-[#705a4c] transition-colors"
                      title="Copiar guía"
                    >
                      <span className="material-symbols-outlined text-base">
                        {copiedTracking ? "check" : "content_copy"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Financial Summary */}
          <div className="bg-white rounded-2xl border border-[#d2c4bc]/60 p-6 shadow-xs">
            <h3 className="font-display text-lg font-bold text-[#26170c] pb-3 border-b border-[#d2c4bc]/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-[#725a39]">
                receipt
              </span>
              <span>Resumen Financiero</span>
            </h3>

            <div className="mt-4 space-y-2.5 font-sans text-xs sm:text-sm">
              <div className="flex justify-between text-[#705a4c]">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>

              {Boolean(order.discount && order.discount > 0) && (
                <div className="flex justify-between text-emerald-800">
                  <span>Descuento</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#705a4c]">
                <span>Costo de Envío</span>
                <span>
                  {order.shippingCost && order.shippingCost > 0
                    ? formatCurrency(order.shippingCost)
                    : "Gratis / Incluido"}
                </span>
              </div>

              <div className="pt-3 border-t border-[#d2c4bc]/40 flex justify-between items-center">
                <span className="font-display text-base font-bold text-[#26170c]">Total</span>
                <span className="font-display text-xl font-bold text-[#26170c]">
                  {formatCurrency(order.total)}
                </span>
              </div>

              {/* Payment Method Badge */}
              <div className="pt-3 border-t border-[#d2c4bc]/30 flex items-center gap-2 text-xs text-[#705a4c]">
                <span className="material-symbols-outlined text-base text-[#725a39]">
                  {paymentInfo.icon}
                </span>
                <span>
                  Método de pago: <strong className="text-[#26170c]">{paymentInfo.label}</strong>
                </span>
              </div>
            </div>

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="mt-4 pt-3 border-t border-[#d2c4bc]/30">
                <span className="block text-[11px] uppercase tracking-wider font-bold text-[#725a39] mb-1">
                  Notas de Entrega
                </span>
                <p className="font-sans text-xs text-[#4f453f] bg-[#fcf9f2] p-2.5 rounded-lg border border-[#d2c4bc]/40">
                  {order.customerNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions & Support Bar */}
      <div className="bg-[#3d2b1f] text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="text-center sm:text-left">
          <h4 className="font-display text-lg font-bold text-white">
            ¿Tienes alguna consulta sobre tu calzado artesanal?
          </h4>
          <p className="font-sans text-xs text-[#dec1af] mt-1 max-w-md">
            Atención directa con Darío en el taller para personalizar, consultar fechas o coordinar detalles de tu entrega.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* WhatsApp Direct Action */}
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:brightness-105 text-[#1c1c18] font-sans text-xs uppercase tracking-wider font-bold py-3.5 px-5 rounded-lg transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            <span>Consultar por WhatsApp</span>
          </Link>

          {/* Track Another Order Button */}
          <button
            type="button"
            onClick={onTrackAnother}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-sans text-xs font-semibold py-3.5 px-4 rounded-lg transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Rastrear otro pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
}
