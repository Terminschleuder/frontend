import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiConfigProvider } from "@/config/ApiConfigProvider";
import { useApiConfig } from "@/config/useApiConfig";
import { STORAGE_KEY, DEFAULT_API_URL } from "@/config/constants";
import { loadBaseUrl, saveBaseUrl, clearBaseUrl } from "@/config/storage";

beforeEach(() => localStorage.clear());

describe("config storage", () => {
  it("returns null when nothing is stored", () => {
    expect(loadBaseUrl()).toBeNull();
  });
  it("round-trips a URL", () => {
    saveBaseUrl("http://api.example/");
    expect(loadBaseUrl()).toBe("http://api.example/");
    clearBaseUrl();
    expect(loadBaseUrl()).toBeNull();
  });
});

function Probe() {
  const { baseUrl, isConfigured } = useApiConfig();
  return (
    <div>
      <span data-testid="url">{baseUrl}</span>
      <span data-testid="configured">{String(isConfigured)}</span>
    </div>
  );
}

function withQuery(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <ApiConfigProvider>{ui}</ApiConfigProvider>
    </QueryClientProvider>,
  );
}

describe("ApiConfigProvider", () => {
  it("uses the built-in default URL and reports configured when nothing is stored", () => {
    const { getByTestId } = withQuery(<Probe />);
    expect(getByTestId("url").textContent).toBe(DEFAULT_API_URL);
    expect(getByTestId("configured").textContent).toBe("true");
  });

  it("uses a stored URL and reports configured", () => {
    localStorage.setItem(STORAGE_KEY, "http://stored.example");
    const { getByTestId } = withQuery(<Probe />);
    expect(getByTestId("url").textContent).toBe("http://stored.example");
    expect(getByTestId("configured").textContent).toBe("true");
  });
});