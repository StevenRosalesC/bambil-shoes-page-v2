import React from "react";
import { OrderStatus } from "@/types/OrderTracking";
import { STATUS_CONFIG, formatDate } from "@/lib/tracking-utils";

interface OrderTimelineProps {
  status: OrderStatus;
  estimatedReadyDate?: string | null;
  trackingNumber?: string | null;
}

interface StepItem {
  id: OrderStatus;
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: string;
}

const STEPS: StepItem[] = [
  {
    id: "PENDING",
    stepNumber: 1,
    title: "Pedido Confirmado",
    subtitle: "Recepción y alistamiento de pieles y hormas",
    icon: "receipt_long",
  },
  {
    id: "IN_WORKSHOP",
    stepNumber: 2,
    title: "En Taller Artesanal",
    subtitle: "Corte, aparado y armado manual en Colonche",
    icon: "handyman",
  },
  {
    id: "READY_FOR_SHIPPING",
    stepNumber: 3,
    title: "Listo para Envío",
    subtitle: "Control de calidad artesanal y empaque",
    icon: "inventory_2",
  },
  {
    id: "SHIPPED",
    stepNumber: 4,
    title: "En Camino",
    subtitle: "En manos de la transportadora hacia tu dirección",
    icon: "local_shipping",
  },
  {
    id: "DELIVERED",
    stepNumber: 5,
    title: "Entregado",
    subtitle: "Calzado recibido en tu destino",
    icon: "task_alt",
  },
];

export default function OrderTimeline({
  status,
  estimatedReadyDate,
  trackingNumber,
}: OrderTimelineProps) {
  // If order is cancelled, show clear cancellation notice
  if (status === "CANCELLED") {
    return (
      <div className="bg-red-50/80 border border-red-200 rounded-xl p-6 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-700">
          <span className="material-symbols-outlined text-2xl">cancel</span>
        </div>
        <div className="flex-1">
          <h4 className="font-display text-lg font-bold text-red-900">
            Este pedido ha sido cancelado
          </h4>
          <p className="font-sans text-sm text-red-700 mt-1">
            Si crees que se trata de un error o deseas reactivar tu compra de calzado, ponte en contacto con nuestro taller directamente para brindarte asistencia.
          </p>
        </div>
      </div>
    );
  }

  const currentStepConfig = STATUS_CONFIG[status];
  const currentStepIndex = currentStepConfig?.stepIndex || 1;

  return (
    <div className="bg-white rounded-2xl border border-[#d2c4bc]/50 p-6 md:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#d2c4bc]/30">
        <div>
          <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#725a39]">
            Seguimiento de Producción & Entrega
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#26170c] mt-0.5">
            {currentStepConfig?.label || "Estado del Pedido"}
          </h3>
        </div>
        <p className="font-sans text-xs text-[#4f453f] max-w-sm sm:text-right">
          {currentStepConfig?.description}
        </p>
      </div>

      {/* Dynamic Notices (Estimated Date or Tracking Guide) */}
      {(estimatedReadyDate || trackingNumber) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {estimatedReadyDate && (
            <div className="inline-flex items-center gap-2 bg-[#f6f3ec] border border-[#d2c4bc]/60 px-3.5 py-2 rounded-lg text-xs font-sans text-[#26170c]">
              <span className="material-symbols-outlined text-base text-[#725a39]">
                calendar_clock
              </span>
              <span>
                <strong className="font-semibold text-[#26170c]">Fecha estimada en taller:</strong>{" "}
                {formatDate(estimatedReadyDate)}
              </span>
            </div>
          )}

          {trackingNumber && (
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-lg text-xs font-sans text-indigo-900">
              <span className="material-symbols-outlined text-base text-indigo-600">
                local_shipping
              </span>
              <span>
                <strong className="font-semibold">Número de Guía:</strong> {trackingNumber}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Desktop / Tablet Horizontal Timeline */}
      <div className="hidden md:block mt-8 pt-2">
        <div className="grid grid-cols-5 relative">
          {STEPS.map((step, index) => {
            const isCompleted = step.stepNumber < currentStepIndex;
            const isCurrent = step.stepNumber === currentStepIndex;

            return (
              <div key={step.id} className="relative flex flex-col items-center">
                {/* Connecting Line to next step */}
                {index < STEPS.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-[3px] -translate-y-1/2 z-0 bg-[#ebe8e1]">
                    {/* Active Line Fill */}
                    <div
                      className={`h-full bg-[#26170c] transition-all duration-500 ${
                        step.stepNumber < currentStepIndex ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}

                {/* Fixed-size Circle Wrapper (guarantees perfect vertical centering at y = 24px) */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isCompleted
                        ? "bg-[#26170c] text-white ring-4 ring-white"
                        : isCurrent
                        ? "bg-[#fbdbb0] text-[#26170c] ring-4 ring-[#725a39]/30 ring-offset-2 ring-offset-white animate-pulse"
                        : "bg-[#ebe8e1] text-[#81756e] ring-4 ring-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {isCompleted ? "check" : step.icon}
                    </span>
                  </div>
                </div>

                {/* Step Labels (isolated below the circle wrapper) */}
                <div className="mt-3 text-center px-1.5 flex flex-col items-center">
                  <span
                    className={`block font-sans text-xs uppercase tracking-wider font-bold transition-colors ${
                      isCurrent
                        ? "text-[#26170c]"
                        : isCompleted
                        ? "text-[#4f453f]"
                        : "text-[#81756e]"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="block font-sans text-[11px] text-[#705a4c] mt-0.5 leading-tight">
                    {step.subtitle}
                  </span>

                  {isCurrent && (
                    <span className="mt-2 text-[9px] font-sans font-bold uppercase tracking-wider bg-[#26170c] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      Etapa Actual
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="md:hidden mt-6 space-y-6 relative">
        {STEPS.map((step, index) => {
          const isCompleted = step.stepNumber < currentStepIndex;
          const isCurrent = step.stepNumber === currentStepIndex;

          return (
            <div key={step.id} className="flex items-start gap-4 relative">
              {/* Column for Circle + Centered Vertical Line */}
              <div className="relative flex flex-col items-center shrink-0 w-9">
                {/* Vertical Line to next step */}
                {index < STEPS.length - 1 && (
                  <div className="absolute top-9 bottom-[-24px] left-1/2 -translate-x-1/2 w-0.5 bg-[#ebe8e1] z-0">
                    <div
                      className={`w-full bg-[#26170c] transition-all duration-500 ${
                        step.stepNumber < currentStepIndex ? "h-full" : "h-0"
                      }`}
                    />
                  </div>
                )}

                {/* Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10 transition-colors ${
                    isCompleted
                      ? "bg-[#26170c] text-white ring-4 ring-white"
                      : isCurrent
                      ? "bg-[#fbdbb0] text-[#26170c] ring-4 ring-[#725a39]/30 ring-offset-2 ring-offset-white"
                      : "bg-[#ebe8e1] text-[#81756e] ring-4 ring-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isCompleted ? "check" : step.icon}
                  </span>
                </div>
              </div>

              {/* Step Text */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5
                    className={`font-sans text-sm font-bold ${
                      isCurrent
                        ? "text-[#26170c]"
                        : isCompleted
                        ? "text-[#4f453f]"
                        : "text-[#81756e]"
                    }`}
                  >
                    {step.title}
                  </h5>
                  {isCurrent && (
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider bg-[#26170c] text-white px-2 py-0.5 rounded-full">
                      Etapa Actual
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-[#705a4c] mt-0.5">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
