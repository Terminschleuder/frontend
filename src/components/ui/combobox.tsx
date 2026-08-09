import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  /** The selected option's value ("" = nothing selected). */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** Notifies the parent when the input gains/loses focus (e.g. to lazy-load). */
  onFocusChange?: (focused: boolean) => void;
  "aria-label"?: string;
}

/** Max options rendered in the dropdown (keeps the DOM light for 2000+ cities). */
const MAX_VISIBLE = 100;

function labelFor(options: ComboboxOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? "";
}

/**
 * A hand-rolled, dependency-free typeable dropdown (autocomplete combobox).
 *
 * Behaviour: the input text filters the options (case-insensitive substring on
 * the label); selecting an option (click / Enter / exact-match-on-blur) commits
 * its value via ``onChange``; Escape or a non-matching blur reverts to the
 * current selection. Keyboard: ArrowUp/Down to move, Enter to select, Escape
 * to close. Styled to match the existing ``Input``/``Select`` primitives.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  function Combobox(
    {
      options,
      value,
      onChange,
      placeholder,
      emptyLabel = "No matches",
      disabled,
      className,
      id,
      onFocusChange,
      ...aria
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(() => labelFor(options, value));
    const [active, setActive] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();

    // Keep the input text in sync with the external value — e.g. a parent
    // reset, or late-loading options (cities) that finally match ``value``.
    // Keyed on value/options only, so typing (which changes neither) and a
    // selection (which updates value via the parent) never get clobbered.
    useEffect(() => {
      setInputValue(labelFor(options, value));
    }, [value, options]);

    const filtered = inputValue
      ? options.filter((o) =>
          o.label.toLowerCase().includes(inputValue.toLowerCase()),
        )
      : options;
    const visible = filtered.slice(0, MAX_VISIBLE);

    useEffect(() => {
      setActive(0);
    }, [inputValue]);

    const select = (opt: ComboboxOption) => {
      onChange(opt.value);
      setInputValue(opt.label);
      setOpen(false);
    };

    const commitOrRevert = () => {
      setOpen(false);
      const exact = options.find(
        (o) => o.label.toLowerCase() === inputValue.trim().toLowerCase(),
      );
      if (exact) {
        onChange(exact.value);
        setInputValue(exact.label);
      } else {
        setInputValue(labelFor(options, value));
      }
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setActive((a) => Math.min(a + 1, visible.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (open && visible[active]) select(visible[active]);
      } else if (e.key === "Escape") {
        commitOrRevert();
      } else {
        setOpen(true);
      }
    };

    return (
      <div ref={containerRef} className="relative">
        <input
          ref={ref}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && visible[active] ? `${listboxId}-${active}` : undefined
          }
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          className={cn(
            "flex h-9 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900",
            className,
          )}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            onFocusChange?.(true);
          }}
          onBlur={() => {
            commitOrRevert();
            onFocusChange?.(false);
          }}
          onKeyDown={onKeyDown}
          {...aria}
        />
        {open && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            {visible.length === 0 ? (
              <li className="px-3 py-2 text-slate-400">{emptyLabel}</li>
            ) : (
              visible.map((opt, i) => (
                <li
                  key={opt.value}
                  id={`${listboxId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  // preventDefault so clicking an option doesn't blur first.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(opt);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "cursor-pointer px-3 py-1.5",
                    i === active ? "bg-slate-100 dark:bg-slate-800" : "",
                  )}
                >
                  {opt.label}
                </li>
              ))
            )}
            {filtered.length > MAX_VISIBLE && (
              <li className="px-3 py-1.5 text-slate-400">
                {filtered.length - MAX_VISIBLE} more — keep typing to narrow.
              </li>
            )}
          </ul>
        )}
      </div>
    );
  },
);
Combobox.displayName = "Combobox";