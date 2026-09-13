import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import OrderTrackingContainer from "@/components/tracking/OrderTrackingContainer";
import OrderPreviewView from "@/components/tracking/OrderPreviewView";
import { getPreviewOrderAction } from "@/actions/tracking";
import { getGlobalInfoAction } from "@/actions/global";

export const metadata: Metadata = {
  title: "Rastreo de Pedidos | Estado de tu Compra",
  description:
    "Consulta en tiempo real el avance de confección artesanal y el estado de entrega de tu pedido de Bambil Shoes By Dario.",
  openGraph: {
    title: "Rastreo de Pedidos | Bambil Shoes By Dario",
    description:
      "Consulta en tiempo real el avance de confección artesanal y el estado de entrega de tu pedido.",
    images: [{ url: "/Logo.png", alt: "Bambil Shoes Rastreo de Pedidos" }],
  },
};

interface TrackingPageProps {
  searchParams: Promise<{
    order?: string;
    orderNumber?: string;
    email?: string;
    pedido?: string;
    documentId?: string;
    previewId?: string;
  }>;
}

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
  const params = await searchParams;
  const initialOrderNumber = params.pedido || params.order || params.orderNumber || "";
  const documentId = params.documentId || params.previewId || "";
  const initialEmail = params.email || "";

  // Check if Strapi draft / preview mode is enabled
  let isPreviewMode = false;
  try {
    const draft = await draftMode();
    isPreviewMode = draft.isEnabled;
  } catch {
    isPreviewMode = false;
  }

  let previewOrder = null;
  let previewError: string | null = null;

  if (isPreviewMode && (initialOrderNumber || documentId)) {
    const res = await getPreviewOrderAction({
      orderNumber: initialOrderNumber || undefined,
      documentId: documentId || undefined,
    });
    if (res.success && res.data) {
      previewOrder = res.data;
    } else {
      previewError = res.error || "No se encontró el pedido en modo previsualización.";
    }
  }

  const globalInfo = await getGlobalInfoAction();

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 sm:pt-28 pb-20 bg-[#fcf9f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Inicio", href: "/" },
                { label: "Rastreo de Pedidos" },
              ]}
            />
          </div>

          {/* If in preview mode and order loaded, render preview view directly */}
          {isPreviewMode && previewOrder ? (
            <OrderPreviewView
              order={previewOrder}
              storeWhatsappNumber={globalInfo?.whatsappNumber}
            />
          ) : isPreviewMode && previewError ? (
            <div className="max-w-xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center shadow-xs">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-800 mb-4">
                <span className="material-symbols-outlined text-2xl">visibility_off</span>
              </div>
              <h2 className="font-display text-xl font-bold text-amber-900 mb-2">
                Previsualización de Orden
              </h2>
              <p className="font-sans text-sm text-amber-800 mb-6">
                {previewError}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/api/exit-preview?redirect=/tracking"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-900 text-white font-sans text-xs font-semibold hover:bg-amber-950 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  Salir del Modo Previsualización
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Editorial Section Header (Standard Public Flow) */}
              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                <span className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-[#725a39] mb-2 block">
                  Taller & Logística Artesanal
                </span>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#26170c] tracking-tight text-balance">
                  Estado de tus Órdenes
                </h1>
                <p className="font-sans text-sm sm:text-base text-[#4f453f] mt-3 leading-relaxed">
                  Cada par de calzado cuenta una historia de dedicación. Consulta la etapa de armado en taller y el avance de tu entrega.
                </p>
              </div>

              {/* Interactive Tracking Flow (Protected with OTP for public users) */}
              <OrderTrackingContainer
                initialOrderNumber={initialOrderNumber}
                initialEmail={initialEmail}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
}
