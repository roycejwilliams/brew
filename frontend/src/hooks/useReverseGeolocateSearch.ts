import { useEffect, useState, useRef, useCallback } from "react";
import useDebounce from "./useDebounce";

export interface LocationSuggestion {
  label: string;
  mapbox_id: string;
  category?: string;
  feature_type?: string;
}

export function zoomForFeatureType(feature_type?: string): number {
  switch (feature_type) {
    case "poi":
    case "address":      return 15;
    case "street":       return 15;
    case "neighborhood":
    case "locality":     return 13;
    case "place":        return 11;
    default:             return 13;
  }
}

const TOKEN = () => process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN!;
const SUGGEST_URL = "https://api.mapbox.com/search/searchbox/v1/suggest";
const RETRIEVE_URL = "https://api.mapbox.com/search/searchbox/v1/retrieve";

function newSession(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function retrieveCenter(
  mapbox_id: string,
  session_token: string,
): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `${RETRIEVE_URL}/${mapbox_id}?access_token=${TOKEN()}&session_token=${session_token}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const coords = data.features?.[0]?.geometry?.coordinates as
      | [number, number]
      | undefined;
    return coords ?? null;
  } catch {
    return null;
  }
}

/** One-shot geocode for programmatic use (e.g. EditMoment saving). */
export async function geocodeQuery(
  query: string,
  coords?: [number, number],
): Promise<{ label: string; center: [number, number] } | null> {
  const session = newSession();
  const params = new URLSearchParams({
    q: query,
    access_token: TOKEN(),
    session_token: session,
    limit: "1",
    types: "poi,address,place",
  });
  if (coords) params.set("proximity", `${coords[0]},${coords[1]}`);
  try {
    const res = await fetch(`${SUGGEST_URL}?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const first = data.suggestions?.[0];
    if (!first) return null;
    const center = await retrieveCenter(first.mapbox_id, session);
    if (!center) return null;
    return { label: first.full_address ?? first.name, center };
  } catch {
    return null;
  }
}

export const useLocationSearch = (
  query: string,
  coords?: [number, number] | null,
) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const sessionToken = useRef(newSession());

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!query) {
      sessionToken.current = newSession();
      setSuggestions([]);
      setIsSearching(false);
    }
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);

    const params = new URLSearchParams({
      q: debouncedQuery,
      access_token: TOKEN(),
      session_token: sessionToken.current,
      language: "en",
      limit: "8",
      types: "poi,address,place,neighborhood,locality",
    });
    if (coords) params.set("proximity", `${coords[0]},${coords[1]}`);

    fetch(`${SUGGEST_URL}?${params}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setSuggestions(
          (data.suggestions ?? []).map(
            (s: {
              name: string;
              full_address?: string;
              mapbox_id: string;
              feature_type?: string;
              poi_category?: string[];
              context?: { place?: { name: string } };
            }) => ({
              label: `${s.name}${s.full_address ? `, ${s.full_address}` : s.context?.place?.name ? `, ${s.context.place.name}` : ""}`,
              mapbox_id: s.mapbox_id,
              feature_type: s.feature_type,
              category: s.poi_category?.[0] ?? undefined,
            }),
          ),
        );
        setIsSearching(false);
      })
      .catch(() => setIsSearching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const retrieve = useCallback(
    (mapbox_id: string) => retrieveCenter(mapbox_id, sessionToken.current),
    [],
  );

  return { suggestions, isSearching, retrieve };
};
