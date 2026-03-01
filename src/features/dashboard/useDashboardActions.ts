import { useAuthActions } from "./auth/useAuthActions";
import { useCatalogActions } from "./catalog/useCatalogActions";
import { useOrderActions } from "./orders/useOrderActions";
import { useTrackingActions } from "./tracking/useTrackingActions";
import type { DashboardState } from "./useDashboardState";

export function useDashboardActions(state: DashboardState) {
  const withBusy = async (action: () => Promise<void>) => {
    try {
      state.setIsBusy(true);
      await action();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error.";
      state.setStatus(`Error: ${message}`);
    } finally {
      state.setIsBusy(false);
    }
  };

  const authActions = useAuthActions(state, withBusy);
  const catalogActions = useCatalogActions(state, withBusy);
  const orderActions = useOrderActions(state, withBusy);
  const trackingActions = useTrackingActions(state, withBusy);

  return {
    ...authActions,
    ...catalogActions,
    ...orderActions,
    ...trackingActions,
  };
}

export type DashboardActions = ReturnType<typeof useDashboardActions>;
