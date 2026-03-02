import type { FormEvent } from "react";
import { api } from "../../../lib/api";
import type { DashboardState } from "../useDashboardState";

type BusyRunner = (action: () => Promise<void>) => Promise<void>;

export function useCatalogActions(state: DashboardState, runBusy: BusyRunner) {
  const getAdminAuthToken = () => state.adminToken || undefined;

  const loadArchivedProducts = async () => {
    try {
      const archived = await api.listArchivedProducts(getAdminAuthToken());
      state.setArchivedProducts(archived);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("401") || message.includes("403")) {
        state.setArchivedProducts([]);
        return;
      }

      throw error;
    }
  };

  const loadProducts = async () => {
    await runBusy(async () => {
      const data = await api.listProducts();
      state.setProducts(data);

      if (state.editProduct) {
        const selectedProductStillExists = data.some(
          (product) => product.id === state.editProduct?.id,
        );
        if (!selectedProductStillExists) {
          state.setEditProduct(null);
        }
      }

      await loadArchivedProducts();

      if (data.length > 0 && !state.orderForm.selectedProductId) {
        state.setOrderForm((prev) => ({
          ...prev,
          selectedProductId: data[0].id,
        }));
      }
      state.setStatus(`Loaded ${data.length} product(s).`);
    });
  };

  const createProduct = async (event: FormEvent) => {
    event.preventDefault();

    await runBusy(async () => {
      await api.createProduct(state.newProduct, getAdminAuthToken());
      state.setStatus(`Created product ${state.newProduct.id}`);
      await loadProducts();
    });
  };

  const updateStock = async (event: FormEvent) => {
    event.preventDefault();

    await runBusy(async () => {
      await api.updateStock(
        state.stockUpdate.productId,
        state.stockUpdate.stock,
        getAdminAuthToken(),
      );
      state.setStatus(
        `Updated ${state.stockUpdate.productId} stock to ${state.stockUpdate.stock}`,
      );
      await loadProducts();
    });
  };

  const selectProductForEdit = (product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  }) => {
    state.setEditProduct(product);
    state.setStockUpdate({ productId: product.id, stock: product.stock });
    state.setStatus(`Editing product ${product.id}`);
  };

  const updateExistingProduct = async (event: FormEvent) => {
    event.preventDefault();

    if (!state.editProduct) {
      state.setStatus("Select a product to edit.");
      return;
    }

    const editProduct = state.editProduct;

    await runBusy(async () => {
      await api.updateProduct(
        editProduct.id,
        {
          name: editProduct.name,
          price: editProduct.price,
          stock: editProduct.stock,
        },
        getAdminAuthToken(),
      );
      state.setStatus(`Updated product ${editProduct.id}`);
      state.setEditProduct(null);
      await loadProducts();
    });
  };

  const archiveProduct = async (productId: string) => {
    await runBusy(async () => {
      await api.archiveProduct(productId, getAdminAuthToken());
      state.setStatus(`Archived product ${productId}`);
      if (state.editProduct?.id === productId) {
        state.setEditProduct(null);
      }
      await loadProducts();
    });
  };

  const restoreProduct = async (productId: string) => {
    await runBusy(async () => {
      await api.restoreProduct(productId, getAdminAuthToken());
      state.setStatus(`Restored product ${productId}`);
      await loadProducts();
    });
  };

  const deleteProductPermanently = async (productId: string) => {
    await runBusy(async () => {
      await api.deleteProductPermanently(productId, getAdminAuthToken());
      state.setStatus(`Permanently deleted product ${productId}`);
      await loadProducts();
    });
  };

  return {
    loadProducts,
    loadArchivedProducts,
    createProduct,
    updateStock,
    selectProductForEdit,
    updateExistingProduct,
    archiveProduct,
    restoreProduct,
    deleteProductPermanently,
  };
}
