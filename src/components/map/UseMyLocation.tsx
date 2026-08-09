import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentPosition, type LatLng } from "@/lib/geo";

interface UseMyLocationProps {
  onLocate: (coords: LatLng) => void;
}

/** "Use my location" geolocation button. Requires a secure origin (https or
 * localhost); on plain HTTP it reports a clear error. */
export function UseMyLocation({ onLocate }: UseMyLocationProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError(null);
    setLoading(true);
    try {
      const coords = await getCurrentPosition();
      onLocate(coords);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Geolocation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handle}
        disabled={loading}
      >
        {loading ? "Locating…" : "📍 Use my location"}
      </Button>
      {error && (
        <p className="text-xs text-amber-600 dark:text-amber-400">{error}</p>
      )}
    </div>
  );
}