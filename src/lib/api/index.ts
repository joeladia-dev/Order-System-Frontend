import {
  createDevToken,
  getGoogleStartUrl,
  getSession,
  requestCode,
  verifyCode,
} from "./auth";
import { createOrder, getOrder, listOrdersForCustomer } from "./orders";
import {
  archiveProduct,
  createProduct,
  deleteProductPermanently,
  listArchivedProducts,
  listProducts,
  restoreProduct,
  updateProduct,
  updateStock,
} from "./products";
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
  getSession,
  listProducts,
  listArchivedProducts,
  createProduct,
  updateProduct,
  updateStock,
  archiveProduct,
  restoreProduct,
  deleteProductPermanently,
  createOrder,
  getOrder,
  listOrdersForCustomer,
  getPayment,
  getShipping,
};
