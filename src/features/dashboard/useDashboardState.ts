import { useMemo, useState } from "react";
import type { OrderResponse, Product } from "../../lib/api";
import type {
  OrderDraftItem,
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
  const [hasOAuthSession, setHasOAuthSession] = useState(false);

  const [adminEmail, setAdminEmail] = useState("admin@ordersystem.local");
  const [adminToken, setAdminToken] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);

  const [newProduct, setNewProduct] = useState<Product>({
    id: "sku-1000",
    name: "Starter Product",
    price: 25,
    stock: 12,
  });

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [stockUpdate, setStockUpdate] = useState<StockUpdateForm>({
    productId: "sku-1000",
    stock: 20,
  });

  const [orderForm, setOrderForm] = useState<OrderFormState>({
    customerId: "cust-web-001",
    shippingAddress: "221B Baker Street, London",
    paymentMethod: "Card",
    selectedProductId: "",
    selectedQuantity: 1,
  });
  const [orderItems, setOrderItems] = useState<OrderDraftItem[]>([]);

  const [createdOrderId, setCreatedOrderId] = useState("");
  const [trackOrderId, setTrackOrderId] = useState("");
  const [trackData, setTrackData] = useState<OrderTrackResult>({});
  const [customerOrders, setCustomerOrders] = useState<OrderResponse[]>([]);
  const [isCustomerOrdersLoading, setIsCustomerOrdersLoading] = useState(false);
  const [customerOrdersError, setCustomerOrdersError] = useState("");
  const [selectedHistoryOrderId, setSelectedHistoryOrderId] = useState("");

  const tokenHint = useMemo(
    () => getTokenHint(customerToken, hasOAuthSession),
    [customerToken, hasOAuthSession],
  );

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
    hasOAuthSession,
    setHasOAuthSession,
    adminEmail,
    setAdminEmail,
    adminToken,
    setAdminToken,
    products,
    setProducts,
    archivedProducts,
    setArchivedProducts,
    newProduct,
    setNewProduct,
    editProduct,
    setEditProduct,
    stockUpdate,
    setStockUpdate,
    orderForm,
    setOrderForm,
    orderItems,
    setOrderItems,
    createdOrderId,
    setCreatedOrderId,
    trackOrderId,
    setTrackOrderId,
    trackData,
    setTrackData,
    customerOrders,
    setCustomerOrders,
    isCustomerOrdersLoading,
    setIsCustomerOrdersLoading,
    customerOrdersError,
    setCustomerOrdersError,
    selectedHistoryOrderId,
    setSelectedHistoryOrderId,
  };
}

export type DashboardState = ReturnType<typeof useDashboardState>;
