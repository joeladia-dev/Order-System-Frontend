import {
  createDevToken,
  getGoogleStartUrl,
  requestCode,
  verifyCode,
} from "./auth";
import { createOrder, getOrder } from "./orders";
import { createProduct, listProducts, updateStock } from "./products";
import { getPayment, getShipping } from "./tracking";

export { type AuthResponse } from "./auth";
export {
  type CreateOrderInput,
  type CreateOrderResponse,
  type OrderResponse,
} from "./orders";
export { type Product } from "./products";
export { type PaymentResponse, type ShippingResponse } from "./tracking";

export const api = {
  requestCode,
  verifyCode,
  createDevToken,
  getGoogleStartUrl,
  listProducts,
  createProduct,
  updateStock,
  createOrder,
  getOrder,
  getPayment,
  getShipping,
};
