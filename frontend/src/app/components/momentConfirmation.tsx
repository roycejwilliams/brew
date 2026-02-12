import { motion } from "motion/react";
import React, { useState, DragEvent, ChangeEvent, useEffect } from "react";
import LocationSelector from "./locationSelector";
import ChooseAreaPanel from "./chooseAreaPanel";
import NearYou from "./nearYou";
import Venue from "./Venue";
import ImageDrop from "./imageDrop";
import { error } from "console";

type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing?: number;
  pitch?: number;
};

interface VenueResult {
  id: string;
  name: string;
  category: string[];
  location: string;
  coordinates: { lat: number; lng: number };
}

type LocationIntent = "near" | "area" | "venue";

export default function MomentConfirmation() {
  //Selects the Location Intent
  const [selectedLocation, setSelectedLocation] =
    useState<LocationIntent>("near");

  //Gets the selected area chosen
  const [selectedArea, setSelectedArea] = useState<{
    center: [number, number];
    zoom: number;
  } | null>(null);

  //provides the coordinates from your current position
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  //Street level address from user's GPS coordinates
  const [near, setNear] = useState<string | null>(null);
  //Broader city/region derived from the map center
  const [aroundLocation, setAroundLocation] = useState<string | null>(null);
  //Exactly pinpoint venue, provides address as well from search
  const [venue, setVenue] = useState<VenueResult | null>(null);
  //For exact positioning and repositioning  when using the choose nearby
  const [viewport, setViewport] = useState<MapViewport | null>(null);
  //loading stay when choosing the surrounding area
  const [isConfirming, setIsConfirming] = useState(false);
  //Description modal that pops up after selections are made
  const [description, setDescription] = useState<string | null>("");
  //Checks to see if the user has stop typing - allows button to show when false;
  const [isTyping, setIsTyping] = useState<boolean>(false);

  //gets user's geolocated current position
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        //always gets the current position
        setCoordinates(coords);

        // initialize viewport ONLY here
        setViewport({
          center: coords,
          zoom: 11,
          bearing: 0,
          pitch: 0,
        });
      },
      (error) => {
        console.warn("Geolocation failed:", error);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  console.log("selected area", selectedArea);
  console.log("selected venue", venue);

  //public access token needed to run this
  const publicAccessToken = process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN;

  //Get location Name from reverse geolocation
  const getLocationName = async (coordinates: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${publicAccessToken}`,
      );

      if (!response.ok) {
        throw new Error(`Http error! state: ${response.status}`);
      }

      const data = await response.json();

      const cityPlace = data.features[1].place_name;
      const addressPlace = data.features[0].place_name;

      const city = cityPlace.split(",").slice(0, -1).join(",");
      const address = addressPlace.split(",").slice(0, -1).join(",");

      setNear(address);
      setAroundLocation(city);
    } catch (error) {
      console.error("Error Getting location", error);
    }
  };

  //when you change the area setSelectedArea
  //and loading state are null & false
  const handleChangeArea = () => {
    setSelectedArea(null);
    setIsConfirming(false);
  };

  //Changing location intent
  const locationChange = (location: LocationIntent) => {
    setSelectedLocation(location);

    if (location !== "area" && coordinates) {
      // Reset map position
      setViewport({
        center: coordinates,
        zoom: 11,
        bearing: 0,
        pitch: 0,
      });

      getLocationName(coordinates);
      handleChangeArea();
    }

    if (location !== "venue" && venue) {
      setVenue(null);
    }
  };

  //if requirements are set then it shows a modal
  const isLocationSet =
    (selectedLocation === "near" && near != null) ||
    (selectedLocation === "area" && selectedArea != null) ||
    (selectedLocation === "venue" && venue != null);

  //Gets the location name everytime the viewport changes
  useEffect(() => {
    if (!viewport) return;
    getLocationName(viewport.center);
  }, [viewport?.center, viewport?.zoom]);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 500);

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [isTyping]);

  if (viewport === null) {
    // handle missing viewport
    return;
  }

  return (
    <div className=" text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Upload Area */}
        <ImageDrop />
        {/* Right: Filters */}
        <div className="flex flex-col justify-start gap-4 h-full">
          {/* Location */}
          <div>
            <LocationSelector
              selectedLocation={selectedLocation}
              onLocationChange={locationChange}
            />
            <div className="mt-4">
              {selectedLocation === "near" && <NearYou place={near} />}
              {selectedLocation === "area" && (
                <ChooseAreaPanel
                  onAreaSelected={(center, zoom) => {
                    setSelectedArea({ center, zoom });
                  }}
                  onLocation={() => getLocationName(coordinates!)}
                  viewport={viewport}
                  isAreaConfirmed={isConfirming}
                  onAreaCleared={handleChangeArea}
                  selectedArea={selectedArea}
                  setViewport={setViewport}
                  place={aroundLocation}
                  onCancel={() => {
                    setSelectedLocation("area");
                  }}
                />
              )}{" "}
              {selectedLocation === "venue" && (
                <Venue
                  viewport={viewport.center}
                  selectedVenue={venue}
                  setSelectedVenue={setVenue}
                />
              )}
            </div>
          </div>

          {/* Description */}
          {isLocationSet && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full bg-[#1c1c1c] backdrop-blur-xl border border-white/8 rounded-xl shadow-2xl shadow-black/20 overflow-hidden mt-auto">
                <textarea
                  rows={5}
                  maxLength={300}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsTyping(
                      description!.length > 0 || description!.length === 0,
                    );
                  }}
                  placeholder="Set the vibe..."
                  className="w-full bg-transparent text-white/90 text-sm placeholder:text-white/30 resize-none px-5 pt-4 pb-10 focus:outline-none"
                />
                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-2.5 flex justify-between items-center border-t border-white/6">
                  <span className="text-[10px] uppercase tracking-wider text-white/20 font-medium">
                    Description
                  </span>
                  <span className="text-[10px] text-white/25 tabular-nums">
                    {description?.length}/300
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {!isTyping && isLocationSet && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-fit mt-auto px-5 py-2.5 rounded-md text-sm font-medium text-white/90 bg-[#1c1c1c] backdrop-blur-xl border border-white/8 shadow-2xl shadow-black/20 cursor-pointer"
            >
              <span>Generate Moment</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
