import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import type { City } from "@/api/types";

export function CityCard({ city }: { city: City }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{city.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {city.country} · {city.country_code}
          </p>
        </div>
        {city.population != null && (
          <span className="text-xs text-slate-400">
            pop. {city.population.toLocaleString()}
          </span>
        )}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <dt className="text-slate-400">Default radius</dt>
        <dd>{city.default_radius_km} km</dd>
        <dt className="text-slate-400">Lat / Lon</dt>
        <dd className="font-mono text-xs">
          {city.latitude?.toFixed(3)}, {city.longitude?.toFixed(3)}
        </dd>
        <dt className="text-slate-400">Timezone</dt>
        <dd className="text-xs">{city.timezone}</dd>
      </dl>
      <Link
        to={`/events?near_city=${encodeURIComponent(city.slug)}`}
        className="mt-3 flex h-9 w-full items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Find events near {city.name} →
      </Link>
    </Card>
  );
}