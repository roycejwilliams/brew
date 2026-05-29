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
import { useUIStore } from "@/stores/store";
import MomentMiniModal from "./MomentMiniModal";
import MapBoxGl from "./mapBoxGl";
import {
  useGetNearbyMoments,
  useGetAllMomentsUserIsAttendee,
} from "@/hooks/useMoments";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import useDebounce from "@/hooks/useDebounce";

type ScopeType = "here" | "nearby" | "area";
type TimeFilter = "tonight" | "tomorrow" | "week";

const SCOPE_TO_RADIUS: Record<ScopeType, number> = {
  here: 1000,
  nearby: 10000,
  area: 50000,
};

// Derives query radius (metres) from Mapbox zoom level so markers load
// progressively: tighter radius when zoomed in, wider when zoomed out.
// Formula: 40_000_000 / 2^zoom, clamped to [500m, 100km].
const zoomToRadius = (zoom: number): number => {
  const raw = Math.round(40_000_000 / Math.pow(2, zoom));
  return Math.max(500, Math.min(100_000, raw));
};

const MOBILE_BREAKPOINT = 820;

export default function BrewMap() {
  const [activeModal, setActiveModal] = useState<
    "createModal" | "notifications" | null
  >(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<TimeFilter>("tonight");
  const [activeScope, setActiveScope] = useState<ScopeType>("nearby");
  const { setPulseOpen, eventsOpen, setEventsOpen } = useUIStore();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile === null) return;
    setPulseOpen(isMobile ? eventsOpen : true);
  }, [eventsOpen, setPulseOpen, isMobile]);

  const { user } = useUserStore();
  const { coordinates } = useCurrentLocation();
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [selectedZoom, setSelectedZoom] = useState(11);

  // Seed with the map's starting center so nearbyMoments fires on first render,
  // not after waiting for geolocation.
  const [mapCenter, setMapCenter] = useState<[number, number]>([-122.4194, 37.7749]);
  const debouncedMapCenter = useDebounce(mapCenter, 700);

  // Track zoom so radius scales with what the user actually sees.
  const [mapZoom, setMapZoom] = useState(5);
  const debouncedMapZoom = useDebounce(mapZoom, 700);

  // Once geolocation resolves, shift the query center to the user's actual location
  // so markers reflect their area, not the default center.
  useEffect(() => {
    if (coordinates && !selectedCoordinates) {
      setMapCenter(coordinates);
    }
  }, [coordinates, selectedCoordinates]);

  const activeCoords = selectedCoordinates ?? debouncedMapCenter ?? coordinates;

  const { data: nearbyData } = useGetNearbyMoments({
    lng: activeCoords?.[0],
    lat: activeCoords?.[1],
    radius: zoomToRadius(debouncedMapZoom),
    filter,
  });

  const nearbyMoments: MomentProp[] = nearbyData?.data?.data ?? [];

  const { data: attendeeData } = useGetAllMomentsUserIsAttendee(
    user?.id as string,
  );
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
      <div className="flex h-dvh w-full overflow-hidden">
        {/* LEFT — Pulse panel (desktop sidebar | mobile bottom sheet) */}
        <Events
          id={user?.id as string}
          openModal={(type) => setActiveModal(type)}
          userCoordinates={coordinates}
          setSelectedCoordinates={setSelectedCoordinates}
          setSelectedZoom={setSelectedZoom}
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

        {/* RIGHT — Map takes all remaining space */}
        <div className="flex-1 relative min-w-0 touch-none">
          <MapBoxGl
            zoom={selectedCoordinates ? selectedZoom : 5}
            center={(selectedCoordinates ?? coordinates ?? [-122.4194, 37.7749]) as [number, number]}
            userCoordinates={selectedCoordinates ?? coordinates}
            dragPan={true}
            dragRotate={true}
            scrollZoom={true}
            moments={allMapMoments}
            onMove={(center, zoom) => {
              setMapCenter(center);
              setMapZoom(zoom);
              setSelectedCoordinates(null);
            }}
          />
          {!isMobile && (
            <CreateModalButtton openModal={(type) => setActiveModal(type)} />
          )}
        </div>
      </div>

      {/* Mobile bottom nav — fixed, outside flex flow */}
      {isMobile && (
        <MobileNav
          onCreatePress={() => setActiveModal("createModal")}
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

      <MomentMiniModal />
    </>
  );
}
