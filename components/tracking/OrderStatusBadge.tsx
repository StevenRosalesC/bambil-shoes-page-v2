import React from "react";
import { OrderStatus } from "@/types/OrderTracking";
import { STATUS_CONFIG } from "@/lib/tracking-utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export default function OrderStatusBadge({
  status,
  size = "md",
  showIcon = true,
  className = "",
}: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    badgeBg: "bg-stone-100",
    badgeText: "text-stone-800",
    badgeBorder: "border-stone-200",
    icon: "info",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5",
    lg: "text-sm px-4 py-1.5 gap-2 font-bold",
  };

  const iconSizes = {
    sm: "text-[14px]",
    md: "text-[16px]",
    lg: "text-[18px]",
  };

  return (
    <span
      className={`inline-flex items-center font-sans font-semibold rounded-full border shadow-2xs transition-colors ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} ${sizeStyles[size]} ${className}`}
    >
      {showIcon && (
        <span className={`material-symbols-outlined shrink-0 ${iconSizes[size]}`} aria-hidden="true">
          {config.icon}
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
}
