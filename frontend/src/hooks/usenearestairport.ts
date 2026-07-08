'use client';

import { useState, useEffect } from 'react';

interface NearestAirport {
  code: string;
  city: string;
  country: string;
  name: string;
  lat: number;
  lon: number;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * IP-based fallback: approximate city by timezone offset
 */
function guessRegion(): { lat: number; lon: number } {
  const offset = -new Date().getTimezoneOffset();
  // Timezone-based rough location
  if (offset >= 330 && offset <= 390) return { lat: 16.87, lon: 96.2 }; // Yangon (MM +6:30)
  if (offset >= 420 && offset <= 480) return { lat: 13.75, lon: 100.5 }; // Bangkok (+7)
  if (offset === 480) return { lat: 1.35, lon: 103.8 }; // Singapore (+8)
  if (offset >= 510 && offset <= 570) return { lat: -33.87, lon: 151.2 }; // Sydney (+10)
  if (offset >= 300 && offset <= 330) return { lat: 19.08, lon: 72.88 }; // Mumbai (+5:30)
  if (offset === 540) return { lat: 35.68, lon: 139.76 }; // Tokyo (+9)
  if (offset === 60) return { lat: 51.51, lon: -0.13 }; // London (+1)
  if (offset === 120) return { lat: 48.86, lon: 2.35 }; // Paris (+2)
  return { lat: 16.87, lon: 96.2 }; // Default: Yangon
}

export function useNearestAirport(airports: NearestAirport[]) {
  const [nearest, setNearest] = useState<NearestAirport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!airports.length) return;

    const findNearest = (lat: number, lon: number) => {
      let best = airports[0];
      let bestDist = Infinity;
      for (const a of airports) {
        const dist = haversine(lat, lon, a.lat, a.lon);
        if (dist < bestDist) { bestDist = dist; best = a; }
      }
      setNearest(best);
      setLoading(false);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          findNearest(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Permission denied or error — use timezone fallback
          const fallback = guessRegion();
          findNearest(fallback.lat, fallback.lon);
        },
        { timeout: 5000, maximumAge: 300000 }
      );
    } else {
      const fallback = guessRegion();
      findNearest(fallback.lat, fallback.lon);
    }
  }, [airports]);

  return { nearest, loading, error };
}
