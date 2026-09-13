import {
  requestOrderOtpAction,
  verifyOrderOtpAction,
  getTrackedOrderAction,
} from "@/actions/tracking";

export const trackingService = {
  requestOtp: requestOrderOtpAction,
  verifyOtp: verifyOrderOtpAction,
  getTrackedOrder: getTrackedOrderAction,
};
