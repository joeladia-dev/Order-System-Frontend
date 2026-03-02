import { requestJson } from "./http";

export type CreateOrderInput = {
  customerId: string;
  shippingAddress: string;
  paymentMethod: string;
  items: Array<{ productId: string; quantity: number }>;
};

export type CreateOrderResponse = {
  orderId: string;
  status: number;
  correlationId: string;
};

export type OrderResponse = {
  id: string;
  customerId: string;
  shippingAddress: string;
  paymentMethod: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

export function createOrder(input: CreateOrderInput, token?: string) {
  return requestJson<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
    token,
  });
}

export function getOrder(orderId: string, token?: string) {
  return requestJson<OrderResponse>(`/api/orders/${orderId}`, {
    token,
  });
}
