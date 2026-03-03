import { CustomerSignInSection } from "../auth/CustomerSignInSection";
import type { DashboardController } from "../useDashboardController";

type CustomerSignInPageProps = {
  controller: DashboardController;
};

export function CustomerSignInPage({ controller }: CustomerSignInPageProps) {
  return (
    <section>
      <div className="max-w-2xl">
        <CustomerSignInSection controller={controller} />
      </div>
    </section>
  );
}
