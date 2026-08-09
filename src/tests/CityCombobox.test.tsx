import { describe, it, expect } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { EventsPage } from "@/pages/EventsPage";
import { TEST_API_URL } from "./handlers";
import { server } from "./server";
import { renderWithProviders } from "./test-utils";

const emptyPage = () =>
  HttpResponse.json({ count: 0, next: null, previous: null, results: [] });

/**
 * The events list is driven by URL search params (see EventsPage). Selecting a
 * city in either combobox patches the URL, which re-fetches /api/events/ — so
 * we record the request query to assert the right filter was sent.
 */
function recordEventsSearch(): Set<string> {
  const seen = new Set<string>();
  server.use(
    http.get(`${TEST_API_URL}/api/events/`, ({ request }) => {
      seen.add(new URL(request.url).search);
      return emptyPage();
    }),
  );
  return seen;
}

describe("Events page city comboboxes", () => {
  it("the city exact filter sends city=<name>", async () => {
    const seen = recordEventsSearch();
    renderWithProviders(<EventsPage />);

    const city = await screen.findByRole("combobox", {
      name: /City \(exact venue\.city\)/i,
    });
    fireEvent.focus(city);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Berlin, DE" })).toBeInTheDocument(),
    );
    fireEvent.mouseDown(screen.getByRole("option", { name: "Berlin, DE" }));

    await waitFor(() => {
      expect([...seen].some((s) => s.includes("city=Berlin"))).toBe(true);
    });
  });

  it("the near_city picker sends near_city=<slug>", async () => {
    const seen = recordEventsSearch();
    renderWithProviders(<EventsPage />);

    // Switch proximity mode to "Near a city" — this reveals the city picker.
    fireEvent.click(screen.getByLabelText(/Near a city/i));

    const picker = await screen.findByRole("combobox", { name: /^City$/i });
    fireEvent.focus(picker);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Berlin, DE" })).toBeInTheDocument(),
    );
    fireEvent.mouseDown(screen.getByRole("option", { name: "Berlin, DE" }));

    await waitFor(() => {
      expect([...seen].some((s) => s.includes("near_city=berlin-de"))).toBe(true);
    });
  });
});