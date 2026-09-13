import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TrackedOrder } from "@/types/OrderTracking";

interface TrackingState {
  token: string | null;
  orderNumber: string;
  email: string;
  maskedEmail: string;
  order: TrackedOrder | null;
  step: "LOOKUP" | "OTP" | "DETAIL";
  setLookupData: (orderNumber: string, email: string, maskedEmail?: string) => void;
  setSession: (token: string, order: TrackedOrder) => void;
  updateOrder: (order: TrackedOrder) => void;
  clearSession: () => void;
}

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set) => ({
      token: null,
      orderNumber: "",
      email: "",
      maskedEmail: "",
      order: null,
      step: "LOOKUP",

      setLookupData: (orderNumber, email, maskedEmail = "") =>
        set({
          orderNumber,
          email,
          maskedEmail,
          step: "OTP",
        }),

      setSession: (token, order) =>
        set({
          token,
          order,
          step: "DETAIL",
        }),

      updateOrder: (order) =>
        set({
          order,
        }),

      clearSession: () =>
        set({
          token: null,
          order: null,
          step: "LOOKUP",
          orderNumber: "",
          email: "",
          maskedEmail: "",
        }),
    }),
    {
      name: "bambil_order_tracking_session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
