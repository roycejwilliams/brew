"use client";
import { useState } from "react";
// import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Events from "./events";
import { AnimatePresence } from "motion/react";
import Notification from "./notification";
// import MapBoxGl from "./mapBoxGl";
import { Map, MapControls } from "./map";
import CreateModalButtton from "./createModalButton";
import CreateModal from "./CreateModal";
// import { ScrollLock } from "../utils/scrollLock";

export default function BrewMap() {
  // const mapRef = useRef<mapboxgl.Map | null>(null);
  // const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // const [center, setCenter] = useState<LngLatLike>([-122.42285, 37.73393]);
  // const [zoom, setZoom] = useState<number>(10.21);

  // useEffect(() => {
  //   mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  //   if (!mapContainerRef.current) return;
  //   mapRef.current = new mapboxgl.Map({
  //     container: mapContainerRef.current,
  //     center: center,
  //     zoom: zoom,
  //     bearing: 0,
  //     pitch: 0,
  //     style: "mapbox://styles/mapbox/dark-v11",
  //   });

  //   mapRef.current.on("move", () => {
  //     if (!mapRef.current) return;

  //     // get the current center coordinates and zoom level from the map
  //     const mapCenter = mapRef.current.getCenter();
  //     const mapZoom = mapRef.current.getZoom();

  //     // update state
  //     setCenter([mapCenter.lng, mapCenter.lat]);
  //     setZoom(mapZoom);
  //   });

  //   return () => {
  //     mapRef.current?.remove();
  //   };
  // }, []);

  const [activeModal, setActiveModal] = useState<
    "createModal" | "notifications" | null
  >(null);

  const [id, setId] = useState<string>("");
  //since the event id is a string this would be used to identify each event

  return (
    <>
      {/* Map layer */}
      <div className="w-full h-screen relative flex">
        <Map center={[-122.42285, 37.73393]} zoom={10} />
        <CreateModalButtton openModal={(type) => setActiveModal(type)} />
        <Events id={id} openModal={(type) => setActiveModal(type)} />
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
