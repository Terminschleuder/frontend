import type { MapContainerProps } from "react-leaflet";
import { MapView } from "./MapView";
import { EventMarkers } from "./EventMarkers";
import type { Event } from "@/api/types";

/**
 * Self-contained map for a list of events. Default export so it can be
 * `React.lazy`-loaded — this keeps all of Leaflet out of the initial bundle
 * until a map is actually shown.
 */
export default function EventMap({
  events,
  ...props
}: { events: Event[] } & MapContainerProps) {
  return (
    <MapView {...props}>
      <EventMarkers events={events} />
    </MapView>
  );
}