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
      state.setOrderForm((prev) => ({
        ...prev,
        customerId: response.user.id,
      }));
      state.setHasAdminSession(false);
      state.setStatus(`Signed in as ${response.user.email}`);
    });
  };

  const startGoogle = async () => {
    await runBusy(async () => {
      const response = await api.getGoogleStartUrl(
        `${window.location.origin}/customer-sign-in`,
      );
      window.location.href = response.authorizeUrl;
    });
  };

  const createAdminToken = async () => {
    await runBusy(async () => {
      const response = await api.createDevToken(state.adminEmail, ["admin"]);
      state.setAdminToken(response.accessToken);
      state.setHasAdminSession(true);
      state.setStatus(`Admin token generated for ${response.user.email}`);
    });
  };

  const logoutCustomer = async () => {
    await runBusy(async () => {
      await api.logout();
      state.setCustomerToken("");
      state.setHasOAuthSession(false);
      state.setAdminToken("");
      state.setHasAdminSession(false);
      state.setOtpCode("");
      state.setTrackOrderId("");
      state.setTrackData({});
      state.setCustomerOrders([]);
      state.setCustomerOrdersError("");
      state.setSelectedHistoryOrderId("");
      state.setCreatedOrderId("");
      state.setOrderItems([]);
      state.setOrderForm((prev) => ({
        ...prev,
        customerId: "",
      }));
      state.setStatus("Signed out. You can now sign in with another account.");
    });
  };

  return {
    requestCode,
    verifyCode,
    startGoogle,
    createAdminToken,
    logoutCustomer,
  };
}
