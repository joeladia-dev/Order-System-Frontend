import { Route, Routes } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppNavigation } from "./features/dashboard/layout/AppNavigation";
import { DashboardHeader } from "./features/dashboard/layout/DashboardHeader";
import { AdminAccessPage } from "./features/dashboard/pages/AdminAccessPage";
import { CustomerSignInPage } from "./features/dashboard/pages/CustomerSignInPage";
import { LandingPage } from "./features/dashboard/pages/LandingPage";
import { OrderingSystemPage } from "./features/dashboard/pages/OrderingSystemPage";
import { useDashboardController } from "./features/dashboard/useDashboardController";
import { api } from "./lib/api";

function App() {
  const controller = useDashboardController();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionBootstrapDoneRef = useRef(false);
  const oauthBootstrapDoneRef = useRef(false);

  useEffect(() => {
    if (window.location.hostname !== "127.0.0.1") {
      return;
    }

    const nextUrl = `http://localhost:${window.location.port}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(nextUrl);
  }, []);

  useEffect(() => {
    if (sessionBootstrapDoneRef.current) {
      return;
    }

    sessionBootstrapDoneRef.current = true;

    api.getSession()
      .then(async (session) => {
        if (!session.authenticated) {
          return;
        }

        controller.setHasOAuthSession(true);
        controller.setCustomerEmail((prev) => prev || session.user.email);
        if (session.accessToken) {
          controller.setCustomerToken(session.accessToken);
        }

        await controller.loadProducts();
        controller.setStatus(
          `Already signed in as ${session.user.email}. You can continue to Ordering System.`,
        );
      })
      .catch(() => {
      });
  }, [controller]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthResult = params.get("oauth");

    if (oauthResult !== "success" || oauthBootstrapDoneRef.current) {
      return;
    }

    oauthBootstrapDoneRef.current = true;

    const provider = params.get("provider");
    params.delete("oauth");
    params.delete("provider");
    const cleanedSearch = params.toString();
    const targetPath = "/customer-sign-in";
    const targetUrl = `${targetPath}${cleanedSearch ? `?${cleanedSearch}` : ""}${location.hash}`;

    api.getSession()
      .then(async (session) => {
        if (session.authenticated) {
          controller.setHasOAuthSession(true);
          controller.setCustomerEmail((prev) => prev || session.user.email);
          if (session.accessToken) {
            controller.setCustomerToken(session.accessToken);
          }

          await controller.loadProducts();
          controller.setStatus(
            provider
              ? `Signed in with ${provider}. You are already signed in and can go to Ordering System.`
              : "Google OAuth sign-in completed. You are already signed in and can go to Ordering System.",
          );
        } else {
          controller.setStatus("Google OAuth completed, but no active session was detected.");
        }
      })
      .catch(() => {
        controller.setStatus("Google OAuth completed, but session bootstrap failed.");
      })
      .finally(() => {
        navigate(targetUrl, { replace: true });
      });
  }, [controller, location.hash, location.search, navigate]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border/70 bg-muted/70 backdrop-blur-2xl">
        <div className="mx-auto w-full max-w-[96rem] px-4 py-3 md:px-10 md:py-4">
          <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-primary/22 via-accent/18 to-secondary/60 px-3 py-3 shadow-sm md:px-4">
            <DashboardHeader status={controller.status} />
            <AppNavigation />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[96rem] px-4 py-5 md:px-10 md:py-8">
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
