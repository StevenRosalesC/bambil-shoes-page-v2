"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import {
  requestOrderOtpAction,
  verifyOrderOtpAction,
  getTrackedOrderAction,
} from "@/actions/tracking";
import OrderLookupForm from "./OrderLookupForm";
import OrderDetailView from "./OrderDetailView";
import { useGlobalInfo } from "@/providers/global-info-provider";
import { useTrackingStore } from "@/store/useTrackingStore";

interface OrderTrackingContainerProps {
  initialOrderNumber?: string;
  initialEmail?: string;
}

export default function OrderTrackingContainer({
  initialOrderNumber = "",
  initialEmail = "",
}: OrderTrackingContainerProps) {
  const { globalInfo } = useGlobalInfo();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const {
    token,
    orderNumber,
    email,
    maskedEmail,
    order,
    step,
    setLookupData,
    setSession,
    updateOrder,
    clearSession,
  } = useTrackingStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | undefined>(undefined);
  const [waitSeconds, setWaitSeconds] = useState<number | undefined>(undefined);

  // Revalidate order in background when session is already active
  useEffect(() => {
    if (!mounted || !token || !orderNumber) return;

    let isMounted = true;
    getTrackedOrderAction(orderNumber, token).then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        updateOrder(res.data);
      } else if (res.error?.includes("expirado")) {
        clearSession();
        setErrorMessage("Tu sesión de consulta ha expirado. Por favor solicita un nuevo código.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [mounted, token, orderNumber, updateOrder, clearSession]);

  // Step 1: Request OTP
  const handleRequestOtp = async (
    cleanOrderNumber: string,
    cleanEmail: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);
    setWaitSeconds(undefined);

    try {
      const result = await requestOrderOtpAction(cleanOrderNumber, cleanEmail);

      if (!result.success) {
        setErrorMessage(result.error || "No fue posible solicitar el código de verificación.");
        setWaitSeconds(result.waitSeconds);
        return false;
      }

      setLookupData(cleanOrderNumber, cleanEmail, result.data?.maskedEmail);
      setInfoMessage(result.message || "Hemos enviado el código de verificación a tu correo.");
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (cleanCode: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRemainingAttempts(undefined);

    try {
      const activeOrderNumber = orderNumber || initialOrderNumber;
      const activeEmail = email || initialEmail;
      const result = await verifyOrderOtpAction(activeOrderNumber, activeEmail, cleanCode);

      if (!result.success || !result.data) {
        setErrorMessage(result.error || "El código ingresado es incorrecto.");
        setRemainingAttempts(result.remainingAttempts);
        return;
      }

      setSession(result.data.token, result.data.order);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setErrorMessage(null);
    setRemainingAttempts(undefined);

    const activeOrderNumber = orderNumber || initialOrderNumber;
    const activeEmail = email || initialEmail;
    const result = await requestOrderOtpAction(activeOrderNumber, activeEmail);

    if (!result.success) {
      setErrorMessage(result.error || "No fue posible reenviar el código.");
      setWaitSeconds(result.waitSeconds);
      return;
    }

    setInfoMessage(result.message || "Código reenviado exitosamente. Por favor revisa tu bandeja.");
  };

  // Manual Refresh
  const handleRefreshOrder = useCallback(async () => {
    if (!token || !orderNumber) return;
    setIsRefreshing(true);

    try {
      const result = await getTrackedOrderAction(orderNumber, token);
      if (result.success && result.data) {
        updateOrder(result.data);
      } else if (result.error?.includes("expirado")) {
        clearSession();
        setErrorMessage("Tu sesión de consulta ha expirado. Por favor solicita un nuevo código.");
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [token, orderNumber, updateOrder, clearSession]);

  // Track Another Order (Reset)
  const handleTrackAnother = () => {
    clearSession();
    setErrorMessage(null);
    setInfoMessage(null);
    setRemainingAttempts(undefined);
    setWaitSeconds(undefined);
  };

  // If not mounted yet (SSR), render clean initial lookup form
  if (!mounted) {
    return (
      <div className="w-full">
        <OrderLookupForm
          initialOrderNumber={initialOrderNumber}
          initialEmail={initialEmail}
          onRequestOtp={async () => false}
          onVerifyOtp={async () => {}}
          onResendOtp={async () => {}}
          isLoading={false}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {step !== "DETAIL" && (
        <OrderLookupForm
          initialOrderNumber={orderNumber || initialOrderNumber}
          initialEmail={email || initialEmail}
          maskedEmail={maskedEmail}
          isOtpSent={step === "OTP"}
          onRequestOtp={handleRequestOtp}
          onVerifyOtp={handleVerifyOtp}
          onResendOtp={handleResendOtp}
          onReset={handleTrackAnother}
          isLoading={isLoading}
          errorMessage={errorMessage}
          infoMessage={infoMessage}
          remainingAttempts={remainingAttempts}
          waitSeconds={waitSeconds}
        />
      )}

      {step === "DETAIL" && order && (
        <OrderDetailView
          order={order}
          onRefresh={handleRefreshOrder}
          onTrackAnother={handleTrackAnother}
          isRefreshing={isRefreshing}
          storeWhatsappNumber={globalInfo?.whatsappNumber}
        />
      )}
    </div>
  );
}
