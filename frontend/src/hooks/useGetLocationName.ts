import { useState, useEffect } from "react";

export const useGetLocationName = (coordinates: [number, number] | null) => {
  const [locationName, setLocationName] = useState<string>();

  useEffect(() => {
    if (!coordinates) return;

    const getLocationName = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN}`,
        );
        const data = await response.json();
        console.log(
          "response",
          data.features.map((f: { place_type: string[]; place_name: string }) => ({
            type: f.place_type,
            name: f.place_name,
          })),
        );

        const address = data.features[0].place_name
          .split(",")
          .slice(0, -1)
          .join(",");
        setLocationName(address);
      } catch (error) {
        console.error("Error getting location", error);
      }
    };
    getLocationName();
  }, [coordinates]);

  return { locationName };
};

export const useGetCityName = (coordinates: [number, number] | null) => {
  const [cityName, setCityName] = useState<string>();

  useEffect(() => {
    if (!coordinates) return;

    const getCityName = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN}`,
        );
        const data = await response.json();
        const cityFeature = data.features.find((f: { place_type: string[]; place_name: string }) =>
          f.place_type?.includes("place"),
        );
        setCityName(cityFeature?.place_name ?? data.features[2]?.place_name);
      } catch (error) {
        console.error("Error getting city name", error);
      }
    };
    getCityName();
  }, [coordinates]);

  return { cityName };
};
