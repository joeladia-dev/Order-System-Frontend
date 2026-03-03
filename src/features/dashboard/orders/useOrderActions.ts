import type { FormEvent } from "react";
import { api } from "../../../lib/api";
import { tokenSubjectId } from "../selectors";
import type { DashboardState } from "../useDashboardState";

type BusyRunner = (action: () => Promise<void>) => Promise<void>;

export function useOrderActions(state: DashboardState, runBusy: BusyRunner) {
  const addOrderItem = () => {
    const selectedProductId = state.orderForm.selectedProductId.trim();
    const selectedQuantity = Number(state.orderForm.selectedQuantity);
    const selectedProduct = state.products.find(
      (product) => product.id === selectedProductId,
    );

    if (!selectedProductId) {
      state.setStatus("Select a product before adding it to the order.");
      return;
    }

    if (!selectedProduct) {
      state.setStatus(
        "Selected product is no longer available. Refresh products.",
      );
      return;
    }

    if (selectedProduct.isArchived) {
      state.setStatus(
        `Product ${selectedProduct.id} is archived and cannot be ordered.`,
      );
      return;
    }

    if (selectedProduct.stock < 1) {
      state.setStatus(`Product ${selectedProduct.id} is out of stock.`);
      return;
    }

    if (!Number.isFinite(selectedQuantity) || selectedQuantity < 1) {
      state.setStatus("Quantity must be at least 1.");
      return;
    }

    state.setOrderItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === selectedProductId,
      );
      const requestedQuantity = (existing?.quantity ?? 0) + selectedQuantity;
      const boundedQuantity = Math.min(
        requestedQuantity,
        selectedProduct.stock,
      );

      if (requestedQuantity > selectedProduct.stock) {
        state.setStatus(
          `Quantity for ${selectedProduct.id} capped at available stock (${selectedProduct.stock}).`,
        );
      }

      if (existing) {
        return prev.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: boundedQuantity }
            : item,
        );
      }

      return [
        ...prev,
        { productId: selectedProductId, quantity: boundedQuantity },
      ];
    });

    state.setOrderForm((prev) => ({ ...prev, selectedQuantity: 1 }));
    state.setStatus(`Added ${selectedProductId} to order items.`);
  };

  const removeOrderItem = (productId: string) => {
    state.setOrderItems((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
    state.setStatus(`Removed ${productId} from order items.`);
  };

  const updateOrderItemQuantity = (productId: string, quantity: number) => {
    const product = state.products.find((item) => item.id === productId);

    if (!Number.isFinite(quantity) || quantity < 1) {
      state.setStatus("Quantity must be at least 1.");
      return;
    }

    if (!product) {
      state.setStatus(`Product ${productId} is no longer available.`);
      return;
    }

    const boundedQuantity = Math.min(quantity, Math.max(product.stock, 1));
    if (boundedQuantity !== quantity) {
      state.setStatus(
        `Quantity for ${productId} capped at available stock (${product.stock}).`,
      );
    }

    state.setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: boundedQuantity }
          : item,
      ),
    );
  };

  const createOrder = async (event: FormEvent) => {
    event.preventDefault();

    const resolvedCustomerId =
      state.orderForm.customerId.trim() || tokenSubjectId(state.customerToken);
    if (!resolvedCustomerId) {
      state.setStatus(
        "Sign in first so your account identity can be used for the order.",
      );
      return;
    }

    if (state.orderItems.length === 0) {
      state.setStatus("Add at least one item before placing an order.");
      return;
    }

    await runBusy(async () => {
      const customerAuthToken = state.customerToken || undefined;

      const response = await api.createOrder(
        {
          customerId: resolvedCustomerId,
          shippingAddress: state.orderForm.shippingAddress,
          paymentMethod: state.orderForm.paymentMethod,
          items: state.orderItems,
        },
        customerAuthToken,
      );

      state.setCreatedOrderId(response.orderId);
      state.setTrackOrderId(response.orderId);
      state.setOrderItems([]);
      state.setStatus(
        `Order ${response.orderId} created with status ${orderStatusLabel(response.status)}.`,
      );
    });
  };

  return {
    addOrderItem,
    removeOrderItem,
    updateOrderItemQuantity,
    createOrder,
  };
}

function orderStatusLabel(status: number): string {
  const labels = [
    "Pending",
    "Inventory Reserved",
    "Payment Processing",
    "Payment Completed",
    "Payment Failed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Inventory Failed",
  ];

  return labels[status] ?? `Unknown (${status})`;
}
