import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { CitiesPage } from "@/pages/CitiesPage";
import { renderWithProviders } from "./test-utils";

describe("CitiesPage", () => {
  it("renders seeded cities from the API", async () => {
    renderWithProviders(<CitiesPage />);
    await waitFor(() => {
      expect(screen.getByText("Berlin")).toBeInTheDocument();
    });
    expect(screen.getByText(/Find events near Berlin/)).toBeInTheDocument();
  });

  it("links to events near the city with near_city in the URL", async () => {
    renderWithProviders(<CitiesPage />);
    await waitFor(() => expect(screen.getByText("Berlin")).toBeInTheDocument());
    const link = screen.getByRole("link", { name: /Find events near Berlin/ });
    expect(link.getAttribute("href")).toContain("near_city=berlin-de");
  });
});