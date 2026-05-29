import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { openEventCard } from "@/stores/store";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";

const MAP_STYLE_DARK  = "mapbox://styles/mapbox/dark-v11";
const MAP_STYLE_LIGHT = "mapbox://styles/roycwilliams/cmh2r2dac003j01rfhgc38cft";

interface MapBoxProp {
  zoom: number;
  center: LngLatLike;
  onMove?: (center: [number, number], zoom: number) => void;
  userCoordinates?: [number, number] | null;
  scrollZoom?: boolean;
  dragPan?: boolean;
  dragRotate?: boolean;
  moments?: MomentProp[];
}

function MapBoxGl({
  zoom,
  center,
  onMove,
  userCoordinates,
  scrollZoom,
  dragPan,
  dragRotate,
  moments,
}: MapBoxProp) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const selectedMarkerRef = useRef<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const openCard = openEventCard((state) => state.openEvent);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN!;
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      bearing: 0,
      scrollZoom: scrollZoom,
      dragPan: dragPan,
      dragRotate: dragRotate,
      pitch: 0,
      style: theme === "dark" ? MAP_STYLE_DARK : MAP_STYLE_LIGHT,
    });

    mapRef.current.on("load", () => {
      mapRef.current?.resize();
      setMapReady(true);
    });

    mapRef.current.on("move", (e) => {
      if (!mapRef.current || !onMove) return;
      // Skip programmatic moves (flyTo, fitBounds, etc.) — only respond to user gestures
      if (!(e as unknown as { originalEvent?: Event }).originalEvent) return;
      const c = mapRef.current.getCenter();
      const z = mapRef.current.getZoom();
      onMove([c.lng, c.lat], z);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      mapRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    mapRef.current.setStyle(
      theme === "dark" ? MAP_STYLE_DARK : MAP_STYLE_LIGHT,
    );
  }, [theme, mapReady]);

  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!moments?.length) return;

    moments.forEach((moment) => {
      const lng = (moment.location as unknown as { x: number; y: number })?.x;
      const lat = (moment.location as unknown as { x: number; y: number })?.y;
      if (lng == null || lat == null) return;

      const borderColor =
        moment.visibility_type === "circle"
          ? "rgba(251,191,36,0.5)"
          : moment.visibility_type === "people"
            ? "rgba(99,102,241,0.6)"
            : "rgba(var(--fg),0.25)";

      const hoverBorderColor =
        moment.visibility_type === "circle"
          ? "rgba(251,191,36,0.9)"
          : moment.visibility_type === "people"
            ? "rgba(99,102,241,1)"
            : "rgba(var(--fg),0.5)";

      const selectedBorderColor =
        moment.visibility_type === "circle"
          ? "rgba(251,191,36,1)"
          : moment.visibility_type === "people"
            ? "rgba(129,140,248,1)"
            : "rgba(var(--fg),0.8)";

      // Wrapper — stable 44px hit target
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      `;

      // Inner circle — visual only, pointer-events off
      const inner = document.createElement("div");
      inner.style.cssText = `
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(var(--bg),0.9);
        border: 1.5px solid ${borderColor};
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        overflow: hidden;
        transition: transform 0.2s ease, border-color 0.2s ease;
        transform-origin: center center;
        will-change: transform;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      if (moment.image) {
        const img = document.createElement("img");
        img.src = moment.image;
        img.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          filter: brightness(0.75);
        `;
        inner.appendChild(img);
      } else {
        const dot = document.createElement("div");
        dot.style.cssText = `
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(var(--fg),0.6);
        `;
        inner.appendChild(dot);
      }

      wrapper.appendChild(inner);

      // Hover
      wrapper.addEventListener("mouseenter", () => {
        inner.style.transform = "scale(1.1)";
        inner.style.borderColor = hoverBorderColor;
      });

      wrapper.addEventListener("mouseleave", () => {
        if (selectedMarkerRef.current !== moment.id) {
          inner.style.transform = "scale(1)";
          inner.style.borderColor = borderColor;
        }
      });

      // Two-step click: first zoom in, second open event
      wrapper.addEventListener("click", () => {
        const map = mapRef.current;
        if (!map) return;

        const currentZoom = map.getZoom();

        if (selectedMarkerRef.current !== moment.id || currentZoom < 13) {
          selectedMarkerRef.current = moment.id as string;
          inner.style.transform = "scale(1.2)";
          inner.style.borderColor = selectedBorderColor;
          map.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 800,
            essential: true,
          });
        } else {
          openCard(moment);
          router.push(`/moments/${moment.id}`, { scroll: false });
          selectedMarkerRef.current = null;
        }
      });

      const marker = new mapboxgl.Marker({ element: wrapper })
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, moments]);

  useEffect(() => {
    if (!userCoordinates || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [userCoordinates[0], userCoordinates[1]],
      zoom: zoom,
      duration: 2000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCoordinates]);

  return (
    <motion.div
      ref={mapContainerRef}
      className="absolute w-full h-full brightness-85 contrast-110"
      initial={{ opacity: 0 }}
      animate={{ opacity: mapReady ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

export default MapBoxGl;
