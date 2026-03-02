import { useState, useEffect } from "react";

interface GeoPosition {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Fallback to Tokyo Station
      setPosition({ lat: 35.6812, lng: 139.7671 });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setError(err.message);
        // Fallback
        setPosition({ lat: 35.6812, lng: 139.7671 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position, error };
}
