import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CityCombobox } from "@/components/cities/CityCombobox";
import { UseMyLocation } from "@/components/map/UseMyLocation";
import { useOrganizations } from "@/hooks/useOrganizations";
import type { EventsQuery } from "@/api/events";
import {
  ATTENDANCE_MODE_OPTIONS,
  EVENT_TYPE_OPTIONS,
} from "@/api/types";
import type { LatLng } from "@/lib/geo";

type ProximityMode = "none" | "near_city" | "coords";

interface EventFiltersProps {
  query: EventsQuery;
  /** Patch the query (merged). */
  onChange: (patch: Partial<EventsQuery>) => void;
  /** Replace the whole query (used when switching proximity mode). */
  onReplace: (query: EventsQuery) => void;
  onReset: () => void;
}

const ORDERING_OPTIONS = [
  { value: "starts_at", label: "Start date (soonest)" },
  { value: "-starts_at", label: "Start date (latest first)" },
  { value: "created_at", label: "Created (newest)" },
  { value: "-created_at", label: "Created (oldest)" },
  { value: "published_at", label: "Published (oldest)" },
  { value: "-published_at", label: "Published (newest)" },
  { value: "status", label: "Status" },
  { value: "event_type", label: "Event type" },
  { value: "attendance_mode", label: "Attendance" },
  { value: "distance", label: "Distance" },
];

export function EventFilters({
  query,
  onChange,
  onReplace,
  onReset,
}: EventFiltersProps) {
  // The proximity mode is a UI marker (``query.proximity``) so the picker stays
  // visible before a value is chosen; an actual filter is active only when a
  // city/coords value is present.
  const proximityMode: ProximityMode = query.proximity ?? "none";
  const proximityActive =
    Boolean(query.near_city) ||
    (query.lat != null && query.lon != null);

  // Organizations for the org picker.
  const { data: orgs } = useOrganizations({ page_size: 100, ordering: "name" });

  const setProximityMode = (mode: ProximityMode) => {
    const base: EventsQuery = {
      ...query,
      proximity: mode,
      near_city: null,
      lat: null,
      lon: null,
    };
    if (mode === "none") base.radius_km = null;
    onReplace(base);
  };

  const onLocate = (coords: LatLng) => {
    onChange({ lat: coords.lat, lon: coords.lon });
  };

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      {/* Search + ordering */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">Search</span>
          <Input
            type="search"
            placeholder="title or description"
            value={query.search ?? ""}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">Order by</span>
          <Select
            value={query.ordering ?? ""}
            onChange={(e) => onChange({ ordering: e.target.value || undefined })}
            disabled={proximityActive}
            title={
              proximityActive
                ? "Ordering is ignored while a proximity filter is active (results are nearest-first)"
                : undefined
            }
          >
            <option value="">default</option>
            {ORDERING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">
            City (exact venue.city)
          </span>
          <CityCombobox
            valueKey="name"
            value={query.city ?? ""}
            onChange={(city) => onChange({ city: city || undefined })}
            placeholder="e.g. Berlin"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">Organization</span>
          <Select
            value={query.organization_slug ?? ""}
            onChange={(e) =>
              onChange({
                organization_slug: e.target.value || undefined,
                organization: undefined,
              })
            }
          >
            <option value="">any</option>
            {(orgs?.results ?? []).map((o) => (
              <option key={o.id} value={o.slug}>
                {o.name}
              </option>
            ))}
          </Select>
        </label>
      </div>

      {/* Proximity */}
      <fieldset className="space-y-2 rounded-md border border-slate-200 p-3 dark:border-slate-800">
        <legend className="px-1 text-sm font-medium">
          Proximity{" "}
          <span className="font-normal text-slate-400">
            (online events excluded)
          </span>
        </legend>
        <div className="flex flex-wrap items-center gap-3">
          {(["none", "near_city", "coords"] as ProximityMode[]).map((m) => (
            <label key={m} className="flex items-center gap-1.5 text-sm">
              <input
                type="radio"
                name="proximity"
                checked={proximityMode === m}
                onChange={() => setProximityMode(m)}
              />
              {m === "none"
                ? "None"
                : m === "near_city"
                  ? "Near a city"
                  : "Near coordinates"}
            </label>
          ))}
        </div>

        {proximityMode === "near_city" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600 dark:text-slate-300">City</span>
              <CityCombobox
                valueKey="slug"
                value={query.near_city ?? ""}
                enabled={proximityMode === "near_city"}
                onChange={(slug) => onChange({ near_city: slug || null })}
                placeholder="select a city…"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                Radius (km) — blank = city default
              </span>
              <Input
                type="number"
                min={1}
                placeholder="default"
                value={query.radius_km ?? ""}
                onChange={(e) =>
                  onChange({
                    radius_km: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </label>
          </div>
        )}

        {proximityMode === "coords" && (
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600 dark:text-slate-300">Latitude</span>
              <Input
                type="number"
                step="any"
                placeholder="52.52"
                value={query.lat ?? ""}
                onChange={(e) =>
                  onChange({ lat: e.target.value ? Number(e.target.value) : null })
                }
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600 dark:text-slate-300">Longitude</span>
              <Input
                type="number"
                step="any"
                placeholder="13.405"
                value={query.lon ?? ""}
                onChange={(e) =>
                  onChange({ lon: e.target.value ? Number(e.target.value) : null })
                }
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                Radius (km)
              </span>
              <Input
                type="number"
                min={1}
                placeholder="10"
                value={query.radius_km ?? ""}
                onChange={(e) =>
                  onChange({
                    radius_km: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </label>
            <div className="sm:col-span-3">
              <UseMyLocation onLocate={onLocate} />
            </div>
          </div>
        )}
      </fieldset>

      {/* Classification + date range */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">Event type</span>
          <Select
            value={query.event_type ?? ""}
            onChange={(e) =>
              onChange({ event_type: (e.target.value || null) as EventsQuery["event_type"] })
            }
          >
            <option value="">any</option>
            {EVENT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">Attendance</span>
          <Select
            value={query.attendance_mode ?? ""}
            onChange={(e) =>
              onChange({
                attendance_mode: (e.target.value || null) as EventsQuery["attendance_mode"],
              })
            }
          >
            <option value="">any</option>
            {ATTENDANCE_MODE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">Starts after</span>
          <Input
            type="date"
            value={query.starts_at_after ?? ""}
            onChange={(e) => onChange({ starts_at_after: e.target.value || undefined })}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600 dark:text-slate-300">Starts before</span>
          <Input
            type="date"
            value={query.starts_at_before ?? ""}
            onChange={(e) => onChange({ starts_at_before: e.target.value || undefined })}
          />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Showing published events only (anonymous clients can't see drafts).
        </p>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}