import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import type { Event } from "@/api/types";
import { formatEventDate } from "@/lib/formatters";
import { formatDistance } from "@/lib/geo";

// Online events are excluded from proximity on the backend, but the map shows
// any event that carries a location.
const eventIcon = L.divIcon({
  className: "",
  html: `<span style="font-size:20px;line-height:1">🟠</span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function EventMarkers({ events }: { events: Event[] }) {
  return (
    <>
      {events
        .filter((e) => e.latitude != null && e.longitude != null)
        .map((e) => (
          <Marker
            key={e.id}
            position={[e.latitude as number, e.longitude as number]}
            icon={eventIcon}
          >
            <Popup>
              <strong>{e.title}</strong>
              <br />
              {formatEventDate(e.starts_at)}
              {e.distance != null && (
                <>
                  <br />
                  {formatDistance(e.distance)} away
                </>
              )}
              {e.venue && (
                <>
                  <br />
                  {e.venue.name}, {e.venue.city}
                </>
              )}
              <br />
              <Link to={`/events/${e.id}`}>View details →</Link>
            </Popup>
          </Marker>
        ))}
    </>
  );
}