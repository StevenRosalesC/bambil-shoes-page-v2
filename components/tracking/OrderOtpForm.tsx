"use client";

import React, { useState, useEffect, useRef } from "react";

interface OrderOtpFormProps {
  orderNumber: string;
  email: string;
  maskedEmail?: string;
  infoMessage?: string | null;
  errorMessage?: string | null;
  remainingAttempts?: number;
  isLoading: boolean;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

export default function OrderOtpForm({
  orderNumber,
  email,
  maskedEmail,
  infoMessage,
  errorMessage,
  remainingAttempts,
  isLoading,
  onVerify,
  onResend,
  onBack,
}: OrderOtpFormProps) {
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 60-second cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 8 || isLoading) return;
    await onVerify(cleanCode);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending || isLoading) return;
    setIsResending(true);
    try {
      await onResend();
      setResendCooldown(60);
      setCode("");
    } finally {
      setIsResending(false);
    }
  };

  const displayEmail =
    maskedEmail ||
    (email.includes("@")
      ? `${email[0]}***${email[email.indexOf("@") - 1] || ""}@${email.split("@")[1]}`
      : email);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#d2c4bc]/60 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#725a39]" />

        {/* Back Link */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#705a4c] hover:text-[#26170c] transition-colors mb-6 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Volver o cambiar pedido</span>
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#fbdbb0]/50 border border-[#dec1af] text-[#26170c] mb-3 shadow-2xs">
            <span className="material-symbols-outlined text-3xl">key</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#26170c]">
            Código de Verificación
          </h2>
          <p className="font-sans text-sm text-[#705a4c] mt-2 max-w-md mx-auto leading-relaxed">
            Hemos enviado un código seguro de 8 dígitos a{" "}
            <strong className="text-[#26170c] font-semibold">{displayEmail}</strong> para el pedido{" "}
            <span className="font-bold text-[#26170c]">{orderNumber}</span>.
          </p>
        </div>

        {/* Success Info Message */}
        {infoMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-sans flex items-start gap-3">
            <span className="material-symbols-outlined text-lg shrink-0 text-emerald-600">
              check_circle
            </span>
            <p className="font-medium">{infoMessage}</p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-sans flex items-start gap-3"
          >
            <span className="material-symbols-outlined text-lg shrink-0 text-red-600">
              error
            </span>
            <div className="flex-1">
              <p className="font-medium">{errorMessage}</p>
              {remainingAttempts !== undefined && (
                <p className="mt-1 text-xs font-semibold text-red-700">
                  {remainingAttempts === 1
                    ? "¡Último intento disponible antes de bloquear el código!"
                    : `Intentos restantes: ${remainingAttempts}`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="otpCode"
              className="block font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-2 text-center"
            >
              Ingresa el código de 8 dígitos
            </label>
            <div className="max-w-xs mx-auto">
              <input
                ref={inputRef}
                id="otpCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                  setCode(val);
                }}
                placeholder="••••••••"
                required
                className="w-full text-center py-4 bg-[#fcf9f2] border-2 border-[#d2c4bc] rounded-xl font-sans text-2xl font-bold text-[#26170c] tracking-[0.35em] placeholder:text-[#81756e]/40 focus:bg-white focus:border-[#26170c] focus:outline-none transition-all shadow-inner"
              />
            </div>
            <p className="text-center font-sans text-xs text-[#705a4c] mt-2">
              El código es válido durante 15 minutos.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || code.replace(/\D/g, "").length !== 8}
            className="w-full bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-xs sm:text-sm uppercase tracking-widest font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verificando código...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Verificar y Ver Pedido</span>
              </>
            )}
          </button>
        </form>

        {/* Resend Action */}
        <div className="mt-8 pt-6 border-t border-[#d2c4bc]/40 text-center flex flex-col items-center gap-2">
          <p className="font-sans text-xs text-[#705a4c]">
            ¿No recibiste el correo o se venció el código?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending || isLoading}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#725a39] hover:text-[#26170c] disabled:text-[#81756e] disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            {resendCooldown > 0
              ? `Reenviar nuevo código en ${resendCooldown}s`
              : isResending
              ? "Reenviando código..."
              : "Reenviar código de verificación"}
          </button>
          <span className="font-sans text-[11px] text-[#81756e]">
            Recuerda revisar también tu carpeta de Spam o Correo no deseado.
          </span>
        </div>
      </div>
    </div>
  );
}
