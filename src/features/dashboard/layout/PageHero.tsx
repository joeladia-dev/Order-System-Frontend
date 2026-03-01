import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

type PageHeroProps = {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  accentClassName?: string;
  iconAccentClassName?: string;
  eyebrowClassName?: string;
  primaryGlowClassName?: string;
  secondaryGlowClassName?: string;
};

export function PageHero({
  icon,
  eyebrow,
  title,
  description,
  accentClassName,
  iconAccentClassName,
  eyebrowClassName,
  primaryGlowClassName,
  secondaryGlowClassName,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "ui-fade-in ui-lift-hover ui-glow-hover relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card/90 to-card/65 p-5 shadow-sm",
        accentClassName,
      )}
    >
      <div
        className={cn(
          "absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/15 blur-2xl",
          primaryGlowClassName,
        )}
      />
      <div
        className={cn(
          "absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-accent/15 blur-2xl",
          secondaryGlowClassName,
        )}
      />

      <div className="relative space-y-2">
        <p
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground",
            eyebrowClassName,
          )}
        >
          <span
            className={cn(
              "inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary",
              iconAccentClassName,
            )}
          >
            {icon}
          </span>
          {eyebrow}
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {title}
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
