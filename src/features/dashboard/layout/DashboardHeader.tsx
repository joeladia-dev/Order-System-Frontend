import { AlertTriangle, CheckCircle2, Clock3, Shield } from "lucide-react";

type DashboardHeaderProps = {
  status: string;
};

export function DashboardHeader({ status }: DashboardHeaderProps) {
  const tone = getStatusTone(status);
  const toneClass =
    tone === "ok"
      ? "border-primary/40 bg-primary/15 text-primary"
      : tone === "warn"
        ? "border-border/70 bg-muted/70 text-foreground"
        : "border-destructive/40 bg-destructive/10 text-destructive";

  const icon =
    tone === "ok" ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : tone === "warn" ? (
      <Clock3 className="h-3.5 w-3.5" />
    ) : (
      <AlertTriangle className="h-3.5 w-3.5" />
    );

  return (
    <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs text-muted-foreground shadow-sm">
          <Shield className="h-3.5 w-3.5" />
          Order System UI
        </p>
        <h1 className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl md:text-3xl">
          Order System Control Center
        </h1>
        <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
          Customer-first flow for sign-in, order creation, and fulfillment
          tracking, with optional admin product management.
        </p>
      </div>
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm md:justify-self-end ${toneClass}`}
      >
        {icon}
        <span>{status}</span>
      </div>
    </div>
  );
}

function getStatusTone(status: string): "ok" | "warn" | "error" {
  const value = status.toLowerCase();

  if (value.includes("error") || value.includes("failed")) {
    return "error";
  }

  if (
    value.includes("ready") ||
    value.includes("success") ||
    value.includes("signed in") ||
    value.includes("created") ||
    value.includes("loaded") ||
    value.includes("updated") ||
    value.includes("refreshed")
  ) {
    return "ok";
  }

  return "warn";
}
