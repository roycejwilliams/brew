"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchMap from "./search";

import { useLocationSearch } from "@/hooks/useReverseGeolocateSearch";

type MomentSelectionProp = "start" | "circle" | "people" | "nearby" | "confirm";

type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing?: number;
  pitch?: number;
};

interface VenueProp {
  viewport: MapViewport;
  selectedVenue: { label: string; center?: [number, number] } | null;
  setSelectedVenue: (
    selectedVenue: { label: string; center?: [number, number] } | null,
  ) => void;
  selectedModal: MomentSelectionProp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function Venue({
  selectedVenue,
  setSelectedVenue,
  selectedModal,
  setForm,
}: VenueProp) {
  const [query, setQuery] = useState(""); //query for search

  const { suggestions, isSearching } = useLocationSearch(query);

  const handleSelectVenue = (venue: {
    label: string;
    center?: [number, number];
  }) => {
    setSelectedVenue(venue);
    setQuery("");
    if (venue.center) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setForm((prev: any) => ({
        ...prev,
        location: `(${venue.center![0]},${venue.center![1]})`,
        location_name: venue.label,
      }));
    }
  };

  const handleChangeVenue = () => {
    setSelectedVenue(null);
    setQuery("");
  };

  // Collapsed state: venue selected
  if (selectedVenue) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Selected venue display */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1c1c1c] rounded-xl border border-white/8 p-5 shadow-2xl shadow-black/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-[10px] uppercase tracking-wider text-white/40 mb-2 font-medium"
              >
                Location
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm font-medium text-white/95 mb-1"
              >
                {(selectedVenue as { label: string; center?: [number, number] }).label?.split(",")[0]}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-white/40"
              >
                {(selectedVenue as { label: string; center?: [number, number] }).label
                  ?.split(",")
                  .slice(1)
                  .join(",")
                  .trim()}
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChangeVenue}
              className="text-xs text-white/60 cursor-pointer hover:text-white/90 font-medium whitespace-nowrap ml-4 transition-colors duration-200"
            >
              Change
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Expanded state: searching for venue
  return (
    <div className="space-y-4">
      {/* Search input using your SearchMap component */}
      <div className="rounded-md overflow-hidden border border-white/8 ">
        <SearchMap
          selectedModal={selectedModal}
          placeholder="Search for a venue"
          value={query}
          onChange={(e) => setQuery(e)}
          autoFocus={false}
        />
      </div>

      {/* Results list - rendered in parent */}
      <AnimatePresence mode="wait">
        {suggestions.length > 0 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#1c1c1c] rounded-md border border-white/8  overflow-hidden shadow-2xl shadow-black/20"
          >
            {suggestions.map((venue, index) => (
              <motion.button
                key={venue.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectVenue(venue)}
                className="w-full px-5 py-3.5 text-left transition-colors cursor-pointer border-b border-white/5 last:border-b-0"
              >
                <div className="font-medium text-white/90 text-sm">
                  {venue.label}
                </div>
                <div className="text-xs text-white/40">
                  {venue.center
                    ? `${venue.center[1].toFixed(4)}, ${venue.center[0].toFixed(4)}`
                    : ""}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {query.length >= 3 && suggestions.length === 0 && !isSearching && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-12 text-white/30 text-xs"
          >
            No venues found matching &quot;{query}&quot;
          </motion.div>
        )}

        {/* Searching indicator */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full mx-auto"
            />
            <p className="text-xs text-white/30 mt-3">Searching...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
