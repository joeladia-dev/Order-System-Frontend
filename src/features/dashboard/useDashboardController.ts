import { useDashboardActions } from "./useDashboardActions";
import { useDashboardState } from "./useDashboardState";

export function useDashboardController() {
  const state = useDashboardState();
  const actions = useDashboardActions(state);

  return {
    ...state,
    ...actions,
  };
}

export type DashboardController = ReturnType<typeof useDashboardController>;
