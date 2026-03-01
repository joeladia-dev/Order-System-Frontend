import { ClipboardList } from "lucide-react";
import { PageHero } from "../layout/PageHero";
import { OrderSection } from "../orders/OrderSection";
import { TrackingSection } from "../tracking/TrackingSection";
import type { DashboardController } from "../useDashboardController";

type OrderingSystemPageProps = {
  controller: DashboardController;
};

export function OrderingSystemPage({ controller }: OrderingSystemPageProps) {
  return (
    <section className="space-y-5">
      <PageHero
        icon={<ClipboardList className="h-3.5 w-3.5" />}
        eyebrow="Order Operations"
        title="Execute and monitor end-to-end fulfillment"
        description="Create orders quickly, then inspect order, payment, and shipping states from a single high-detail operational view."
        iconAccentClassName="bg-primary/20 text-primary"
        eyebrowClassName="border-primary/30 bg-background/75"
        primaryGlowClassName="bg-primary/22"
        secondaryGlowClassName="bg-accent/12"
      />
      <div className="grid gap-6 xl:grid-cols-[0.7fr_2.3fr]">
        <OrderSection controller={controller} />
        <TrackingSection controller={controller} />
      </div>
    </section>
  );
}
