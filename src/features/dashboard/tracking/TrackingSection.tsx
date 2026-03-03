import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Search,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type {
  OrderResponse,
  PaymentResponse,
  ShippingResponse,
} from "../../../lib/api";
import type { DashboardController } from "../useDashboardController";

type TrackingSectionProps = {
  controller: DashboardController;
};

export function TrackingSection({ controller }: TrackingSectionProps) {
  const order =
    controller.trackData.order && isOrderData(controller.trackData.order)
      ? controller.trackData.order
      : undefined;
  const payment =
    controller.trackData.payment && isPaymentData(controller.trackData.payment)
      ? controller.trackData.payment
      : undefined;
  const shipping =
    controller.trackData.shipping &&
    isShippingData(controller.trackData.shipping)
      ? controller.trackData.shipping
      : undefined;
  const customerIdForHistory = (
    order?.customerId ?? controller.orderForm.customerId
  ).trim();
  const isHistoryAuthenticated = Boolean(
    controller.adminToken ||
    controller.customerToken ||
    controller.hasOAuthSession,
  );
  const historyLoadRef = useRef("");

  useEffect(() => {
    if (!customerIdForHistory) {
      controller.setCustomerOrders([]);
      controller.setCustomerOrdersError("");
      historyLoadRef.current = "";
      return;
    }

    if (!isHistoryAuthenticated) {
      controller.setCustomerOrders([]);
      controller.setCustomerOrdersError("");
      historyLoadRef.current = "";
      return;
    }

    const authKey = `${Boolean(controller.customerToken)}-${Boolean(controller.adminToken)}-${Boolean(controller.hasOAuthSession)}`;
    const loadKey = `${customerIdForHistory}|${authKey}`;

    if (historyLoadRef.current === loadKey) {
      return;
    }

    historyLoadRef.current = loadKey;
    void controller.loadCustomerOrders(customerIdForHistory);
  }, [
    customerIdForHistory,
    controller.customerToken,
    controller.adminToken,
    controller.hasOAuthSession,
    isHistoryAuthenticated,
  ]);

  return (
    <section className="min-w-0">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Track Fulfillment
          </CardTitle>
          <CardDescription>
            Enter an order ID after placing an order. Results may arrive at
            different times per service.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="grid gap-3 md:grid-cols-[75%_16.666667%] md:items-start"
            onSubmit={controller.trackOrder}
          >
            <div className="min-w-0 space-y-1.5">
              <label
                htmlFor="track-order-id"
                className="text-xs font-medium text-muted-foreground"
              >
                Order ID <span className="text-primary">*</span>
              </label>
              <Input
                id="track-order-id"
                value={controller.trackOrderId}
                onChange={(e) => controller.setTrackOrderId(e.target.value)}
                placeholder="Order ID"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Use the order ID returned after placing an order.
              </p>
            </div>
            <Button
              size="sm"
              disabled={controller.isBusy}
              type="submit"
              className="h-9 md:mt-8 md:self-start"
            >
              <Search className="h-4 w-4" />
              Track
            </Button>
          </form>

          <p className="rounded-md bg-background/80 px-3 py-2 text-xs text-muted-foreground">
            Tip: Order data often appears first, while payment/shipping can be
            briefly delayed.
          </p>

          <FulfillmentTimeline
            order={order}
            payment={payment}
            shipping={shipping}
          />

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            <TrackCard
              kind="order"
              icon={<ShoppingCart className="h-5 w-5" />}
              title="Order"
              data={controller.trackData.order}
              delayClassName="ui-fade-in ui-delay-1"
            />
            <TrackCard
              kind="payment"
              icon={<Shield className="h-5 w-5" />}
              title="Payment"
              data={controller.trackData.payment}
              delayClassName="ui-fade-in ui-delay-2"
            />
            <TrackCard
              kind="shipping"
              icon={<Truck className="h-5 w-5" />}
              title="Shipping"
              data={controller.trackData.shipping}
              delayClassName="ui-fade-in ui-delay-3"
            />
          </div>

          <div className="space-y-3 rounded-md border border-border/70 bg-background/70 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Previous Orders
                </p>
                <p className="text-xs text-muted-foreground">
                  Customer: {customerIdForHistory || "-"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  void controller.loadCustomerOrders(customerIdForHistory)
                }
                disabled={
                  controller.isCustomerOrdersLoading ||
                  !customerIdForHistory ||
                  !isHistoryAuthenticated
                }
              >
                Refresh
              </Button>
            </div>

            {controller.customerOrdersError && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                Unable to load orders: {controller.customerOrdersError}
              </p>
            )}

            {controller.isCustomerOrdersLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading previous orders...
              </p>
            ) : controller.customerOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No previous orders found.
              </p>
            ) : (
              <>
                <div
                  className={`hidden max-w-full overflow-x-auto md:block ${controller.customerOrders.length >= 10 ? "max-h-[28rem] overflow-y-auto" : ""}`}
                >
                  <table className="w-full min-w-[760px] table-fixed text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                      <tr className="border-b border-border/70">
                        <th className="px-2 py-2">Order ID</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Items</th>
                        <th className="px-2 py-2">Created</th>
                        <th className="px-2 py-2">Updated</th>
                        <th className="px-2 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {controller.customerOrders.map((historyOrder) => {
                        const isSelected =
                          controller.selectedHistoryOrderId === historyOrder.id;

                        return (
                          <tr
                            key={historyOrder.id}
                            className={`border-b border-border/50 ${isSelected ? "bg-primary/10" : "hover:bg-muted/50"}`}
                          >
                            <td className="px-2 py-2 font-mono text-xs break-all">
                              {historyOrder.id}
                            </td>
                            <td className="px-2 py-2">
                              {orderStatusLabel(historyOrder.status)}
                            </td>
                            <td className="px-2 py-2">
                              {historyOrder.items.length}
                            </td>
                            <td className="px-2 py-2 text-xs text-muted-foreground">
                              {formatDate(historyOrder.createdAt)}
                            </td>
                            <td className="px-2 py-2 text-xs text-muted-foreground">
                              {formatDate(historyOrder.updatedAt)}
                            </td>
                            <td className="px-2 py-2 text-right">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  void controller.selectAndTrackOrder(
                                    historyOrder.id,
                                  )
                                }
                                disabled={controller.isBusy}
                              >
                                View details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 md:hidden">
                  {controller.customerOrders.map((historyOrder) => {
                    const isSelected =
                      controller.selectedHistoryOrderId === historyOrder.id;

                    return (
                      <div
                        key={historyOrder.id}
                        className={`space-y-2 rounded-md border p-3 ${isSelected ? "border-primary/50 bg-primary/10" : "border-border/70 bg-card/70"}`}
                      >
                        <div className="space-y-1">
                          <p className="font-mono text-xs break-all text-foreground">
                            {historyOrder.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {orderStatusLabel(historyOrder.status)} ·{" "}
                            {historyOrder.items.length} items
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(historyOrder.createdAt)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            void controller.selectAndTrackOrder(historyOrder.id)
                          }
                          disabled={controller.isBusy}
                        >
                          View details
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

type TrackCardProps = {
  kind: "order" | "payment" | "shipping";
  title: string;
  icon: ReactNode;
  data?: unknown;
  delayClassName?: string;
};

function TrackCard({
  kind,
  title,
  icon,
  data,
  delayClassName,
}: TrackCardProps) {
  const message = getMessage(data);

  return (
    <div
      className={`min-h-[250px] rounded-xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-4 shadow-sm ${delayClassName ?? ""}`}
    >
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </p>

      <div className="space-y-3 rounded-lg bg-background/80 p-3 text-sm">
        {!data || message ? (
          <p className="text-muted-foreground">
            {message ??
              "Waiting for this service update. Try tracking again in a moment."}
          </p>
        ) : kind === "order" && isOrderData(data) ? (
          <OrderDetails order={data} />
        ) : kind === "payment" && isPaymentData(data) ? (
          <PaymentDetails payment={data} />
        ) : kind === "shipping" && isShippingData(data) ? (
          <ShippingDetails shipping={data} />
        ) : (
          <p className="text-muted-foreground">
            Data format not recognized yet for this section.
          </p>
        )}
      </div>
    </div>
  );
}

function OrderDetails({ order }: { order: OrderResponse }) {
  return (
    <>
      <StatusPill
        label={orderStatusLabel(order.status)}
        tone={orderStatusTone(order.status)}
      />
      <FieldRow label="Order ID" value={order.id} />
      <FieldRow label="Customer" value={order.customerId} />
      <FieldRow label="Payment" value={order.paymentMethod} />
      <FieldRow label="Created" value={formatDate(order.createdAt)} />
      <FieldRow label="Updated" value={formatDate(order.updatedAt)} />
      {order.failureReason && (
        <FieldRow label="Reason" value={order.failureReason} />
      )}

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Items
        </p>
        <ul className="space-y-1 text-sm text-foreground">
          {order.items.map((item) => (
            <li
              key={`${item.productId}-${item.quantity}`}
              className="flex items-center justify-between rounded-md border border-border/60 px-2 py-1"
            >
              <span className="truncate">{item.productId}</span>
              <span className="text-muted-foreground">x{item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function PaymentDetails({ payment }: { payment: PaymentResponse }) {
  return (
    <>
      <StatusPill
        label={paymentStatusLabel(payment.status)}
        tone={paymentStatusTone(payment.status)}
      />
      <FieldRow label="Order ID" value={payment.orderId} />
      <FieldRow label="Amount" value={formatAmount(payment.amount)} />
      <FieldRow
        label="Transaction"
        value={payment.transactionId}
        valueClassName="font-mono text-[11px] break-all"
      />
      <FieldRow label="Updated" value={formatDate(payment.updatedAt)} />
      {payment.failureReason && (
        <FieldRow label="Reason" value={payment.failureReason} />
      )}
    </>
  );
}

function ShippingDetails({ shipping }: { shipping: ShippingResponse }) {
  return (
    <>
      <StatusPill
        label={shippingStatusLabel(shipping.status)}
        tone={shippingStatusTone(shipping.status)}
      />
      <FieldRow label="Order ID" value={shipping.orderId} />
      <FieldRow label="Tracking" value={shipping.trackingNumber} />
      <FieldRow label="Created" value={formatDate(shipping.createdAt)} />
      <FieldRow
        label="Updated"
        value={formatDate(shipping.lastUpdatedAt ?? shipping.createdAt)}
      />
      <FieldRow
        label="ETA"
        value={formatDate(shipping.estimatedDeliveryDate)}
      />
      <FieldRow
        label="Delivered"
        value={shipping.deliveredAt ? formatDate(shipping.deliveredAt) : "-"}
      />
      {shipping.failureReason && (
        <FieldRow label="Reason" value={shipping.failureReason} />
      )}
    </>
  );
}

function FulfillmentTimeline({
  order,
  payment,
  shipping,
}: {
  order?: OrderResponse;
  payment?: PaymentResponse;
  shipping?: ShippingResponse;
}) {
  const steps = [
    {
      key: "order",
      title: "Order Received",
      state: order ? "done" : "pending",
      detail: order ? formatDate(order.createdAt) : "Waiting for order",
    },
    {
      key: "payment",
      title: "Payment",
      state: payment
        ? payment.status === 2
          ? "error"
          : payment.status === 1
            ? "done"
            : "active"
        : "pending",
      detail: payment
        ? `${paymentStatusLabel(payment.status)} · ${formatDate(payment.updatedAt)}`
        : "Waiting for payment update",
    },
    {
      key: "shipping",
      title: "Shipping",
      state: shipping
        ? shipping.status === 3
          ? "error"
          : shipping.status === 2
            ? "done"
            : "active"
        : "pending",
      detail: shipping
        ? `${shippingStatusLabel(shipping.status)} · ${formatDate(shipping.lastUpdatedAt ?? shipping.createdAt)}`
        : "Waiting for shipment update",
    },
    {
      key: "delivered",
      title: "Delivered",
      state:
        order?.status === 6 || shipping?.status === 2
          ? "done"
          : order?.status === 4 || order?.status === 8 || shipping?.status === 3
            ? "error"
            : "pending",
      detail: shipping?.deliveredAt
        ? formatDate(shipping.deliveredAt)
        : "Pending delivery",
    },
  ] as const;

  return (
    <div className="rounded-md border border-border/70 bg-background/80 px-3 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Fulfillment Timeline
      </p>
      <div className="grid gap-2 md:grid-cols-4">
        {steps.map((step) => {
          const toneClass =
            step.state === "done"
              ? "border-primary/40 bg-primary/10"
              : step.state === "active"
                ? "border-border/70 bg-muted/60"
                : step.state === "error"
                  ? "border-destructive/40 bg-destructive/10"
                  : "border-border/60 bg-background";

          const textToneClass =
            step.state === "done"
              ? "text-primary"
              : step.state === "error"
                ? "text-destructive"
                : "text-foreground";

          return (
            <div
              key={step.key}
              className={`rounded-md border px-2.5 py-2 ${toneClass}`}
            >
              <p className={`text-xs font-semibold ${textToneClass}`}>
                {step.title}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {step.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={`min-w-0 break-words text-sm text-foreground ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "ok" | "warn" | "error";
}) {
  const icon =
    tone === "ok" ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : tone === "warn" ? (
      <Clock3 className="h-3.5 w-3.5" />
    ) : (
      <AlertTriangle className="h-3.5 w-3.5" />
    );

  const toneClass =
    tone === "ok"
      ? "border-primary/40 bg-primary/15 text-primary"
      : tone === "warn"
        ? "border-border/70 bg-muted/70 text-foreground"
        : "border-destructive/40 bg-destructive/10 text-destructive";

  return (
    <p
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass}`}
    >
      {icon}
      {label}
    </p>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getMessage(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  if (typeof value.message === "string") {
    return value.message;
  }

  return null;
}

function isOrderData(value: unknown): value is OrderResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.customerId === "string" &&
    typeof value.paymentMethod === "string" &&
    typeof value.status === "number" &&
    Array.isArray(value.items)
  );
}

function isPaymentData(value: unknown): value is PaymentResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.orderId === "string" &&
    typeof value.amount === "number" &&
    typeof value.transactionId === "string" &&
    typeof value.status === "number"
  );
}

function isShippingData(value: unknown): value is ShippingResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.orderId === "string" &&
    typeof value.trackingNumber === "string" &&
    typeof value.status === "number"
  );
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

function paymentStatusLabel(status: number): string {
  const labels = ["Processing", "Completed", "Failed"];
  return labels[status] ?? `Unknown (${status})`;
}

function shippingStatusLabel(status: number): string {
  const labels = ["Label Created", "In Transit", "Delivered", "Failed"];
  return labels[status] ?? `Unknown (${status})`;
}

function orderStatusTone(status: number): "ok" | "warn" | "error" {
  if (status === 4 || status === 7 || status === 8) {
    return "error";
  }

  if (status === 6) {
    return "ok";
  }

  return "warn";
}

function paymentStatusTone(status: number): "ok" | "warn" | "error" {
  if (status === 2) {
    return "error";
  }

  if (status === 1) {
    return "ok";
  }

  return "warn";
}

function shippingStatusTone(status: number): "ok" | "warn" | "error" {
  if (status === 2) {
    return "ok";
  }

  if (status === 3) {
    return "error";
  }

  return "warn";
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}
