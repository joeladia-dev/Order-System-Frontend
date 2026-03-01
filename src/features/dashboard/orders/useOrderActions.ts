import type { FormEvent } from "react";
import { api } from "../../../lib/api";
import type { DashboardState } from "../useDashboardState";

type BusyRunner = (action: () => Promise<void>) => Promise<void>;

export function useOrderActions(state: DashboardState, runBusy: BusyRunner) {
  const createOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (!state.customerToken) {
      state.setStatus("Customer token required to create order.");
      return;
    }

    await runBusy(async () => {
      const response = await api.createOrder(
        {
          customerId: state.orderForm.customerId,
          shippingAddress: state.orderForm.shippingAddress,
          paymentMethod: state.orderForm.paymentMethod,
          items: [
            {
              productId: state.orderForm.productId,
              quantity: state.orderForm.quantity,
            },
          ],
        },
        state.customerToken,
      );

      state.setCreatedOrderId(response.orderId);
      state.setTrackOrderId(response.orderId);
      state.setStatus(
        `Order ${response.orderId} created with status ${response.status}`,
      );
    });
  };

  return {
    createOrder,
  };
}
