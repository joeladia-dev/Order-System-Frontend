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
    <section className="space-y-4">
      <div className="ui-fade-in ui-lift-hover rounded-xl border border-border/70 bg-gradient-to-br from-card/85 to-card/60 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          Choose your workspace
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Follow a customer-first flow: sign in, place an order, then track
          fulfillment. Admin catalog access is optional and only needed when you
          want to manage products.
        </p>
      </div>

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

      <div className="grid gap-4 md:grid-cols-3">
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
      className={`ui-lift-hover ui-glow-hover bg-card/85 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg ${delayClassName ?? ""}`}
    >
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {highlights.map((item) => (
            <li key={item} className="inline-flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="rounded-md bg-background/80 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Best for:</span>{" "}
          {bestFor}
        </p>

        <Button asChild className="w-full">
          <Link to={to}>
            Open <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
