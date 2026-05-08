"use client";
import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Events from "./events";
import { AnimatePresence } from "motion/react";
import Notification from "./notification";
import CreateModalButtton from "./createModalButton";
import CreateModal from "./CreateModal";
import { useUserStore } from "@/stores/useUserStore";
import MapBoxGl from "./mapBoxGl";
import { useGetNearbyMoments } from "@/hooks/useMoments";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";

export default function BrewMap() {
  const [activeModal, setActiveModal] = useState<
    "createModal" | "notifications" | null
  >(null);

  //since the event id is a string this would be used to identify each event
  const { user } = useUserStore();
  const { coordinates } = useCurrentLocation();
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);

  const activeCoords = selectedCoordinates ?? coordinates;

  const { data: nearbyData } = useGetNearbyMoments({
    lng: activeCoords?.[0],
    lat: activeCoords?.[1],
    radius: 10000,
    filter: "tonight",
  });

  const nearbyMoments: MomentProp[] = nearbyData?.data?.data ?? [];

  return (
    <>
      {/* Map layer */}
      <div className="w-full h-screen relative flex">
        <MapBoxGl
          zoom={selectedCoordinates ? 11 : 3.5}
          center={[-122.4194, 37.7749]}
          userCoordinates={selectedCoordinates ?? coordinates}
          dragPan={true}
          dragRotate={true}
          scrollZoom={true}
          moments={nearbyMoments}
        />
        <CreateModalButtton openModal={(type) => setActiveModal(type)} />
        <Events
          id={user?.id as string}
          openModal={(type) => setActiveModal(type)}
          userCoordinates={coordinates}
          setSelectedCoordinates={setSelectedCoordinates}
          selectedCoordinates={selectedCoordinates}
        />
      </div>

      {/* Search overlay */}
      <AnimatePresence mode="popLayout">
        {activeModal === "createModal" && (
          <CreateModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "notifications" && (
          <Notification onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
