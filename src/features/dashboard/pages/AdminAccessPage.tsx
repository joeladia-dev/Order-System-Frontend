import { AdminAccessSection } from "../auth/AdminAccessSection";
import { ProductsSection } from "../catalog/ProductsSection";
import type { DashboardController } from "../useDashboardController";

type AdminAccessPageProps = {
  controller: DashboardController;
};

export function AdminAccessPage({ controller }: AdminAccessPageProps) {
  return (
    <section>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <AdminAccessSection controller={controller} />
        <ProductsSection controller={controller} />
      </div>
    </section>
  );
}
