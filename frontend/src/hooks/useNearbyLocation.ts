import { useCurrentLocation } from "./useCurrentLocation";
import { useGetLocationName } from "./useGetLocationName";
import { useEffect } from "react";

export const useNearbyLocation = (
  setForm: React.Dispatch<React.SetStateAction<any>>,
  enabled: boolean,
) => {
  const { coordinates } = useCurrentLocation();
  const { locationName } = useGetLocationName(coordinates);

  useEffect(() => {
    if (!enabled || !coordinates || !locationName) return;

    setForm((prev: any) => ({
      ...prev,
      location: `(${coordinates[0]},${coordinates[1]})`,
      location_name: locationName,
    }));
  }, [coordinates, locationName, enabled]);

  return { coordinates, locationName };
};
