import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

/** Parse a backend ISO datetime (always UTC, trailing Z) into a Date. */
export function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = parseISO(iso);
  return isValid(d) ? d : null;
}

/** Format an event start datetime, optionally in a city timezone. */
export function formatEventDate(
  iso: string | null | undefined,
  timezone?: string,
): string {
  const d = parseDate(iso);
  if (!d) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone,
    }).format(d);
  } catch {
    return format(d, "d MMM yyyy, HH:mm");
  }
}

/** A relative "in 3 days" / "2 days ago" label. */
export function formatRelative(iso: string | null | undefined): string {
  const d = parseDate(iso);
  if (!d) return "";
  return formatDistanceToNow(d, { addSuffix: true });
}

/** Just the date part (for date-range filter defaults). */
export function formatDateInput(iso: string | null | undefined): string {
  const d = parseDate(iso);
  if (!d) return "";
  return format(d, "yyyy-MM-dd");
}

/** A friendly "Berlin, Germany" venue/city label. */
export function venueLabel(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(", ");
}