import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

interface LocationSuggestion {
  label: string;
  center?: [number, number];
  category?: string;
}

export const reverseGeolocateSearch = async (
  query: string,
  setUserSuggestions: (suggestions: LocationSuggestion[]) => void,
  setIsSearching: (isSearching: boolean) => void,
) => {
  try {
    if (query.length < 2) {
      setUserSuggestions([]);
      return;
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        new URLSearchParams({
          access_token: `${process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN}`,
          limit: "8",
          types: "poi,place,address",
        }),
    );

    if (!response.ok) {
      throw new Error(`Http error! state: ${response.status}`);
    }

    const data = await response.json();

    const locationSearch = data.features.map((f: { place_name: string; center: [number, number]; properties?: { category?: string } }) => ({
      label: f.place_name,
      center: f.center as [number, number],
      category: f.properties?.category?.split(",")[0].trim() ?? undefined,
    }));

    setTimeout(() => {
      setUserSuggestions(locationSearch);
      setIsSearching(false);
    }, 300);
  } catch (error) {
    console.error("Error occured", error);
  } finally {
    setIsSearching(false);
  }
};

export const useLocationSearch = (query: string) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    reverseGeolocateSearch(debouncedQuery, setSuggestions, setIsSearching);
  }, [debouncedQuery]);

  return { suggestions, isSearching };
};
