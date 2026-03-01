import { Shield } from "lucide-react";

type DashboardHeaderProps = {
  status: string;
};

export function DashboardHeader({ status }: DashboardHeaderProps) {
  return (
    <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs text-muted-foreground shadow-sm">
          <Shield className="h-3.5 w-3.5" />
          Phase 2 · Order System UI
        </p>
        <h1 className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl md:text-3xl">
          Order System Control Center
        </h1>
        <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
          Customer-first flow for sign-in, order creation, and fulfillment
          tracking, with optional admin product management.
        </p>
      </div>
      <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-xs text-muted-foreground shadow-sm md:justify-self-end">
        <span className="font-medium text-foreground">Status:</span> {status}
      </div>
    </div>
  );
}
