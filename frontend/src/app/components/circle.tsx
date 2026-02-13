import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import CircleScene from "./CircleScene";
import CircleSignal from "./CircleSignal";
import CircleControls from "./circleControls";
import SelectAction from "./selectAction";

type CreateMomentStage = "start" | "circle" | "people" | "nearby" | "confirm";

interface Circle {
  id: string;
  name: string;
  members: string[]; // or User[]
  image: string;
}

interface CircleProp {
  selectedCircleProp: Circle | null;
  setSelectedCircleProp: (selectedCircleProp: Circle | null) => void;
  activeCircle: number;
  setActiveCircle: React.Dispatch<React.SetStateAction<number>>;
  circles: Circle[];
  setSelectedModal: (modal: CreateMomentStage) => void;
}

export default function Circle({
  selectedCircleProp,
  activeCircle,
  setActiveCircle,
  setSelectedCircleProp,
  circles,
  setSelectedModal,
}: CircleProp) {
  const nextSignal = () => {
    setActiveCircle((i: number) => (i + 1) % circles.length);
  };

  const prevSignal = () => {
    setActiveCircle((i: number) => (i - 1 + circles.length) % circles.length);
  };

  return (
    <motion.section
      key="circle"
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="overflow-hidden text-center "
    >
      <AnimatePresence mode="wait">
        <div className="mb-4 text-lg">
          {selectedCircleProp ? (
            <motion.h2
              key="selected-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Inviting
              <br />
              <span className="text-white font-medium text-xl">
                {selectedCircleProp.name}
              </span>
            </motion.h2>
          ) : (
            <motion.h2
              key="browse-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Who should see this event?
            </motion.h2>
          )}
        </div>
      </AnimatePresence>

      {/* MIDDLE — persistent */}
      <CircleScene
        circles={circles}
        activeIndex={activeCircle}
        selectedCircle={selectedCircleProp}
      />

      {/* CONTROLS — presence */}
      <AnimatePresence mode="wait">
        {selectedCircleProp === null && (
          <motion.div
            key="controls"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <CircleSignal circles={circles} activeIndex={activeCircle} />
            <CircleControls nextMarker={nextSignal} prevMarker={prevSignal} />
          </motion.div>
        )}
      </AnimatePresence>

      <SelectAction
        selectedSignal={selectedCircleProp}
        onSelect={() => setSelectedCircleProp(circles[activeCircle])}
        onContinue={() => setSelectedModal("confirm")}
      />

      {/* CTA — persistent */}
    </motion.section>
  );
}
