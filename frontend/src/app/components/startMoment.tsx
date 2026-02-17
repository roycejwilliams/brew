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
  chooser: "circle" | "people" | "nearby";
  setChooser: (value: "circle" | "people" | "nearby" | null) => void;
  onGoBack?: () => void;
  onContinue?: () => void;
  selectedModal: CreateMomentStage;
  setSelectedModal: (selectedModal: CreateMomentStage) => void;
}

export default function StartMoment({
  chooser,
  setChooser,
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
  const goBack = () => {
    if (selectedModal === "confirm") {
      setSelectedModal(chooser!);
    } else if (selectedModal === "start") {
      // Go back to parent's two-card view
      onGoBack?.();
    } else {
      setSelectedWho(null);
      setSelectedModal("start");
      setShowSubmit(false);
    }
  };

  useEffect(() => {
    if (selectedWho) {
      setChooser(selectedWho);
    }
  }, [selectedWho, setChooser]);

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

  console.log("selected modal", selectedModal);

  return (
    <>
      <motion.button
        onClick={goBack}
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
        className={`mx-auto ${selectedModal !== "confirm" ? "max-w-lg" : "max-w-7xl"}  text-[#cecece]/75`}
      >
        <AnimatePresence mode="wait">
          {selectedModal === "start" && (
            <Start
              createMoment={createMoment}
              onChange={handleInputChange}
              onWho={onSelectionWho}
              selectedWho={selectedWho!}
              chooser={chooser}
              setChooser={setChooser}
              selectedModal={selectedModal}
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
              goback={goBack}
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

interface ClockCircleLinearIconProps extends React.SVGProps<SVGSVGElement> {}

export const ClockCircleLinearIcon = (props: ClockCircleLinearIconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="0.8em"
      role="presentation"
      viewBox="0 0 24 24"
      width="0.8em"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path
          d="M12 8v4l2.5 2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
