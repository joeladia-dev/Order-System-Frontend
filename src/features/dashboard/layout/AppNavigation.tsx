import { LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";

const links = [
  { to: "/", label: "Landing" },
  { to: "/customer-sign-in", label: "Customer Sign In" },
  { to: "/ordering-system", label: "Ordering System" },
  { to: "/admin-access", label: "Admin Product Access (Optional)" },
];

type AppNavigationProps = {
  canLogout: boolean;
  isBusy: boolean;
  onLogout: () => void;
  logoutIndicatorTone: "customer" | "admin" | null;
};

export function AppNavigation({
  canLogout,
  isBusy,
  onLogout,
  logoutIndicatorTone,
}: AppNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="mt-3">
      <div className="hidden items-center justify-between gap-2 md:flex">
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full border border-border/70 bg-background/75 px-4 py-1.5 text-sm text-muted-foreground shadow-sm transition-all duration-200 hover:bg-muted/70 hover:shadow",
                  isActive &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                )
              }
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={onLogout}
          disabled={isBusy || !canLogout}
        >
          {logoutIndicatorTone && (
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                logoutIndicatorTone === "customer" ? "bg-primary" : "bg-accent",
              )}
              aria-hidden="true"
            />
          )}
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="md:hidden">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 justify-between"
            onClick={() => setIsOpen((value) => !value)}
          >
            <span>Navigation</span>
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLogout}
            disabled={isBusy || !canLogout}
          >
            {logoutIndicatorTone && (
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  logoutIndicatorTone === "customer"
                    ? "bg-primary"
                    : "bg-accent",
                )}
                aria-hidden="true"
              />
            )}
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {isOpen && (
          <div className="mt-2 grid gap-2 rounded-xl border border-border/70 bg-card/85 p-2 shadow-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted/70",
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                  )
                }
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
