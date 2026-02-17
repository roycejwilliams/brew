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
    <motion.section layout key="circle" className=" text-center space-y-5">
      <motion.div
        key={selectedCircleProp ? "selected-header" : "browse-header"}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 space-y-1"
      >
        {selectedCircleProp ? (
          <>
            <h2 className="text-lg font-medium text-white/90">
              Inviting your circle
            </h2>
            <p className="text-sm text-white/40">
              Sending to{" "}
              <span className="text-white/70 font-medium">
                {selectedCircleProp.name}
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-medium text-white/90">
              Share with your circle
            </h2>
            <p className="text-sm text-white/40">
              Invite people you already trust
            </p>
          </>
        )}
      </motion.div>

      {/* MIDDLE — persistent */}
      <CircleScene
        circles={circles}
        activeIndex={activeCircle}
        selectedCircle={selectedCircleProp}
      />

      {/* CONTROLS — presence */}
      {selectedCircleProp === null && (
        <>
          <CircleSignal circles={circles} activeIndex={activeCircle} />
          <CircleControls nextMarker={nextSignal} prevMarker={prevSignal} />
        </>
      )}

      <SelectAction
        selectedCircle={selectedCircleProp}
        onSelect={() => setSelectedCircleProp(circles[activeCircle])}
        onContinue={() => setSelectedModal("confirm")}
      />

      {/* CTA — persistent */}
    </motion.section>
  );
}
