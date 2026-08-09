import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OnboardingModal } from "@/components/config/OnboardingModal";
import { useApiConfig } from "@/config/useApiConfig";

/** App shell: header + routed page + footer, with first-run onboarding. */
export function App() {
  const { isConfigured } = useApiConfig();
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
      {!isConfigured && <OnboardingModal />}
    </div>
  );
}