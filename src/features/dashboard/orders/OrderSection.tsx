import { ArrowRight, CheckCircle2, ShoppingCart } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type { DashboardController } from "../useDashboardController";

type OrderSectionProps = {
  controller: DashboardController;
};

export function OrderSection({ controller }: OrderSectionProps) {
  const productLookup = new Map(
    controller.products.map((product) => [product.id, product]),
  );
  const selectedProduct = controller.products.find(
    (product) => product.id === controller.orderForm.selectedProductId,
  );
  const hasCartIssues = controller.orderItems.some((item) => {
    const product = productLookup.get(item.productId);
    const isUnavailable = !product || Boolean(product.isArchived);
    const hasInsufficientStock =
      !isUnavailable && (product?.stock ?? 0) < item.quantity;

    return isUnavailable || hasInsufficientStock;
  });

  const orderTotal = controller.orderItems.reduce((total, item) => {
    const product = productLookup.get(item.productId);
    if (!product) {
      return total;
    }

    return total + product.price * item.quantity;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Create Order
        </CardTitle>
        <CardDescription>
          Submit an order using your signed-in customer session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-3 rounded-md border border-border/70 bg-background/75 px-3 py-2 text-xs text-muted-foreground">
          Requires customer authentication (OTP token or Google OAuth cookie
          session). Admin Product Access is optional and only needed for
          product catalog updates.
        </p>
        <form className="space-y-3" onSubmit={controller.createOrder}>
          <div className="space-y-1.5">
            <label
              htmlFor="order-customer-id"
              className="text-xs font-medium text-muted-foreground"
            >
              Customer ID <span className="text-primary">*</span>
            </label>
            <Input
              id="order-customer-id"
              value={controller.orderForm.customerId}
              onChange={(e) =>
                controller.setOrderForm((prev) => ({
                  ...prev,
                  customerId: e.target.value,
                }))
              }
              placeholder="Customer ID"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Must match the signed-in customer identity used for this order.
            </p>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="order-shipping-address"
              className="text-xs font-medium text-muted-foreground"
            >
              Shipping Address <span className="text-primary">*</span>
            </label>
            <Input
              id="order-shipping-address"
              value={controller.orderForm.shippingAddress}
              onChange={(e) =>
                controller.setOrderForm((prev) => ({
                  ...prev,
                  shippingAddress: e.target.value,
                }))
              }
              placeholder="Shipping address"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="order-payment-method"
              className="text-xs font-medium text-muted-foreground"
            >
              Payment Method <span className="text-primary">*</span>
            </label>
            <Input
              id="order-payment-method"
              value={controller.orderForm.paymentMethod}
              onChange={(e) =>
                controller.setOrderForm((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value,
                }))
              }
              placeholder="Payment method"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="order-product-select"
              className="text-xs font-medium text-muted-foreground"
            >
              Product <span className="text-primary">*</span>
            </label>
            <select
              id="order-product-select"
              value={controller.orderForm.selectedProductId}
              onChange={(e) =>
                controller.setOrderForm((prev) => ({
                  ...prev,
                  selectedProductId: e.target.value,
                }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Select a product</option>
              {controller.products.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isArchived = Boolean(product.isArchived);
                const isUnavailable = isOutOfStock || isArchived;
                const unavailableReason = isArchived
                  ? "Archived"
                  : isOutOfStock
                    ? "Out of stock"
                    : "";

                return (
                  <option
                    key={product.id}
                    value={product.id}
                    disabled={isUnavailable}
                  >
                    {product.name} ({product.id}) - ${product.price.toFixed(2)} · stock {product.stock}
                    {unavailableReason ? ` · ${unavailableReason}` : ""}
                  </option>
                );
              })}
            </select>
            <p className="text-[11px] text-muted-foreground">
              Unavailable products stay visible but are disabled.
            </p>
            {selectedProduct && (
              <p className="text-[11px] text-muted-foreground">
                Selected: {selectedProduct.name} · stock {selectedProduct.stock} · ${selectedProduct.price.toFixed(2)} each
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="order-add-quantity"
              className="text-xs font-medium text-muted-foreground"
            >
              Quantity <span className="text-primary">*</span>
            </label>
            <Input
              id="order-add-quantity"
              value={controller.orderForm.selectedQuantity}
              onChange={(e) =>
                controller.setOrderForm((prev) => ({
                  ...prev,
                  selectedQuantity: Number(e.target.value),
                }))
              }
              type="number"
              min={1}
              max={Math.max(selectedProduct?.stock ?? 1, 1)}
              placeholder="Quantity to add"
            />
            <p className="text-[11px] text-muted-foreground">
              Max available: {selectedProduct ? selectedProduct.stock : "-"}
            </p>
          </div>
          <Button
            disabled={controller.isBusy || controller.products.length === 0}
            type="button"
            variant="secondary"
            className="w-full"
            onClick={controller.addOrderItem}
          >
            Add Item
          </Button>

          <div className="space-y-2 rounded-md border border-border/70 bg-background/75 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Order Items
            </p>
            {controller.orderItems.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No items added yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {controller.orderItems.map((item) => {
                  const product = productLookup.get(item.productId);
                  const lineTotal = (product?.price ?? 0) * item.quantity;
                  const isUnavailable = !product || Boolean(product.isArchived);
                  const hasInsufficientStock =
                    !isUnavailable && (product?.stock ?? 0) < item.quantity;
                  const warningMessage = isUnavailable
                    ? "This product is no longer available. Remove it from the order."
                    : hasInsufficientStock
                      ? `Only ${product?.stock ?? 0} in stock. Reduce quantity to continue.`
                      : null;

                  return (
                    <li
                      key={item.productId}
                      className={`grid gap-2 rounded-md border p-2 ${warningMessage ? "border-destructive/50 bg-destructive/5" : "border-border/70 bg-card/80"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="min-w-0 truncate text-sm font-medium text-foreground">
                          {product?.name ?? item.productId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${lineTotal.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {item.productId} · ${product?.price.toFixed(2) ?? "0.00"} each
                      </p>
                      {warningMessage && (
                        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-[11px] font-medium text-destructive">
                          {warningMessage}
                        </p>
                      )}
                      <div className="grid grid-cols-[1fr_auto] gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={Math.max(product?.stock ?? 1, 1)}
                          value={item.quantity}
                          onChange={(e) =>
                            controller.updateOrderItemQuantity(
                              item.productId,
                              Number(e.target.value),
                            )
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => controller.removeOrderItem(item.productId)}
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="text-xs font-semibold text-foreground">
              Total: ${orderTotal.toFixed(2)}
            </p>
          </div>

          <Button
            disabled={controller.isBusy || hasCartIssues || controller.orderItems.length === 0}
            type="submit"
            className="w-full"
          >
            Place Order <ArrowRight className="h-4 w-4" />
          </Button>
          {hasCartIssues && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              Resolve highlighted cart issues before placing the order.
            </p>
          )}
          {controller.createdOrderId && (
            <p className="inline-flex w-full items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Created order:</span>
              <span className="min-w-0 break-all font-mono text-[11px] text-foreground">
                {controller.createdOrderId}
              </span>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
