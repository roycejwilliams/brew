"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import SearchMap from "./search";
import { useLocationSearch } from "@/hooks/useReverseGeolocateSearch";

type ScopeType = "here" | "nearby" | "area";
type TimeFilter = "tonight" | "tomorrow" | "week";

interface FilterProps {
  onClose: () => void;
  selectedLocation: string | null;
  setSelectedLocation: (selectedLocation: string | null) => void;
  setSelectedCoordinates: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
  userCoordinates?: [number, number] | null;
  filter: TimeFilter;
  setFilter: (filter: TimeFilter) => void;
  activeScope: ScopeType;
  setActiveScope: React.Dispatch<React.SetStateAction<ScopeType>>;
}

const LOOK_AROUND = [
  { value: "here", label: "Here", radius: 1000 },
  { value: "nearby", label: "Nearby", radius: 10000 },
  { value: "area", label: "Area", radius: 50000 },
];

const TIME_FILTERS = [
  { value: "tonight", label: "Tonight" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
];

function ScopeLocator({
  onClose,
  setSelectedCoordinates,
  selectedLocation,
  setSelectedLocation,
  setActiveScope,
  activeScope,
  filter,
  setFilter,
}: FilterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideAlerter(ref, onClose);

  const [query, setQuery] = useState("");
  const { suggestions } = useLocationSearch(query);

  const showResults = query.length >= 2 && suggestions.length > 0;

  const handleSelectLocation = (label: string, center?: [number, number]) => {
    setSelectedLocation(label);
    if (center) {
      setSelectedCoordinates(center);
    }
    setQuery("");
  };

  const handleReset = () => {
    setActiveScope("nearby");
    setFilter("tonight");
    setSelectedLocation(null);
    setSelectedCoordinates(null);
    setQuery("");
  };

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded-md text-[11px] cursor-pointer transition-all duration-200 tracking-[-0.1px] ${
      active ? "text-white/90" : "text-white/35 hover:text-white/60"
    }`;

  const chipStyle = (active: boolean) => ({
    background: active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
    border: active
      ? "1px solid rgba(255,255,255,0.18)"
      : "1px solid rgba(255,255,255,0.06)",
  });

  const isDefault =
    activeScope === "nearby" &&
    filter === "tonight" &&
    selectedLocation === null;

  return (
    <motion.div
      layout
      ref={ref}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="mx-auto relative mt-3 rounded-xl overflow-hidden"
      style={{
        background: "rgba(14,14,14,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <SearchMap
        value={query}
        onChange={(e) => setQuery(e)}
        autoFocus={false}
        placeholder="Search a location..."
      />

      <AnimatePresence mode="wait">
        {showResults ? (
          <motion.ul
            key="results"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="py-1"
          >
            {suggestions.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
              >
                <button
                  onClick={() => handleSelectLocation(s.label, s.center)}
                  className="w-full text-left px-4 py-2.5 transition-all cursor-pointer hover:bg-white/4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60 hover:text-white/90 tracking-[-0.1px] truncate">
                      {s.label.split(",")[0]}
                    </span>
                    {s.category && (
                      <span className="shrink-0 text-[10px] text-white/30 px-1.5 py-0.5 rounded-full capitalize"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        {s.category}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/25 tracking-[-0.1px] truncate mt-0.5">
                    {s.label.split(",").slice(1).join(",").trim()}
                  </p>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            key="filters"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 py-4 space-y-5"
          >
            {/* Look around */}
            <div className="space-y-2.5">
              <p className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium">
                Look around
              </p>
              <div className="flex flex-wrap gap-2">
                {LOOK_AROUND.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveScope(opt.value as ScopeType)}
                    className={chipClass(activeScope === opt.value)}
                    style={chipStyle(activeScope === opt.value)}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

            {/* Time */}
            <div className="space-y-2.5">
              <p className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium">
                Time
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_FILTERS.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setFilter(opt.value as TimeFilter)}
                    className={chipClass(filter === opt.value)}
                    style={chipStyle(filter === opt.value)}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

            {/* Summary + Reset */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-white/25 tracking-[-0.1px] leading-relaxed">
                Showing{" "}
                <span className="text-white/50">
                  {LOOK_AROUND.find(
                    (o) => o.value === activeScope,
                  )?.label.toLowerCase() ?? "nearby"}
                </span>{" "}
                moments around{" "}
                <span className="text-white/50">
                  {selectedLocation ?? "your location"}
                </span>{" "}
                —{" "}
                <span className="text-white/50">
                  {TIME_FILTERS.find(
                    (o) => o.value === filter,
                  )?.label.toLowerCase()}
                </span>
              </p>

              <AnimatePresence>
                {!isDefault && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="text-[10px] text-white/25 hover:text-white/60 tracking-[-0.1px] cursor-pointer transition-colors shrink-0 px-2 py-1 rounded-md"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    Reset
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ScopeLocator;
