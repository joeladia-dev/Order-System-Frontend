import { Package } from "lucide-react";
import { AdminAccessSection } from "../auth/AdminAccessSection";
import { ProductsSection } from "../catalog/ProductsSection";
import { PageHero } from "../layout/PageHero";
import type { DashboardController } from "../useDashboardController";

type AdminAccessPageProps = {
  controller: DashboardController;
};

export function AdminAccessPage({ controller }: AdminAccessPageProps) {
  return (
    <section className="space-y-5">
      <PageHero
        icon={<Package className="h-3.5 w-3.5" />}
        eyebrow="Catalog Control"
        title="Control catalog quality and inventory health"
        description="Use admin access to create products, maintain pricing accuracy, and keep inventory levels ready for fulfillment."
        iconAccentClassName="bg-accent/25 text-accent-foreground"
        eyebrowClassName="border-accent/35 bg-accent/10"
        primaryGlowClassName="bg-accent/25"
        secondaryGlowClassName="bg-primary/20"
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <AdminAccessSection controller={controller} />
        <ProductsSection controller={controller} />
      </div>
    </section>
  );
}
