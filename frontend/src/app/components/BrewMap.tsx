"use client";
import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Events from "./events";
import { AnimatePresence } from "motion/react";
import Notification from "./notification";
import CreateModalButtton from "./createModalButton";
import CreateModal from "./CreateModal";
import MobileNav from "./mobileNav";
import { useUserStore } from "@/stores/useUserStore";
import MapBoxGl from "./mapBoxGl";
import { useGetNearbyMoments, useGetAllMomentsUserIsAttendee } from "@/hooks/useMoments";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import useDebounce from "@/hooks/useDebounce";

type ScopeType = "here" | "nearby" | "area";
type TimeFilter = "tonight" | "tomorrow" | "week";

const SCOPE_TO_RADIUS: Record<ScopeType, number> = {
  here: 1000,
  nearby: 10000,
  area: 50000,
};

const MOBILE_BREAKPOINT = 820;

export default function BrewMap() {
  const [activeModal, setActiveModal] = useState<
    "createModal" | "notifications" | null
  >(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [filter, setFilter] = useState<TimeFilter>("tonight");
  const [activeScope, setActiveScope] = useState<ScopeType>("nearby");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { user } = useUserStore();
  const { coordinates } = useCurrentLocation();
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const debouncedMapCenter = useDebounce(mapCenter, 700);

  const activeCoords = selectedCoordinates ?? debouncedMapCenter ?? coordinates;

  const { data: nearbyData } = useGetNearbyMoments({
    lng: activeCoords?.[0],
    lat: activeCoords?.[1],
    radius: SCOPE_TO_RADIUS[activeScope],
    filter,
  });

  const nearbyMoments: MomentProp[] = nearbyData?.data?.data ?? [];

  const { data: attendeeData } = useGetAllMomentsUserIsAttendee(user?.id as string);
  const attendeeMoments: MomentProp[] = attendeeData?.data?.data ?? [];

  // Merge nearby + attendee moments, dedup by id, attendee moments preserve their visibility_type
  const allMapMoments = [
    ...nearbyMoments,
    ...attendeeMoments.filter((a) => !nearbyMoments.some((n) => n.id === a.id)),
  ];

  // Prevent hydration flash
  if (isMobile === null) return null;

  return (
    <>
      {/* Map layer */}
      <div className="w-full min-h-dvh relative flex overflow-hidden touch-none">
        <MapBoxGl
          zoom={selectedCoordinates ? 11 : 3.5}
          center={[-122.4194, 37.7749]}
          userCoordinates={selectedCoordinates ?? coordinates}
          dragPan={true}
          dragRotate={true}
          scrollZoom={true}
          moments={allMapMoments}
          onMove={(center) => {
            setMapCenter(center);
            setSelectedCoordinates(null); // user pan overrides scope selection
          }}
        />

        {/* Desktop create button — hidden on mobile */}
        {!isMobile && (
          <CreateModalButtton openModal={(type) => setActiveModal(type)} />
        )}

        {/* Events panel — desktop sidebar or mobile bottom sheet */}
        <Events
          id={user?.id as string}
          openModal={(type) => setActiveModal(type)}
          userCoordinates={coordinates}
          setSelectedCoordinates={setSelectedCoordinates}
          selectedCoordinates={selectedCoordinates}
          isMobile={isMobile}
          eventsOpen={eventsOpen}
          setEventsOpen={setEventsOpen}
          filter={filter}
          setFilter={setFilter}
          activeScope={activeScope}
          setActiveScope={setActiveScope}
          nearbyMoments={nearbyMoments}
        />
      </div>

      {/* Mobile bottom nav */}
      {isMobile && (
        <MobileNav
          user={user}
          onEventsPress={() => setEventsOpen((prev) => !prev)}
          onCreatePress={() => setActiveModal("createModal")}
          eventsOpen={eventsOpen}
        />
      )}

      {/* Modals */}
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
