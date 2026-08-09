import { useMemo, useState } from "react";
import { useCitiesAll } from "@/hooks/useCities";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

interface CityComboboxProps {
  /** Currently selected value (a city name or slug, depending on ``valueKey``). */
  value: string;
  /** Called with the selected city's name or slug. ``""`` clears the selection. */
  onChange: (value: string) => void;
  /** Which city field to emit/select on: the ``city`` exact filter wants the
   * name (it matches ``venue.city``); the ``near_city`` proximity filter wants
   * the slug. */
  valueKey: "name" | "slug";
  placeholder?: string;
  /** When false (default) the ~2131-city fetch is deferred until the control is
   * focused or already has a value — keeps the Events page light. Pass true to
   * always load (e.g. when the picker is visible regardless of focus). */
  enabled?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}

/**
 * A typeable dropdown of cities backed by the full gazetteer
 * (``/api/cities/all/``). Defers the fetch until the control is focused (or a
 * value is already present) so the Events page doesn't eagerly pull 2131 rows.
 */
export function CityCombobox({
  value,
  onChange,
  valueKey,
  placeholder,
  enabled,
  disabled,
  "aria-label": ariaLabel,
}: CityComboboxProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value);
  const queryEnabled = enabled || focused || hasValue;
  const { data: cities } = useCitiesAll({}, queryEnabled);

  const options = useMemo<ComboboxOption[]>(
    () =>
      (cities ?? [])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({ value: c[valueKey], label: `${c.name}, ${c.country_code}` })),
    [cities, valueKey],
  );

  return (
    <Combobox
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onFocusChange={setFocused}
      aria-label={ariaLabel}
    />
  );
}