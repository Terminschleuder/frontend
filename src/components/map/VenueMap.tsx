import { Marker, Popup, type MapContainerProps } from "react-leaflet";
import L from "leaflet";
import { MapView } from "./MapView";
import type { Venue } from "@/api/types";

const venueIcon = L.divIcon({
  className: "",
  html: `<span style="font-size:20px;line-height:1">🏢</span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/**
 * Self-contained map for a list of venues. Default export so it can be
 * `React.lazy`-loaded, deferring Leaflet until a map is shown.
 */
export default function VenueMap({
  venues,
  ...props
}: { venues: Venue[] } & MapContainerProps) {
  return (
    <MapView {...props}>
      {venues
        .filter((v) => v.latitude != null && v.longitude != null)
        .map((v) => (
          <Marker
            key={v.id}
            position={[v.latitude as number, v.longitude as number]}
            icon={venueIcon}
          >
            <Popup>
              <strong>{v.name}</strong>
              <br />
              {v.city}
            </Popup>
          </Marker>
        ))}
    </MapView>
  );
}