import React, { ChangeEvent, useEffect, useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeftIcon } from "./icons";
import Circle from "./circle";
import MomentConfirmation from "./momentConfirmation";
import People from "./people";
import Start from "./start";
import AroundYou from "./aroundYou";

type CreateMomentStage = "start" | "circle" | "people" | "nearby" | "confirm";
type WhoSelectionProp = "circle" | "people" | "nearby" | null;

interface Moment {
  id: string;
  circleId: string; // relationship
  title: string;
  date: CalendarDate;
  time: string;
  attendees: string[];
  image: string;
}

interface Circle {
  id: string;
  name: string;
  members: string[]; // or User[]
  image: string;
}

interface MomentProp {
  onGoBack?: () => void;
  onContinue?: () => void;
  selectedModal: CreateMomentStage;
  setSelectedModal: (selectedModal: CreateMomentStage) => void;
}

const startMomentProp: CreateMomentStage[] = [
  "start",
  "circle",
  "people",
  "nearby",
  "confirm",
];

export default function StartMoment({
  onGoBack,
  selectedModal,
  setSelectedModal,
}: MomentProp) {
  //Allows you to select the circle of friends you want invited
  const [selectedCircleProp, setSelectedCircleProp] = useState<Circle | null>(
    null,
  );
  const [activeCircle, setActiveCircle] = useState<number>(0);
  const [selectedWho, setSelectedWho] = useState<WhoSelectionProp | null>();
  const [showSubmit, setShowSubmit] = useState<boolean>(false);

  //Points to the Active Circle ultimately for selection
  const [createMoment, setCreateMoment] = useState<string>("");

  //Capturing Event input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateMoment(e.target.value);
  };

  const onSelectionWho = (value: WhoSelectionProp) => {
    setSelectedWho(value);
    setShowSubmit(true);
  };

  //function to cycleback
  const goBack = (steps: CreateMomentStage[]) => {
    if (!steps.includes(selectedModal)) return;

    const position = steps.indexOf(selectedModal);

    if (position === 0) {
      onGoBack?.();
      return;
    }

    const previousStep = steps[position - 1];

    if (selectedModal === "circle" && selectedCircleProp) {
      setSelectedCircleProp(null);
      return;
    }

    if (selectedModal === "confirm") {
      setSelectedModal(selectedWho!);
      return;
    }

    if (
      selectedModal === "circle" ||
      selectedModal === "nearby" ||
      selectedModal === "people"
    ) {
      setSelectedWho(null);
      setSelectedModal("start");
      return;
    }

    setSelectedModal(previousStep);
  };

  const circles: Circle[] = [
    {
      id: "first-pour",
      name: "First Pour",
      members: ["Ava", "Marcus", "Elijah"],
      image: "/ex1.jpg",
    },
    {
      id: "hermes",
      name: "Hermes Rooftop Session",
      members: ["Lina", "Theo", "Isabella"],
      image: "/ex2.jpg",
    },
  ];

  return (
    <>
      <motion.button
        onClick={() => goBack(startMomentProp)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ x: -4, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          opacity: { duration: 0.2 },
          x: { type: "spring", stiffness: 300, damping: 25 },
        }}
        className="absolute left-0 top-0 m-8 cursor-pointer flex gap-x-1 items-center text-white/80 hover:text-white transition-colors"
      >
        <motion.div
          animate={{ x: [0, -3, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
            repeatDelay: 2,
          }}
        >
          <ChevronLeftIcon size={18} />
        </motion.div>
        back
      </motion.button>

      <motion.section
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className={`mx-auto ${selectedModal !== "confirm" ? "max-w-full" : "max-w-7xl"} text-[#cecece]/75`}
      >
        <AnimatePresence mode="wait">
          {selectedModal === "start" && (
            <Start
              createMoment={createMoment}
              onChange={handleInputChange}
              onWho={onSelectionWho}
              selectedWho={selectedWho!}
              setSelectedModal={setSelectedModal}
              showSubmit={showSubmit}
            />
          )}

          {selectedModal === "circle" && (
            <Circle
              activeCircle={activeCircle}
              setActiveCircle={setActiveCircle}
              circles={circles}
              selectedCircleProp={selectedCircleProp}
              setSelectedCircleProp={setSelectedCircleProp}
              setSelectedModal={setSelectedModal}
            />
          )}

          {selectedModal === "people" && (
            <People
              selectedModal={selectedModal}
              circles={circles}
              setSelectedModal={setSelectedModal}
            />
          )}
          {selectedModal === "nearby" && (
            <AroundYou
              goback={() => goBack(startMomentProp)}
              selectedModal={selectedModal}
              setSelectedModal={setSelectedModal}
            />
          )}

          {selectedModal === "confirm" && (
            <MomentConfirmation selectedModal={selectedModal} />
          )}
        </AnimatePresence>
      </motion.section>
    </>
  );
}
