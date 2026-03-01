import type { FormEvent } from "react";
import { api } from "../../../lib/api";
import type { DashboardState } from "../useDashboardState";

type BusyRunner = (action: () => Promise<void>) => Promise<void>;

export function useCatalogActions(state: DashboardState, runBusy: BusyRunner) {
  const loadProducts = async () => {
    await runBusy(async () => {
      const data = await api.listProducts();
      state.setProducts(data);
      if (data.length > 0 && !state.orderForm.productId) {
        state.setOrderForm((prev) => ({ ...prev, productId: data[0].id }));
      }
      state.setStatus(`Loaded ${data.length} product(s).`);
    });
  };

  const createProduct = async (event: FormEvent) => {
    event.preventDefault();
    if (!state.adminToken) {
      state.setStatus("Admin token required for product writes.");
      return;
    }

    await runBusy(async () => {
      await api.createProduct(state.newProduct, state.adminToken);
      state.setStatus(`Created product ${state.newProduct.id}`);
      await loadProducts();
    });
  };

  const updateStock = async (event: FormEvent) => {
    event.preventDefault();
    if (!state.adminToken) {
      state.setStatus("Admin token required for stock updates.");
      return;
    }

    await runBusy(async () => {
      await api.updateStock(
        state.stockUpdate.productId,
        state.stockUpdate.stock,
        state.adminToken,
      );
      state.setStatus(
        `Updated ${state.stockUpdate.productId} stock to ${state.stockUpdate.stock}`,
      );
      await loadProducts();
    });
  };

  return {
    loadProducts,
    createProduct,
    updateStock,
  };
}
