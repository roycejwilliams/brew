import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

interface ModalOpen {
  setIsModalOpen: (isModalOpen: boolean) => void;
}

type VisibilityType = "circle" | "people" | "nearby";

export default function NewMomentModal({ setIsModalOpen }: ModalOpen) {
  const [visibility, setVisibility] = useState<VisibilityType>("circle");

  // Mock circles — replace with real data
  const circles = [
    { id: "1", name: "The Usual Suspects" },
    { id: "2", name: "Bay Nights" },
    { id: "3", name: "Studio Crew" },
    { id: "4", name: "Rooftop Regulars" },
  ];

  return (
    <motion.div
      className="relative z-10 w-full max-w-md bg-linear-to-b from-white/8 to-white/3 border border-white/15 rounded-md shadow-2xl p-6 flex flex-col gap-5 backdrop-blur-xl"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Gloss highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent rounded-t-md" />
      <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-white/6 to-transparent rounded-t-md pointer-events-none" />

      <div className="flex items-center justify-between">
        <h2 className="text-white text-sm uppercase tracking-widest font-medium">
          New Moment
        </h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-white/30 hover:text-white/60 transition-colors cursor-pointer text-xs uppercase tracking-wide"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-xs uppercase tracking-wide">
            Title
          </label>
          <input
            type="text"
            placeholder="What's the occasion?"
            className="bg-white/6 border border-white/10 rounded-md px-3 py-2.5 text-white text-xs placeholder:text-xs placeholder:text-white/20 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-xs uppercase tracking-wide">
            Location
          </label>
          <input
            type="text"
            placeholder="Where is it happening?"
            className="bg-white/6 border border-white/10 rounded-md px-3 py-2.5 text-white text-xs placeholder:text-xs placeholder:text-white/20 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-white/30 text-xs uppercase tracking-wide">
              Date
            </label>
            <input
              type="date"
              className="bg-white/6 border border-white/10 rounded-md px-3 py-2.5 text-white/70 text-xs focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-white/30 text-xs uppercase tracking-wide">
              Start
            </label>
            <input
              type="time"
              className="bg-white/6 border border-white/10 rounded-md px-3 py-2.5 text-white/70 text-xs focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-xs uppercase tracking-wide">
            End Time
          </label>
          <input
            type="time"
            className="bg-white/6 border border-white/10 rounded-md px-3 py-2.5 text-white/70 text-xs focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-xs uppercase tracking-wide">
            Image
          </label>
          <div className="bg-white/4 border border-dashed border-white/10 rounded-md px-3 py-6 text-center cursor-pointer hover:border-white/20 hover:bg-white/6 transition-all">
            <p className="text-white/20 text-xs">
              Drop an image or click to upload
            </p>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex flex-col gap-2">
          <label className="text-white/30 text-xs uppercase tracking-wide">
            Who can see this?
          </label>
          <div className="flex gap-2">
            {(["circle", "people", "nearby"] as VisibilityType[]).map(
              (type) => (
                <motion.button
                  key={type}
                  type="button"
                  onClick={() => setVisibility(type)}
                  className={`flex-1 py-2 rounded-md text-xs capitalize cursor-pointer border transition-colors ${
                    visibility === type
                      ? "bg-white/10 border-white/25 text-white"
                      : "bg-white/4 border-white/8 text-white/30 hover:border-white/15 hover:text-white/50"
                  }`}
                  whileTap={{ scale: 0.96 }}
                >
                  {type}
                </motion.button>
              ),
            )}
          </div>

          <AnimatePresence mode="wait">
            {visibility === "circle" && (
              <motion.div
                key="circle-select"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <select className="w-full bg-white/6 border border-white/10 rounded-md px-3 py-2.5 text-white/70 text-xs focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all appearance-none cursor-pointer">
                  <option value="" className="bg-[#1c1c1c]">
                    Select a circle
                  </option>
                  {circles.map((circle) => (
                    <option
                      key={circle.id}
                      value={circle.id}
                      className="bg-[#1c1c1c]"
                    >
                      {circle.name}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {visibility === "people" && (
              <motion.div
                key="people-select"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Search people to invite..."
                  className="w-full bg-white/6 border border-white/10 rounded-md px-3 py-2.5 text-white text-xs placeholder:text-xs placeholder:text-white/20 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        className="relative w-full bg-white text-black text-xs uppercase tracking-widest font-medium py-3 rounded-md overflow-hidden cursor-pointer hover:bg-white/90 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
        Create Moment
      </motion.button>
    </motion.div>
  );
}
