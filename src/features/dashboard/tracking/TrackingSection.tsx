import {
  ClipboardList,
  Search,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";
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

type TrackingSectionProps = {
  controller: DashboardController;
};

export function TrackingSection({ controller }: TrackingSectionProps) {
  return (
    <section>
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
            className="grid gap-3 md:grid-cols-[1fr_auto]"
            onSubmit={controller.trackOrder}
          >
            <div className="space-y-1.5">
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
              disabled={controller.isBusy}
              type="submit"
              className="md:self-end"
            >
              <Search className="h-4 w-4" />
              Track
            </Button>
          </form>

          <p className="rounded-md bg-background/80 px-3 py-2 text-xs text-muted-foreground">
            Tip: Order data often appears first, while payment/shipping can be
            briefly delayed.
          </p>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            <TrackCard
              icon={<ShoppingCart className="h-5 w-5" />}
              title="Order"
              data={controller.trackData.order}
              delayClassName="ui-fade-in ui-delay-1"
            />
            <TrackCard
              icon={<Shield className="h-5 w-5" />}
              title="Payment"
              data={controller.trackData.payment}
              delayClassName="ui-fade-in ui-delay-2"
            />
            <TrackCard
              icon={<Truck className="h-5 w-5" />}
              title="Shipping"
              data={controller.trackData.shipping}
              delayClassName="ui-fade-in ui-delay-3"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

type TrackCardProps = {
  title: string;
  icon: ReactNode;
  data?: unknown;
  delayClassName?: string;
};

function TrackCard({ title, icon, data, delayClassName }: TrackCardProps) {
  const entries =
    data && typeof data === "object" && !Array.isArray(data)
      ? Object.entries(data as Record<string, unknown>)
      : [];

  return (
    <div
      className={`min-h-[250px] rounded-xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-4 shadow-sm ${delayClassName ?? ""}`}
    >
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </p>

      <div className="space-y-2 rounded-lg bg-background/80 p-3 text-sm md:hidden">
        {!data ? (
          <p className="text-muted-foreground">
            Waiting for this service update. Try tracking again in a moment.
          </p>
        ) : entries.length > 0 ? (
          entries.map(([key, value]) => (
            <div key={key} className="grid grid-cols-[110px_1fr] gap-2">
              <span className="font-medium text-muted-foreground">{key}</span>
              <span className="break-words text-foreground">
                {String(value ?? "")}
              </span>
            </div>
          ))
        ) : (
          <p className="break-words text-foreground">{JSON.stringify(data)}</p>
        )}
      </div>

      <pre className="hidden max-h-[320px] overflow-auto rounded-lg bg-background/80 p-4 text-sm text-foreground md:block">
        {data
          ? JSON.stringify(data, null, 2)
          : "Waiting for this service update. Try tracking again in a moment."}
      </pre>
    </div>
  );
}
