import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PinIcon, SendIcon } from "./icons";
import { Map } from "./map";

type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing?: number;
  pitch?: number;
};

interface ChooseAreaPanelProps {
  onAreaSelected: (center: [number, number], zoom: number) => void;
  onCancel: () => void;
  onLocation: () => Promise<void>;
  viewport: MapViewport;
  setViewport: (viewport: MapViewport) => void;
  place: string | null;
  selectedArea: { center: [number, number]; zoom: number } | null;
  onAreaCleared: () => void;
  isAreaConfirmed: boolean;
}

export default function ChooseAreaPanel({
  onAreaSelected,
  place,
  viewport,
  setViewport,
  selectedArea,
  onAreaCleared,
  isAreaConfirmed,
}: ChooseAreaPanelProps) {
  const handleConfirm = async () => {
    isAreaConfirmed;
    await new Promise((r) => setTimeout(r, 250));
    onAreaSelected(viewport.center, viewport.zoom);
    console.log(onAreaSelected);
  };

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4"
    >
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="px-1"
      >
        <p className="text-xs text-neutral-400">
          This moment will be visible nearby
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedArea === null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-70 rounded-xl overflow-hidden"
          >
            {/* Map Container */}

            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex min-w-2/3 max-w-full text-center justify-center items-center gap-x-4 absolute top-4 z-50 left-1/2 p-2 rounded-lg text-xs -translate-x-1/2 bg-neutral-800/95 backdrop-blur-sm text-neutral-200 border border-neutral-700 shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="w-6 h-6 rounded-full bg-white flex justify-center items-center shadow-sm"
              >
                <PinIcon size={20} className="text-neutral-400" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="font-medium"
              >
                Around • {place}
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-full w-full"
            >
              {/* Map */}
              <Map viewport={viewport} onViewportChange={setViewport} />
            </motion.div>
            {/* Center Marker with Pulsing Effect */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {/* Pulsing outer ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-24 h-24 rounded-full bg-blue-500/10"
              />

              {/* Static outer glow */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute w-20 h-20 rounded-full bg-blue-500/20 blur-xl"
              />

              {/* Main circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.25,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs shadow-lg border border-white/30 flex items-center justify-center"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Button */}
      <AnimatePresence mode="wait">
        {selectedArea !== null ? (
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
                  Around • {place}
                </motion.div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAreaCleared}
                className="text-xs text-white/60 cursor-pointer hover:text-white/90 font-medium whitespace-nowrap ml-4 transition-colors duration-200"
              >
                Change
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirm}
            disabled={isAreaConfirmed}
            className="group flex items-center gap-x-2 w-fit mt-2 cursor-pointer px-4 py-2 rounded-md text-sm font-medium bg-[#2b2b2b]/75 backdrop-blur-xl border border-white/20 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <AnimatePresence mode="wait">
              {isAreaConfirmed ? (
                <motion.div
                  key="confirming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-x-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Setting area...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-x-2"
                >
                  <span>Set area</span>
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 rounded-full bg-white/10 border border-white/20 rotate-45 flex justify-center items-center"
                  >
                    <SendIcon size={12} className="text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
