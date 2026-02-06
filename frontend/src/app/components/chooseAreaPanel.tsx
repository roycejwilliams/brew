import React, { useEffect, useState } from "react";
import { PinIcon, SendIcon } from "./icons";
import { Map } from "./map";

interface ChooseAreaPanelProps {
  onAreaSelected: (center: [number, number], zoom: number) => void;
  onCancel: () => void;
}

type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing?: number;
  pitch?: number;
};

export default function ChooseAreaPanel({
  onAreaSelected,
}: ChooseAreaPanelProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-122.4194, 37.7749],
    zoom: 11,
    bearing: 0,
    pitch: 0,
  });
  const [place, setPlace] = useState<string | null>(null);

  console.log("longitude:", viewport.center[0], "latitude", viewport.center[1]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    await new Promise((r) => setTimeout(r, 250));
    onAreaSelected(viewport.center, viewport.zoom);
  };

  const publicAccessToken =
    "pk.eyJ1Ijoicm95Y3dpbGxpYW1zIiwiYSI6ImNtZ3hhejZsZzBnZXkyanExd2wwd3R0cHcifQ.qXmsrp_9IonlU3r793QRig";

  const getLocationName = async () => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${viewport.center[0]},${viewport.center[1]}.json?access_token=${publicAccessToken}`,
    );

    if (!response.ok) {
      throw new Error(`Http error! state: ${response.status}`);
    }

    const data = await response.json();

    console.log("response", data);

    const cityPlace = data.features[1].place_name;

    const city = cityPlace.split(",").slice(0, -1).join(",");
    setPlace(city);
  };

  useEffect(() => {
    getLocationName();
  });

  return (
    <section className="flex flex-col gap-4 ">
      {/* Instructions */}
      <div className="px-1">
        <p className="text-xs text-neutral-400">
          This moment will be visible nearby
        </p>
      </div>

      {/* Map Container */}
      <div className="relative h-70  rounded-xl overflow-hidden">
        {/* Location Badge */}
        <div className="flex min-w-3/5 max-w-full text-center justify-center items-center gap-x-2 absolute top-4 z-50 left-1/2 px-4 py-2 rounded-lg text-xs -translate-x-1/2 bg-neutral-800/95 backdrop-blur-sm text-neutral-200 border border-neutral-700 shadow-lg">
          <div className="w-6 h-6 rounded-full bg-white flex justify-center items-center shadow-sm">
            <PinIcon size={20} className="text-neutral-400" />
          </div>
          <span className="font-medium flex-1">Around • {place}</span>
        </div>

        {/* Map */}
        <div className="absolute h-full w-full">
          <Map viewport={viewport} onViewportChange={setViewport} />{" "}
        </div>

        {/* Center Marker with Pulsing Effect */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Pulsing outer ring */}
          <div className="absolute w-24 h-24 rounded-full bg-blue-500/10 animate-ping duration-1400 ease-in-out" />

          {/* Static outer glow */}
          <div className="absolute w-20 h-20 rounded-full bg-blue-500/20 blur-xl" />

          {/* Main circle */}
          <div className="relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs shadow-lg border border-white/30 flex items-center justify-center"></div>
        </div>
      </div>
      <button
        onClick={handleConfirm}
        disabled={isConfirming}
        className="group flex items-center gap-x-2 w-fit mt-2 cursor-pointer px-4 py-2 rounded-md text-sm font-medium bg-[#2b2b2b]/75 backdrop-blur-xl border border-white/20 text-white shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isConfirming ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Setting area...</span>
          </>
        ) : (
          <>
            <span>Set area</span>
            <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 rotate-45 flex justify-center items-center transition-all group-hover:rotate-90">
              <SendIcon size={12} className="text-white" />
            </div>
          </>
        )}
      </button>
    </section>
  );
}
