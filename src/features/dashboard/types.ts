export type OrderTrackResult = {
  order?: unknown;
  payment?: unknown;
  shipping?: unknown;
};

export type StockUpdateForm = {
  productId: string;
  stock: number;
};

export type OrderFormState = {
  customerId: string;
  shippingAddress: string;
  paymentMethod: string;
  productId: string;
  quantity: number;
};
