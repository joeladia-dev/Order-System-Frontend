import { requestJson } from "./http";

export type PaymentResponse = {
  id: string;
  orderId: string;
  status: number;
  transactionId: string;
  amount: number;
  updatedAt: string;
  failureReason?: string | null;
};

export type ShippingResponse = {
  id: string;
  orderId: string;
  status: number;
  trackingNumber: string;
  createdAt: string;
  lastUpdatedAt?: string;
  estimatedDeliveryDate: string;
  deliveredAt: string | null;
  failureReason?: string | null;
};

export function getPayment(orderId: string, token?: string) {
  return requestJson<PaymentResponse>(`/api/payments/${orderId}`, { token });
}

export function getShipping(orderId: string, token?: string) {
  return requestJson<ShippingResponse>(`/api/shipping/${orderId}`, { token });
}
