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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Create Order
        </CardTitle>
        <CardDescription>
          Submit an order using the signed-in customer token.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-3 rounded-md border border-border/70 bg-background/75 px-3 py-2 text-xs text-muted-foreground">
          Requires a signed-in customer token. Admin Product Access is optional
          and only needed for product catalog updates.
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
              htmlFor="order-product-id"
              className="text-xs font-medium text-muted-foreground"
            >
              Product ID <span className="text-primary">*</span>
            </label>
            <Input
              id="order-product-id"
              value={controller.orderForm.productId}
              onChange={(e) =>
                controller.setOrderForm((prev) => ({
                  ...prev,
                  productId: e.target.value,
                }))
              }
              placeholder="Product ID"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="order-quantity"
              className="text-xs font-medium text-muted-foreground"
            >
              Quantity <span className="text-primary">*</span>
            </label>
            <Input
              id="order-quantity"
              value={controller.orderForm.quantity}
              onChange={(e) =>
                controller.setOrderForm((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
              type="number"
              min={1}
              placeholder="Quantity"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Enter at least 1 item.
            </p>
          </div>
          <Button disabled={controller.isBusy} type="submit" className="w-full">
            Place Order <ArrowRight className="h-4 w-4" />
          </Button>
          {controller.createdOrderId && (
            <p className="inline-flex items-center gap-2 rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Created order: {controller.createdOrderId}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
