import { requestJson } from "./http";

export type PaymentResponse = {
  orderId: string;
  status: string;
  providerTransactionId: string | null;
  amount: number;
  processedAt: string;
  failureReason: string | null;
};

export type ShippingResponse = {
  orderId: string;
  status: string;
  trackingNumber: string;
  carrier: string;
  estimatedDeliveryAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
};

export function getPayment(orderId: string) {
  return requestJson<PaymentResponse>(`/api/payments/${orderId}`);
}

export function getShipping(orderId: string) {
  return requestJson<ShippingResponse>(`/api/shipping/${orderId}`);
}
