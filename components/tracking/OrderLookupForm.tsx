"use client";

import React, { useState, useEffect, useRef } from "react";

interface OrderLookupFormProps {
  initialOrderNumber?: string;
  initialEmail?: string;
  maskedEmail?: string;
  isOtpSent?: boolean;
  onRequestOtp: (orderNumber: string, email: string) => Promise<boolean>;
  onVerifyOtp: (code: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
  onReset?: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
  infoMessage?: string | null;
  remainingAttempts?: number;
  waitSeconds?: number;
}

export default function OrderLookupForm({
  initialOrderNumber = "",
  initialEmail = "",
  maskedEmail = "",
  isOtpSent = false,
  onRequestOtp,
  onVerifyOtp,
  onResendOtp,
  onReset,
  isLoading,
  errorMessage,
  infoMessage,
  remainingAttempts,
  waitSeconds,
}: OrderLookupFormProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(isOtpSent);
  const [isEditingData, setIsEditingData] = useState(!isOtpSent);
  const [cooldown, setCooldown] = useState(waitSeconds || (isOtpSent ? 60 : 0));
  const [isResending, setIsResending] = useState(false);

  const codeInputRef = useRef<HTMLInputElement>(null);

  // Sync props when initial values change
  const [prevInitialOrder, setPrevInitialOrder] = useState(initialOrderNumber);
  if (initialOrderNumber !== prevInitialOrder) {
    setPrevInitialOrder(initialOrderNumber);
    setOrderNumber(initialOrderNumber);
  }

  const [prevInitialEmail, setPrevInitialEmail] = useState(initialEmail);
  if (initialEmail !== prevInitialEmail) {
    setPrevInitialEmail(initialEmail);
    setEmail(initialEmail);
  }

  const [prevIsOtpSent, setPrevIsOtpSent] = useState(isOtpSent);
  if (isOtpSent !== prevIsOtpSent) {
    setPrevIsOtpSent(isOtpSent);
    if (isOtpSent) {
      setShowCodeInput(true);
      setIsEditingData(false);
    }
  }

  const [prevWaitSeconds, setPrevWaitSeconds] = useState(waitSeconds);
  if (waitSeconds !== prevWaitSeconds) {
    setPrevWaitSeconds(waitSeconds);
    if (waitSeconds && waitSeconds > 0) {
      setCooldown(waitSeconds);
    }
  }

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus code input when shown
  useEffect(() => {
    if (showCodeInput) {
      codeInputRef.current?.focus();
    }
  }, [showCodeInput]);

  // Handle Request Code
  const handleRequestCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanOrder = orderNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanOrder || !cleanEmail || isLoading || cooldown > 0) return;

    const success = await onRequestOtp(cleanOrder, cleanEmail);
    if (success) {
      setShowCodeInput(true);
      setIsEditingData(false);
      setCooldown(60);
      setCode("");
    }
  };

  // Handle Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 8 || isLoading) return;
    await onVerifyOtp(cleanCode);
  };

  // Handle Resend Code
  const handleResendCode = async () => {
    if (cooldown > 0 || isResending || isLoading) return;
    setIsResending(true);
    try {
      await onResendOtp();
      setCooldown(60);
      setCode("");
      codeInputRef.current?.focus();
    } finally {
      setIsResending(false);
    }
  };

  // Handle Edit Data
  const handleEditData = () => {
    setIsEditingData(true);
  };

  // Handle Reset / Change Order
  const handleResetForm = () => {
    setShowCodeInput(false);
    setIsEditingData(true);
    setCode("");
    onReset?.();
  };

  // Display Email for privacy
  const displayEmail =
    maskedEmail ||
    (email.includes("@")
      ? `${email[0]}***${email[email.indexOf("@") - 1] || ""}@${email.split("@")[1]}`
      : email);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Decorative Card */}
      <div className="bg-white rounded-2xl border border-[#d2c4bc]/60 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle accent border at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#26170c]" />

        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#f6f3ec] border border-[#d2c4bc]/50 text-[#26170c] mb-3 shadow-2xs">
            <span className="material-symbols-outlined text-3xl">travel_explore</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#26170c]">
            Rastrear Pedido
          </h2>
          <p className="font-sans text-sm text-[#705a4c] mt-2 max-w-md mx-auto leading-relaxed">
            Ingresa tu número de pedido y el correo con el que realizaste la compra para consultar el estado en taller y despacho.
          </p>
        </div>

        {/* Success / Info Alert */}
        {infoMessage && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-sans flex items-start gap-3 animate-fadeIn"
          >
            <span className="material-symbols-outlined text-lg shrink-0 text-emerald-600">
              check_circle
            </span>
            <p className="font-medium flex-1">{infoMessage}</p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-sans flex items-start gap-3 animate-fadeIn"
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
              {cooldown > 0 && !showCodeInput && (
                <p className="mt-1 text-xs text-red-700">
                  Podrás solicitar un nuevo código en: <strong className="font-bold">{cooldown}s</strong>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={showCodeInput ? handleVerifyCode : handleRequestCode} className="space-y-5">
          {/* Order Number */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="orderNumber"
                className="block font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider"
              >
                Número de Pedido <span className="text-[#ba1a1a]">*</span>
              </label>
              {showCodeInput && !isEditingData && (
                <button
                  type="button"
                  onClick={handleEditData}
                  className="text-xs font-sans text-[#725a39] hover:text-[#26170c] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Modificar</span>
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#81756e]">
                <span className="material-symbols-outlined text-xl">tag</span>
              </span>
              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="Ej. PBD-2026-0002"
                required
                disabled={showCodeInput && !isEditingData}
                className="w-full pl-11 pr-4 py-3.5 bg-[#fcf9f2] border border-[#d2c4bc] rounded-lg font-sans text-sm text-[#26170c] placeholder:text-[#81756e]/60 focus:bg-white focus:border-[#26170c] focus:outline-none transition-all uppercase tracking-wider font-semibold disabled:bg-gray-100 disabled:text-gray-700 disabled:cursor-not-allowed"
              />
            </div>
            <p className="font-sans text-[11px] text-[#705a4c] mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">info</span>
              Encuentra este código en tu comprobante de compra o correo de confirmación.
            </p>
          </div>

          {/* Customer Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider mb-2"
            >
              Correo Electrónico <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#81756e]">
                <span className="material-symbols-outlined text-xl">mail</span>
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                disabled={showCodeInput && !isEditingData}
                className="w-full pl-11 pr-4 py-3.5 bg-[#fcf9f2] border border-[#d2c4bc] rounded-lg font-sans text-sm text-[#26170c] placeholder:text-[#81756e]/60 focus:bg-white focus:border-[#26170c] focus:outline-none transition-all disabled:bg-gray-100 disabled:text-gray-700 disabled:cursor-not-allowed"
              />
            </div>
            <p className="font-sans text-[11px] text-[#705a4c] mt-1.5">
              Por tu seguridad, te enviaremos un código de verificación de 8 dígitos a este correo.
            </p>
          </div>

          {/* If editing data while code input was open, show button to re-request code */}
          {showCodeInput && isEditingData && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleRequestCode()}
                disabled={isLoading || cooldown > 0 || !orderNumber.trim() || !email.trim()}
                className="w-full bg-[#f6f3ec] hover:bg-[#ebe6dc] border border-[#d2c4bc] text-[#26170c] font-sans text-xs uppercase tracking-wider font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#26170c]/30 border-t-[#26170c] rounded-full animate-spin" />
                    <span>Enviando código...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>Actualizar datos y solicitar nuevo código</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* OTP code input box (appears upon requesting the code) */}
          {showCodeInput && (
            <div className="pt-2">
              <div className="bg-[#fcf9f2] rounded-xl border-2 border-[#dec1af] p-5 sm:p-6 shadow-xs animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#725a39] text-xl">key</span>
                    <label
                      htmlFor="otpCode"
                      className="block font-sans text-xs font-bold text-[#26170c] uppercase tracking-wider cursor-pointer"
                    >
                      Código de Verificación (8 dígitos) <span className="text-[#ba1a1a]">*</span>
                    </label>
                  </div>
                  <span className="text-[11px] font-sans text-[#705a4c] font-medium">
                    Válido por 15 min
                  </span>
                </div>

                <div className="max-w-xs mx-auto">
                  <input
                    ref={codeInputRef}
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
                    className="w-full text-center py-3.5 bg-white border-2 border-[#d2c4bc] rounded-lg font-sans text-2xl font-bold text-[#26170c] tracking-[0.35em] placeholder:text-[#81756e]/40 focus:border-[#26170c] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <p className="text-center font-sans text-[12px] text-[#705a4c] mt-3">
                  Ingresa el código que enviamos a{" "}
                  <strong className="text-[#26170c] font-semibold">{displayEmail}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            {showCodeInput ? (
              <button
                type="submit"
                disabled={isLoading || code.replace(/\D/g, "").length !== 8}
                className="w-full bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-xs sm:text-sm uppercase tracking-widest font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando y consultando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>Consultar Pedido</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || cooldown > 0 || !orderNumber.trim() || !email.trim()}
                className="w-full bg-[#26170c] hover:bg-[#3d2b1f] text-white font-sans text-xs sm:text-sm uppercase tracking-widest font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26170c]"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Solicitando código...</span>
                  </>
                ) : cooldown > 0 ? (
                  <>
                    <span className="material-symbols-outlined text-lg">timer</span>
                    <span>Espera {cooldown}s para solicitar</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">send</span>
                    <span>Solicitar Código de Verificación</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Secondary Actions */}
        {showCodeInput ? (
          <div className="mt-6 pt-5 border-t border-[#d2c4bc]/40 text-center flex flex-col items-center gap-2">
            <p className="font-sans text-xs text-[#705a4c]">
              ¿No recibiste el correo o necesitas otro código?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={cooldown > 0 || isResending || isLoading}
              className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#725a39] hover:text-[#26170c] disabled:text-[#81756e] disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              {cooldown > 0
                ? `Reenviar nuevo código en ${cooldown}s`
                : isResending
                ? "Reenviando código..."
                : "Reenviar código de verificación"}
            </button>
            <span className="font-sans text-[11px] text-[#81756e]">
              Revisa también tu carpeta de Spam o Correo no deseado.
            </span>
            <button
              type="button"
              onClick={handleResetForm}
              className="mt-2 text-xs font-sans text-[#705a4c] hover:text-[#26170c] underline underline-offset-4 cursor-pointer transition-colors"
            >
              Consultar un pedido diferente
            </button>
          </div>
        ) : (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setShowCodeInput(true);
                setIsEditingData(false);
              }}
              className="font-sans text-xs text-[#725a39] hover:text-[#26170c] font-medium underline underline-offset-4 cursor-pointer transition-colors"
            >
              ¿Ya tienes un código de verificación activo? Ingrésalo aquí
            </button>
          </div>
        )}

        {/* Security & Privacy note */}
        <div className="mt-8 pt-6 border-t border-[#d2c4bc]/40 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-sans text-[#705a4c]">
            <span className="material-symbols-outlined text-base text-[#725a39]">
              verified_user
            </span>
            <span>Consulta protegida con verificación OTP de 2 factores</span>
          </div>
        </div>
      </div>
    </div>
  );
}
