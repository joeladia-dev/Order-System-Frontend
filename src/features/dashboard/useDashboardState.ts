import { useMemo, useState } from "react";
import type { Product } from "../../lib/api";
import type {
  OrderFormState,
  OrderTrackResult,
  StockUpdateForm,
} from "./types";
import { getTokenHint } from "./selectors";

export function useDashboardState() {
  const [status, setStatus] = useState("Ready");
  const [isBusy, setIsBusy] = useState(false);

  const [customerEmail, setCustomerEmail] = useState(
    "customer@ordersystem.local",
  );
  const [otpCode, setOtpCode] = useState("");
  const [customerToken, setCustomerToken] = useState("");

  const [adminEmail, setAdminEmail] = useState("admin@ordersystem.local");
  const [adminToken, setAdminToken] = useState("");

  const [products, setProducts] = useState<Product[]>([]);

  const [newProduct, setNewProduct] = useState<Product>({
    id: "sku-1000",
    name: "Starter Product",
    price: 25,
    stock: 12,
  });

  const [stockUpdate, setStockUpdate] = useState<StockUpdateForm>({
    productId: "sku-1000",
    stock: 20,
  });

  const [orderForm, setOrderForm] = useState<OrderFormState>({
    customerId: "cust-web-001",
    shippingAddress: "221B Baker Street, London",
    paymentMethod: "Card",
    productId: "sku-1000",
    quantity: 1,
  });

  const [createdOrderId, setCreatedOrderId] = useState("");
  const [trackOrderId, setTrackOrderId] = useState("");
  const [trackData, setTrackData] = useState<OrderTrackResult>({});

  const tokenHint = useMemo(() => getTokenHint(customerToken), [customerToken]);

  return {
    status,
    setStatus,
    isBusy,
    setIsBusy,
    tokenHint,
    customerEmail,
    setCustomerEmail,
    otpCode,
    setOtpCode,
    customerToken,
    setCustomerToken,
    adminEmail,
    setAdminEmail,
    adminToken,
    setAdminToken,
    products,
    setProducts,
    newProduct,
    setNewProduct,
    stockUpdate,
    setStockUpdate,
    orderForm,
    setOrderForm,
    createdOrderId,
    setCreatedOrderId,
    trackOrderId,
    setTrackOrderId,
    trackData,
    setTrackData,
  };
}

export type DashboardState = ReturnType<typeof useDashboardState>;
