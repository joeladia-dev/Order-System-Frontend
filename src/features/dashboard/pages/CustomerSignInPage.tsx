import { KeyRound } from "lucide-react";
import { CustomerSignInSection } from "../auth/CustomerSignInSection";
import { PageHero } from "../layout/PageHero";
import type { DashboardController } from "../useDashboardController";

type CustomerSignInPageProps = {
  controller: DashboardController;
};

export function CustomerSignInPage({ controller }: CustomerSignInPageProps) {
  return (
    <section className="space-y-5">
      <PageHero
        icon={<KeyRound className="h-3.5 w-3.5" />}
        eyebrow="Customer Access"
        title="Welcome back — secure your customer session"
        description="Use OTP verification or Google OAuth, then proceed directly to Ordering System. Admin Product Access is optional unless you need catalog changes."
        iconAccentClassName="bg-primary/25 text-primary"
        eyebrowClassName="border-primary/30 bg-primary/10"
        primaryGlowClassName="bg-primary/25"
        secondaryGlowClassName="bg-accent/20"
      />
      <div className="max-w-2xl">
        <CustomerSignInSection controller={controller} />
      </div>
    </section>
  );
}
