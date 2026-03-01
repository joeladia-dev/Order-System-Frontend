import type { FormEvent } from "react";
import { api } from "../../../lib/api";
import type { DashboardState } from "../useDashboardState";

type BusyRunner = (action: () => Promise<void>) => Promise<void>;

export function useTrackingActions(state: DashboardState, runBusy: BusyRunner) {
  const trackOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (!state.trackOrderId) {
      state.setStatus("Order ID is required for tracking.");
      return;
    }

    await runBusy(async () => {
      const [order, payment, shipping] = await Promise.allSettled([
        state.customerToken
          ? api.getOrder(state.trackOrderId, state.customerToken)
          : Promise.resolve(undefined),
        api.getPayment(state.trackOrderId),
        api.getShipping(state.trackOrderId),
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

      state.setStatus(`Tracking refreshed for order ${state.trackOrderId}`);
    });
  };

  return {
    trackOrder,
  };
}
