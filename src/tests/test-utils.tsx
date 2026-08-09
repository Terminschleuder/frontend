import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { ApiConfigProvider } from "@/config/ApiConfigProvider";
import { STORAGE_KEY } from "@/config/constants";
import { TEST_API_URL } from "./handlers";

/** Render a node with all the providers the app needs, pre-configured to point
 * at the MSW-backed test API URL. */
export function renderWithProviders(
  ui: ReactElement,
  { initialRoutes = ["/"] }: { initialRoutes?: string[] } = {},
) {
  localStorage.setItem(STORAGE_KEY, TEST_API_URL);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ApiConfigProvider>
        <MemoryRouter initialEntries={initialRoutes}>{ui}</MemoryRouter>
      </ApiConfigProvider>
    </QueryClientProvider>,
  );
}