"use client";
import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Nav from "./nav";
import Search from "./search";
import Events from "./events";
import { AnimatePresence } from "motion/react";
import Filter from "./filter";
import QRCode from "./qrCode";
import Notification from "./notification";

export default function BrewMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [center, setCenter] = useState<LngLatLike>([-122.42285, 37.73393]);
  const [zoom, setZoom] = useState<number>(10.21);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapContainerRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      bearing: 0,
      pitch: 0,
      style: "mapbox://styles/mapbox/dark-v11",
    });

    mapRef.current.on("move", () => {
      if (!mapRef.current) return;

      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      // update state
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  const [activeModal, setActiveModal] = useState<
    "filter" | "qr" | "notifications" | null
  >(null);

  return (
    <>
      {/* Map layer */}
      <div ref={mapContainerRef} className="absolute w-full h-full inset-0">
        <Events openModal={(type) => setActiveModal(type)} />
      </div>

      {/* Search overlay */}
      <Search openModal={(type) => setActiveModal(type)} />
      <AnimatePresence mode="popLayout">
        {activeModal === "filter" && (
          <Filter onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "qr" && (
          <QRCode onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "notifications" && (
          <Notification onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
