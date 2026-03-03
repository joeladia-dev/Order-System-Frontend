import { useEffect, useRef } from "react";
import { OrderSection } from "../orders/OrderSection";
import { TrackingSection } from "../tracking/TrackingSection";
import type { DashboardController } from "../useDashboardController";

type OrderingSystemPageProps = {
  controller: DashboardController;
};

export function OrderingSystemPage({ controller }: OrderingSystemPageProps) {
  const hasRequestedProductsRef = useRef(false);

  useEffect(() => {
    if (hasRequestedProductsRef.current || controller.products.length > 0) {
      return;
    }

    hasRequestedProductsRef.current = true;
    controller.loadProducts();
  }, [controller.products.length, controller.loadProducts]);

  useEffect(() => {
    if (
      controller.orderForm.selectedProductId ||
      controller.products.length === 0
    ) {
      return;
    }

    const firstAvailable = controller.products.find(
      (product) => !product.isArchived && product.stock > 0,
    );

    if (!firstAvailable) {
      return;
    }

    controller.setOrderForm((prev) => ({
      ...prev,
      selectedProductId: firstAvailable.id,
    }));
  }, [
    controller.orderForm.selectedProductId,
    controller.products,
    controller.setOrderForm,
  ]);

  return (
    <section>
      <div className="grid gap-6 xl:grid-cols-[0.7fr_2.3fr]">
        <div className="min-w-0">
          <OrderSection controller={controller} />
        </div>
        <div className="min-w-0">
          <TrackingSection controller={controller} />
        </div>
      </div>
    </section>
  );
}
