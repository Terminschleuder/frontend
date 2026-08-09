import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

const FRUITS: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("Combobox", () => {
  it("filters options by the typed text", () => {
    render(
      <Combobox options={FRUITS} value="" onChange={() => {}} placeholder="pick" />,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ap" } });
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Apricot" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Banana" })).not.toBeInTheDocument();
  });

  it("selects on Enter after navigating with ArrowDown", () => {
    const onChange = vi.fn();
    render(<Combobox options={FRUITS} value="" onChange={onChange} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "a" } });
    // Two "ap…" options; first active is Apple. Move down to Apricot.
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith("apricot");
    expect(input).toHaveValue("Apricot");
  });

  it("selects on click", () => {
    const onChange = vi.fn();
    render(<Combobox options={FRUITS} value="" onChange={onChange} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "b" } });
    fireEvent.mouseDown(screen.getByRole("option", { name: "Banana" }));
    expect(onChange).toHaveBeenLastCalledWith("banana");
    expect(input).toHaveValue("Banana");
  });

  it("reverts the typed text on Escape when nothing matches", () => {
    const onChange = vi.fn();
    render(
      <Combobox options={FRUITS} value="banana" onChange={onChange} />,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input).toHaveValue("Banana"); // synced from value
    fireEvent.change(input, { target: { value: "zzz" } });
    fireEvent.keyDown(input, { key: "Escape" });
    // Reverts to the current selection's label; no change emitted.
    expect(input).toHaveValue("Banana");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("commits an exact-match label on blur", () => {
    const onChange = vi.fn();
    render(<Combobox options={FRUITS} value="" onChange={onChange} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "cherry" } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenLastCalledWith("cherry");
    expect(input).toHaveValue("Cherry");
  });
});