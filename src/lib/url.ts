/** Join a base URL and a path, tolerating trailing/leading slashes. */
export function joinUrl(base: string, path: string): string {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  if (!trimmedPath) return trimmedBase;
  return `${trimmedBase}/${trimmedPath}`;
}

/** Serialize a params object into a query string, skipping null/undefined/"". */
export function buildQueryString(
  params: Record<string, string | number | boolean | null | undefined>,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    sp.append(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}