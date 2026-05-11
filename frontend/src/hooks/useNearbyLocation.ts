import { useCurrentLocation } from "./useCurrentLocation";
import { useGetLocationName } from "./useGetLocationName";
import { useEffect } from "react";

export const useNearbyLocation = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: React.Dispatch<React.SetStateAction<any>>,
  enabled: boolean,
) => {
  const { coordinates } = useCurrentLocation();
  const { locationName } = useGetLocationName(coordinates);

  useEffect(() => {
    if (!enabled || !coordinates || !locationName) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setForm((prev: any) => ({
      ...prev,
      location: `(${coordinates[0]},${coordinates[1]})`,
      location_name: locationName,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, locationName, enabled]);

  return { coordinates, locationName };
};
