"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchMap from "./search";

import { useLocationSearch, LocationSuggestion, geocodeQuery } from "@/hooks/useReverseGeolocateSearch";

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

  const { suggestions, isSearching, retrieve } = useLocationSearch(query);

  const handleSelectVenue = async (suggestion: LocationSuggestion) => {
    const center = await retrieve(suggestion.mapbox_id);
    setSelectedVenue({ label: suggestion.label, center: center ?? undefined });
    setQuery("");
    if (center) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setForm((prev: any) => ({
        ...prev,
        location: `(${center[0]},${center[1]})`,
        location_name: suggestion.label,
      }));
    }
  };

  const handleUseAsTyped = async () => {
    const result = await geocodeQuery(query);
    const venue = { label: query, center: result?.center ?? undefined };
    setSelectedVenue(venue);
    if (result?.center) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setForm((prev: any) => ({
        ...prev,
        location: `(${result.center[0]},${result.center[1]})`,
        location_name: query,
      }));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setForm((prev: any) => ({ ...prev, location_name: query }));
    }
    setQuery("");
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
          className="rounded-xl border border-white/8 p-5 shadow-2xl shadow-black/20"
          style={{ background: `rgb(var(--bg-elevated))` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40 mb-2 font-medium"
              >
                Location
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm font-medium text-black/95 dark:text-white/95 mb-1"
              >
                {
                  (
                    selectedVenue as {
                      label: string;
                      center?: [number, number];
                    }
                  ).label?.split(",")[0]
                }
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-black/40 dark:text-white/40"
              >
                {(
                  selectedVenue as { label: string; center?: [number, number] }
                ).label
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
              className="text-xs text-black/60 dark:text-white/60 cursor-pointer hover:text-black/90 font-medium whitespace-nowrap ml-4 transition-colors duration-200"
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
        {(suggestions.length > 0 || query.length >= 2) && !isSearching && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-md border border-white/8 overflow-hidden shadow-2xl shadow-black/20 max-h-[40vh] overflow-y-auto"
            style={{ background: `rgb(var(--bg-elevated))` }}
          >
            {/* Use exactly what was typed */}
            <motion.button
              key="typed"
              whileHover={{ backgroundColor: "rgba(var(--fg), 0.03)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUseAsTyped}
              className="w-full px-5 py-3.5 text-left transition-colors cursor-pointer border-b border-white/8"
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] uppercase tracking-widest font-medium shrink-0"
                  style={{ color: "rgba(var(--fg),0.3)" }}
                >
                  Use
                </span>
                <span className="font-medium text-black/90 dark:text-white/90 text-sm truncate">
                  {query}
                </span>
              </div>
            </motion.button>

            {suggestions.map((venue, index) => (
              <motion.button
                key={venue.mapbox_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  backgroundColor: "rgba(var(--fg), 0.03)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectVenue(venue)}
                className="w-full px-5 py-3.5 text-left transition-colors cursor-pointer border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-black/90 dark:text-white/90 text-sm truncate">
                    {venue.label.split(",")[0]}
                  </span>
                  {venue.category && (
                    <span
                      className="shrink-0 text-[10px] text-black/35 dark:text-white/35 px-1.5 py-0.5 rounded-full capitalize"
                      style={{
                        background: "rgba(var(--fg),0.06)",
                        border: "1px solid rgba(var(--fg),0.08)",
                      }}
                    >
                      {venue.category}
                    </span>
                  )}
                </div>
                <div className="text-xs text-black/35 dark:text-white/35 truncate mt-0.5">
                  {venue.label.split(",").slice(1).join(",").trim()}
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
            className="text-center py-12 text-black/30 dark:text-white/30 text-xs"
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
            <p className="text-xs text-black/30 dark:text-white/30 mt-3">
              Searching...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
