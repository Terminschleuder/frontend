import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { EventsPage } from "@/pages/EventsPage";
import { renderWithProviders } from "./test-utils";

describe("EventsPage", () => {
  it("renders published events with hero images", async () => {
    renderWithProviders(<EventsPage />);
    await waitFor(() => {
      expect(screen.getByText("Berlin Python Meetup #42")).toBeInTheDocument();
    });
    // Hero image is rendered as an <img> in the card with a descriptive alt.
    expect(screen.getByRole("img", { name: /Berlin Python Meetup #42/i })).toHaveAttribute(
      "src",
      expect.stringContaining("berlin-python-meetup-42.png"),
    );
  });

  it("shows the published-only note", async () => {
    renderWithProviders(<EventsPage />);
    await waitFor(() =>
      expect(screen.getByText(/Showing published events only/i)).toBeInTheDocument(),
    );
  });
});