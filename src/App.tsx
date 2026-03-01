import { Route, Routes } from "react-router-dom";
import { AppNavigation } from "./features/dashboard/layout/AppNavigation";
import { DashboardHeader } from "./features/dashboard/layout/DashboardHeader";
import { AdminAccessPage } from "./features/dashboard/pages/AdminAccessPage";
import { CustomerSignInPage } from "./features/dashboard/pages/CustomerSignInPage";
import { LandingPage } from "./features/dashboard/pages/LandingPage";
import { OrderingSystemPage } from "./features/dashboard/pages/OrderingSystemPage";
import { useDashboardController } from "./features/dashboard/useDashboardController";

function App() {
  const controller = useDashboardController();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border/70 bg-muted/70 backdrop-blur-2xl">
        <div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-10 md:py-4">
          <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-primary/22 via-accent/18 to-secondary/60 px-3 py-3 shadow-sm md:px-4">
            <DashboardHeader status={controller.status} />
            <AppNavigation />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-10 md:py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/customer-sign-in"
            element={<CustomerSignInPage controller={controller} />}
          />
          <Route
            path="/admin-access"
            element={<AdminAccessPage controller={controller} />}
          />
          <Route
            path="/ordering-system"
            element={<OrderingSystemPage controller={controller} />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
