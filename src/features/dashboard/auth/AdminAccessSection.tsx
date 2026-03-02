import { CheckCircle2, Clock3, Shield } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type { DashboardController } from "../useDashboardController";

type AdminAccessSectionProps = {
  controller: DashboardController;
};

export function AdminAccessSection({ controller }: AdminAccessSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-accent" />
          Admin Product Access
        </CardTitle>
        <CardDescription>
          Use Google OAuth session cookie or generate a local admin token for
          catalog writes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {controller.adminToken ? (
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Admin token ready
          </p>
        ) : (
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 bg-muted/70 px-3 py-1.5 text-xs font-semibold text-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            Admin auth required (cookie session or token)
          </p>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="admin-email"
            className="text-xs font-medium text-muted-foreground"
          >
            Admin Email <span className="text-primary">*</span>
          </label>
          <Input
            id="admin-email"
            value={controller.adminEmail}
            onChange={(e) => controller.setAdminEmail(e.target.value)}
            placeholder="admin@email.com"
            required
          />
          <p className="text-[11px] text-muted-foreground">
            Required to generate a local admin token.
          </p>
        </div>
        <Button
          disabled={controller.isBusy}
          onClick={controller.createAdminToken}
          type="button"
          className="w-full"
        >
          Generate Admin Token
        </Button>
        <div className="space-y-1.5">
          <label
            htmlFor="admin-token"
            className="text-xs font-medium text-muted-foreground"
          >
            Admin Bearer Token
          </label>
          <Input
            id="admin-token"
            value={controller.adminToken}
            onChange={(e) => controller.setAdminToken(e.target.value)}
            placeholder="Paste admin bearer token"
          />
          <p className="text-[11px] text-muted-foreground">
            Optional when signed in through Google OAuth admin session.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
