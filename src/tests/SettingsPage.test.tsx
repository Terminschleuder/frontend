import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { SettingsPage } from "@/pages/SettingsPage";
import { renderWithProviders } from "./test-utils";
import { DEFAULT_API_URL } from "@/config/constants";
import { TEST_API_URL } from "./handlers";

beforeEach(() => localStorage.clear());

describe("SettingsPage", () => {
  it("seeds the draft input from the stored base URL", () => {
    renderWithProviders(<SettingsPage />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe(TEST_API_URL);
  });

  it("keeps the draft in sync when the base URL changes externally (reset to default)", () => {
    renderWithProviders(<SettingsPage />);
    // Edit the draft, then reset the stored URL — the draft must follow.
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "http://edited.example/" } });
    fireEvent.click(screen.getByRole("button", { name: "Reset to default" }));
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(DEFAULT_API_URL);
  });
});