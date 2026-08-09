import { MapContainer, TileLayer, type MapContainerProps } from "react-leaflet";
import { MAP_TILES_URL, MAP_TILES_ATTRIBUTION } from "@/config/constants";

/** A Leaflet map wrapper with OSM tiles + required attribution. */
export function MapView({
  children,
  ...props
}: MapContainerProps & { children?: React.ReactNode }) {
  return (
    <MapContainer
      scrollWheelZoom
      className="h-full min-h-[320px] w-full rounded-lg border border-slate-200 dark:border-slate-800"
      {...props}
    >
      <TileLayer url={MAP_TILES_URL} attribution={MAP_TILES_ATTRIBUTION} />
      {children}
    </MapContainer>
  );
}