import { requestJson } from "./http";

export type PaymentResponse = {
  id: string;
  orderId: string;
  status: number;
  transactionId: string;
  amount: number;
  updatedAt: string;
};

export type ShippingResponse = {
  id: string;
  orderId: string;
  status: number;
  trackingNumber: string;
  createdAt: string;
  estimatedDeliveryDate: string;
  deliveredAt: string | null;
};

export function getPayment(orderId: string, token?: string) {
  return requestJson<PaymentResponse>(`/api/payments/${orderId}`, { token });
}

export function getShipping(orderId: string, token?: string) {
  return requestJson<ShippingResponse>(`/api/shipping/${orderId}`, { token });
}
