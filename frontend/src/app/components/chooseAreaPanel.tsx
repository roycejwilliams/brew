import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PinIcon, SendIcon } from "./icons";
import MapBoxGl from "./mapBoxGl";

type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing?: number;
  pitch?: number;
};

interface ChooseAreaPanelProps {
  onAreaSelected: (center: [number, number], zoom: number) => void;
  onCancel: () => void;
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
  const handleConfirm = () => {
    onAreaSelected(viewport.center, viewport.zoom);
  };

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3"
    >
      <AnimatePresence mode="popLayout">
        {selectedArea === null ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-64 rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Map */}
            <MapBoxGl
              zoom={16}
              dragPan={true}
              dragRotate={true}
              scrollZoom={true}
              center={viewport.center}
              onMove={(center, zoom) =>
                setViewport({ ...viewport, center, zoom })
              }
            />

            {/* Grain overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15 z-10"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                backgroundSize: "120px",
              }}
            />

            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-md"
              style={{
                background: "rgba(10,10,10,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              {/* Top gloss */}
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent rounded-t-md" />

              <PinIcon size={16} color="#fff" />
              <span className="text-white/50 text-[11px] tracking-[-0.1px] whitespace-nowrap">
                {place ?? "Locating..."}
              </span>
            </motion.div>

            {/* Center crosshair */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.08, 0.2] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-28 h-28 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="w-3 h-3 rounded-full bg-white/80 shadow-lg"
                style={{
                  boxShadow:
                    "0 0 0 4px rgba(255,255,255,0.15), 0 0 20px rgba(255,255,255,0.1)",
                }}
              />
            </div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20"
            >
              <span
                className="text-white/30 text-[10px] tracking-[1.5px] uppercase px-3 py-1.5 rounded-md"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Drag to set area
              </span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#1c1c1c] rounded-xl border border-white/8 p-5 shadow-2xl shadow-black/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-wider text-white/30 mb-2 font-medium">
                  Around
                </div>
                <div className="text-sm  font-medium text-white/90 mb-1 tracking-[-0.1px]">
                  {place ?? "Current area"}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAreaCleared}
                className="text-xs text-white/40 cursor-pointer hover:text-white/70 font-medium whitespace-nowrap ml-4 transition-colors duration-200"
              >
                Change
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm button */}
      <AnimatePresence>
        {selectedArea === null && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ delay: 0.35, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: isAreaConfirmed ? 1 : 1.02 }}
            whileTap={{ scale: isAreaConfirmed ? 1 : 0.97 }}
            onClick={handleConfirm}
            disabled={isAreaConfirmed}
            className="w-fit flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium text-white/70 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <AnimatePresence mode="wait">
              {isAreaConfirmed ? (
                <motion.div
                  key="confirming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-3.5 h-3.5 border border-white/20 border-t-white/60 rounded-full"
                  />
                  <span>Setting area...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span>Set this area</span>
                  <SendIcon size={12} color="#fff" className="rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
