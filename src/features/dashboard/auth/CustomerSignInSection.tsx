import { CheckCircle2, KeyRound } from "lucide-react";
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

type CustomerSignInSectionProps = {
  controller: DashboardController;
};

export function CustomerSignInSection({
  controller,
}: CustomerSignInSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <KeyRound className="h-5 w-5 text-primary" />
          Customer Sign In
        </CardTitle>
        <CardDescription>{controller.tokenHint}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {(controller.customerToken || controller.hasOAuthSession) && (
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Customer session ready
          </p>
        )}

        <form className="space-y-3" onSubmit={controller.requestCode}>
          <Input
            value={controller.customerEmail}
            onChange={(e) => controller.setCustomerEmail(e.target.value)}
            placeholder="customer@email.com"
          />
          <Button disabled={controller.isBusy} type="submit" className="w-full">
            Request OTP Code
          </Button>
        </form>

        <form className="space-y-3" onSubmit={controller.verifyCode}>
          <Input
            value={controller.otpCode}
            onChange={(e) => controller.setOtpCode(e.target.value)}
            placeholder="6-digit code"
          />
          <Button
            disabled={controller.isBusy}
            type="submit"
            variant="secondary"
            className="w-full"
          >
            Verify OTP and Get Token
          </Button>
        </form>

        <Button
          disabled={controller.isBusy}
          type="button"
          variant="outline"
          className="w-full"
          onClick={controller.startGoogle}
        >
          Continue with Google OAuth
        </Button>

        <p className="rounded-md bg-background/80 px-3 py-2 text-xs text-muted-foreground">
          Google sign-in may briefly redirect your browser, then return you
          with cookie-session auth enabled automatically.
        </p>

        <Input
          value={controller.customerToken}
          onChange={(e) => controller.setCustomerToken(e.target.value)}
          placeholder="Paste customer bearer token"
        />
        <p className="text-[11px] text-muted-foreground">
          Optional: manual token paste is only needed for non-browser clients.
        </p>
      </CardContent>
    </Card>
  );
}
