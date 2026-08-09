import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import type { City } from "@/api/types";

// A plain coloured pin (avoid bundling leaflet's default image assets).
const cityIcon = L.divIcon({
  className: "",
  html: `<span style="font-size:22px;line-height:1">📍</span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

interface CityMarkersProps {
  cities: City[];
  radiusKm?: number;
}

export function CityMarkers({ cities, radiusKm }: CityMarkersProps) {
  return (
    <>
      {cities
        .filter((c) => c.latitude != null && c.longitude != null)
        .map((c) => (
          <Marker
            key={c.id}
            position={[c.latitude as number, c.longitude as number]}
            icon={cityIcon}
          >
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {c.country} · pop. {c.population?.toLocaleString() ?? "—"}
              <br />
              default radius {c.default_radius_km} km
              <br />
              <Link
                to={`/events?near_city=${encodeURIComponent(c.slug)}${
                  radiusKm ? `&radius_km=${radiusKm}` : ""
                }`}
              >
                Find events near {c.name} →
              </Link>
            </Popup>
          </Marker>
        ))}
    </>
  );
}