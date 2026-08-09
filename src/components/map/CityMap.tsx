import type { MapContainerProps } from "react-leaflet";
import { MapView } from "./MapView";
import { CityMarkers } from "./CityMarkers";
import type { City } from "@/api/types";

/**
 * Self-contained map for a list of cities. Default export so it can be
 * `React.lazy`-loaded, deferring Leaflet until a map is shown.
 */
export default function CityMap({
  cities,
  radiusKm,
  ...props
}: { cities: City[]; radiusKm?: number } & MapContainerProps) {
  return (
    <MapView {...props}>
      <CityMarkers cities={cities} radiusKm={radiusKm} />
    </MapView>
  );
}