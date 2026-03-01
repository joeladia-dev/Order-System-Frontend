import { Menu, X } from "lucide-react";
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

export function AppNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="mt-3">
      <div className="hidden flex-wrap gap-2 md:flex">
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

      <div className="md:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span>Navigation</span>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

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
