import { AnimatePresence, motion } from "motion/react";
import CircleScene from "./CircleScene";
import CircleSignal from "./CircleSignal";
import CircleControls from "./circleControls";
import SelectAction from "./selectAction";
import { useState } from "react";

interface Circle {
  id: string;
  name: string;
  members: string[]; // or User[]
  image: string;
}

interface CircleSceneProp {
  circles: Circle[];
  selectedCircle: Circle | null;
  circleIndex: number;
}

interface CircleSelection {
  activeIndex: number;
  setActiveCircle: React.Dispatch<React.SetStateAction<number>>;
  selectedCircle: Circle | null;
  setSelectedCircleProp: (selectedCircle: Circle | null) => void;
  setSelectedModal: (selectedModal: "confirm") => void;
}

export default function Circle({
  activeIndex,
  selectedCircle,
  setActiveCircle,
  setSelectedCircleProp,
  setSelectedModal,
}: CircleSelection) {
  const markerData: number[] = Array.from({ length: 28 });

  const mockCircles: Circle[] = [
    {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "The Usual Suspects",
      members: ["Jordan Miles", "Ava Chen", "Marcus Webb", "Priya Nair"],
      image: "/EventRecap-5.jpg",
    },
    {
      id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      name: "Bay Nights",
      members: ["Tyler Ross", "Simone Park", "Devon Kale", "Mia Torres"],
      image: "/EventRecap-2.jpg",
    },
    {
      id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
      name: "Studio Crew",
      members: ["Kai Lennox", "Zara Moon", "Felix Osei"],
      image: "/EventRecap-3.jpg",
    },
    {
      id: "d4e5f6a7-b8c9-0123-defa-234567890123",
      name: "Rooftop Regulars",
      members: [
        "Nadia Voss",
        "Chris Endo",
        "Lena Park",
        "Sam Diallo",
        "Omar Reyes",
      ],
      image: "/EventRecap-4.jpg",
    },
  ];

  const mockCircleScene: CircleSceneProp = {
    circles: mockCircles,
    selectedCircle: selectedCircle,
    circleIndex: 0,
  };

  const nextSignal = () => {
    setActiveCircle((i) => (i + 1) % mockCircleScene.circles.length);
  };

  const prevSignal = () => {
    setActiveCircle(
      (i) =>
        (i - 1 + mockCircleScene.circles.length) %
        mockCircleScene.circles.length,
    );
  };

  console.log(mockCircleScene.circles[activeIndex]);

  return (
    <AnimatePresence mode="sync">
      <motion.section key="circle" className=" text-center space-y-5 relative">
        <motion.div
          key={selectedCircle ? "selected-header" : "browse-header"}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 space-y-1"
        >
          {selectedCircle ? (
            <>
              <h2 className="text-lg font-medium text-white/90">
                Inviting your circle
              </h2>
              <p className="text-sm text-white/40">
                Sending to{" "}
                <span className="text-white/70 font-medium">
                  {selectedCircle.name}
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
          circles={mockCircleScene.circles}
          circleIndex={activeIndex}
          selectedCircle={mockCircleScene.selectedCircle}
          markerData={markerData}
        />

        <AnimatePresence mode="wait">
          {/* CONTROLS — presence */}
          {selectedCircle === null && (
            <>
              <CircleSignal
                circles={mockCircleScene.circles}
                activeIndex={activeIndex}
              />
              <CircleControls nextMarker={nextSignal} prevMarker={prevSignal} />
            </>
          )}
        </AnimatePresence>

        <SelectAction
          selectedCircle={selectedCircle}
          onSelect={() =>
            setSelectedCircleProp(mockCircleScene.circles[activeIndex])
          }
          onContinue={() => setSelectedModal("confirm")}
        />

        {/* CTA — persistent */}
      </motion.section>
    </AnimatePresence>
  );
}
