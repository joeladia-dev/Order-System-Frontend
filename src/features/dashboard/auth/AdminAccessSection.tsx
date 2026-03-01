import { Shield } from "lucide-react";
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
          Generate local admin token for product creation and stock updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            Optional if you generated a token in this page.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
