import { ArrowRight, KeyRound, Package, ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export function LandingPage() {
  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="ui-fade-in ui-lift-hover rounded-xl border border-border/70 bg-gradient-to-br from-card/85 to-card/60 p-4 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Quick Start
        </h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <QuickStep
            step="1"
            title="Customer Sign In"
            detail="Get a customer token via OTP or Google OAuth."
            delayClassName="ui-fade-in ui-delay-1"
          />
          <QuickStep
            step="2"
            title="Ordering System"
            detail="Place an order directly once customer sign-in is confirmed."
            delayClassName="ui-fade-in ui-delay-2"
          />
          <QuickStep
            step="3"
            title="Track Fulfillment"
            detail="Track order, payment, and shipping updates by order ID."
            delayClassName="ui-fade-in ui-delay-3"
          />
        </div>
        <p className="mt-3 rounded-md border border-border/70 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
          Optional: Use{" "}
          <span className="font-medium text-foreground">
            Admin Product Access
          </span>{" "}
          only if you need to create or update products.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <LandingCard
          icon={<KeyRound className="h-5 w-5 text-primary" />}
          title="Customer Sign In"
          description="Request OTP or use Google OAuth to obtain customer token."
          highlights={[
            "Sign in using OTP code verification.",
            "Use Google OAuth for faster login flow.",
            "Store and reuse customer bearer token.",
          ]}
          bestFor="Customer authentication and token setup before placing orders."
          to="/customer-sign-in"
          delayClassName="ui-fade-in ui-delay-1"
        />
        <LandingCard
          icon={<Package className="h-5 w-5 text-primary" />}
          title="Admin Product Access (Optional)"
          description="Generate admin token only when you need to manage product catalog and stock."
          highlights={[
            "Generate local development admin token.",
            "Create products with ID, price, and stock.",
            "Update inventory stock quickly for testing.",
          ]}
          bestFor="Optional catalog management for product setup and maintenance."
          to="/admin-access"
          delayClassName="ui-fade-in ui-delay-2"
        />
        <LandingCard
          icon={<ShoppingCart className="h-5 w-5 text-primary" />}
          title="Ordering System"
          description="Place orders and track fulfillment without auth/admin forms mixed in."
          highlights={[
            "Submit customer order details and items right after sign-in.",
            "Track order, payment, and shipping status.",
            "View fulfillment data in mobile and desktop views.",
          ]}
          bestFor="Order lifecycle workflows after authentication is ready."
          to="/ordering-system"
          delayClassName="ui-fade-in ui-delay-3"
        />
      </div>
    </section>
  );
}

type QuickStepProps = {
  step: string;
  title: string;
  detail: string;
  delayClassName?: string;
};

function QuickStep({ step, title, detail, delayClassName }: QuickStepProps) {
  return (
    <div
      className={`ui-lift-hover rounded-lg border border-border/70 bg-background/70 p-3 ${delayClassName ?? ""}`}
    >
      <p className="text-xs font-semibold text-primary">Step {step}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

type LandingCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  highlights: string[];
  bestFor: string;
  to: string;
  delayClassName?: string;
};

function LandingCard({
  icon,
  title,
  description,
  highlights,
  bestFor,
  to,
  delayClassName,
}: LandingCardProps) {
  return (
    <Card
      className={`ui-lift-hover ui-glow-hover flex h-full flex-col bg-card/85 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg ${delayClassName ?? ""}`}
    >
      <CardHeader className="space-y-1.5 pb-2 sm:space-y-2 sm:pb-3">
        <CardTitle className="inline-flex items-center gap-2 text-base sm:text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-5">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-2.5 sm:space-y-3">
        <ul className="space-y-0.5 text-sm text-muted-foreground sm:space-y-1">
          {highlights.map((item) => (
            <li key={item} className="inline-flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="flex h-16 items-center rounded-md bg-background/80 px-2.5 py-1.5 text-xs leading-5 text-muted-foreground sm:px-3 sm:py-2">
          <span className="font-medium text-foreground">Best for:</span>{" "}
          {bestFor}
        </p>

        <Button asChild className="mt-auto h-9 w-full sm:h-10">
          <Link to={to}>
            Open <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
