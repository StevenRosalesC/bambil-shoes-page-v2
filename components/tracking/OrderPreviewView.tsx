"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TrackedOrder } from "@/types/OrderTracking";
import OrderDetailView from "./OrderDetailView";

interface OrderPreviewViewProps {
  order: TrackedOrder;
  storeWhatsappNumber?: string;
}

export default function OrderPreviewView({
  order,
  storeWhatsappNumber,
}: OrderPreviewViewProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExitPreview = () => {
    router.push("/api/exit-preview?redirect=/tracking");
  };

  return (
    <div className="w-full">
      <OrderDetailView
        order={order}
        onRefresh={handleRefresh}
        onTrackAnother={handleExitPreview}
        isRefreshing={isRefreshing}
        storeWhatsappNumber={storeWhatsappNumber}
      />
    </div>
  );
}
