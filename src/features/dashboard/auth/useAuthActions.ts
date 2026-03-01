import type { FormEvent } from "react";
import { api } from "../../../lib/api";
import type { DashboardState } from "../useDashboardState";

type BusyRunner = (action: () => Promise<void>) => Promise<void>;

export function useAuthActions(state: DashboardState, runBusy: BusyRunner) {
  const requestCode = async (event: FormEvent) => {
    event.preventDefault();
    await runBusy(async () => {
      const response = await api.requestCode(state.customerEmail);
      if (response.verificationCode) {
        state.setOtpCode(response.verificationCode);
        state.setStatus(
          `Verification code generated for development: ${response.verificationCode}`,
        );
      } else {
        state.setStatus(
          "Verification code requested. Check your mailbox/provider integration.",
        );
      }
    });
  };

  const verifyCode = async (event: FormEvent) => {
    event.preventDefault();
    await runBusy(async () => {
      const response = await api.verifyCode(state.customerEmail, state.otpCode);
      state.setCustomerToken(response.accessToken);
      state.setStatus(`Signed in as ${response.user.email}`);
    });
  };

  const startGoogle = async () => {
    await runBusy(async () => {
      const response = await api.getGoogleStartUrl();
      window.location.href = response.authorizeUrl;
    });
  };

  const createAdminToken = async () => {
    await runBusy(async () => {
      const response = await api.createDevToken(state.adminEmail, ["admin"]);
      state.setAdminToken(response.accessToken);
      state.setStatus(`Admin token generated for ${response.user.email}`);
    });
  };

  return {
    requestCode,
    verifyCode,
    startGoogle,
    createAdminToken,
  };
}
