import type { FormEvent } from "react";
import { api } from "../../../lib/api";
import type { DashboardState } from "../useDashboardState";

type BusyRunner = (action: () => Promise<void>) => Promise<void>;

export function useTrackingActions(state: DashboardState, runBusy: BusyRunner) {
  const getTrackingToken = () =>
    state.adminToken || state.customerToken || undefined;
  const isTrackingAuthenticated = () =>
    Boolean(state.adminToken || state.customerToken || state.hasOAuthSession);

  const refreshTrackData = async (orderId: string) => {
    const trackingToken = getTrackingToken();

    const [order, payment, shipping] = await Promise.allSettled([
      api.getOrder(orderId, trackingToken),
      api.getPayment(orderId, trackingToken),
      api.getShipping(orderId, trackingToken),
    ]);

    state.setTrackData({
      order:
        order.status === "fulfilled"
          ? order.value
          : { message: "Order not available yet." },
      payment:
        payment.status === "fulfilled"
          ? payment.value
          : { message: "Payment not available yet." },
      shipping:
        shipping.status === "fulfilled"
          ? shipping.value
          : { message: "Shipping not available yet." },
    });
  };

  const trackOrder = async (event: FormEvent) => {
    event.preventDefault();
    const orderId = state.trackOrderId.trim();
    if (!orderId) {
      state.setStatus("Order ID is required for tracking.");
      return;
    }

    state.setTrackOrderId(orderId);
    state.setSelectedHistoryOrderId(orderId);

    await runBusy(async () => {
      await refreshTrackData(orderId);
      state.setStatus(`Tracking refreshed for order ${orderId}`);
    });
  };

  const loadCustomerOrders = async (customerId: string) => {
    const normalizedCustomerId = customerId.trim();
    if (!normalizedCustomerId) {
      state.setCustomerOrders([]);
      state.setCustomerOrdersError("");
      return;
    }

    if (!isTrackingAuthenticated()) {
      state.setCustomerOrders([]);
      state.setCustomerOrdersError("");
      return;
    }

    state.setIsCustomerOrdersLoading(true);
    state.setCustomerOrdersError("");

    try {
      const orders = await api.listOrdersForCustomer(
        normalizedCustomerId,
        getTrackingToken(),
      );

      state.setCustomerOrders(orders);
      if (!orders.some((order) => order.id === state.selectedHistoryOrderId)) {
        state.setSelectedHistoryOrderId("");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load orders.";
      const isUnauthorized = /401|unauthorized/i.test(message);
      state.setCustomerOrders([]);
      if (isUnauthorized && !isTrackingAuthenticated()) {
        state.setCustomerOrdersError("");
      } else {
        state.setCustomerOrdersError(message);
      }
    } finally {
      state.setIsCustomerOrdersLoading(false);
    }
  };

  const selectAndTrackOrder = async (orderId: string) => {
    const normalizedOrderId = orderId.trim();
    if (!normalizedOrderId) {
      return;
    }

    state.setSelectedHistoryOrderId(normalizedOrderId);
    state.setTrackOrderId(normalizedOrderId);

    await runBusy(async () => {
      await refreshTrackData(normalizedOrderId);
      state.setStatus(
        `Loaded fulfillment details for order ${normalizedOrderId}`,
      );
    });
  };

  return {
    trackOrder,
    loadCustomerOrders,
    selectAndTrackOrder,
  };
}
