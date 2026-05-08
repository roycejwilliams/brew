import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeftIcon } from "./icons";
import Circle from "./circle";
import MomentDetails from "./MomentDetails";
import People from "./people";
import Start from "./start";
import AroundYou from "./aroundYou";

type VisibilityType = "circle" | "people" | "nearby" | null;
type MomentStage = "start" | "circle" | "people" | "nearby" | "confirm";

interface MomentProp {
  onGoBack?: () => void;
  onContinue?: () => void;
  selectedModal: MomentStage;
  setSelectedModal: (selectedModal: MomentStage) => void;
  onClose: () => void;
}

const startMomentProp: MomentStage[] = [
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
  onClose,
}: MomentProp) {
  const [form, setForm] = useState({
    moments_name: "",
    location: "",
    location_name: "",
    moment_start: "",
    visibility_type: "",
    moment_end: "",
    description: "",
    close_moment: "",
    cap_attendance: "", // add this
    principles: [],
    expectations: [],
    vibes: [],
    faqs: [] as { question: string; answer: string }[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [selectedCircleProp, setSelectedCircleProp] =
    useState<CircleProp | null>(null);
  const [activeCircle, setActiveCircle] = useState<number>(0);
  const [selectedVisibility, setSelectVisibility] =
    useState<VisibilityType | null>();
  const [showSubmit, setShowSubmit] = useState<boolean>(false);
  const [reveal, setReveal] = useState<boolean>(false);

  const changeVisibilityType = (value: VisibilityType) => {
    setSelectVisibility(value);
    setShowSubmit(true);
    setForm((prev) => ({ ...prev, visibility_type: value ?? "" }));
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const date =
        name === "moment_start_date" ? value : prev.moment_start.split("T")[0];
      const time =
        name === "moment_start_time"
          ? value
          : prev.moment_start.split("T")[1] || "00:00";
      return { ...prev, moment_start: `${date}T${time}` };
    });
  };

  const [selectedUsers, setSelectedUsers] = useState<UserProp[]>([]);
  //function to cycleback
  const goBack = (steps: MomentStage[]) => {
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
      setSelectedModal(selectedVisibility ?? "start");
      return;
    }

    if (
      selectedModal === "circle" ||
      selectedModal === "nearby" ||
      selectedModal === "people"
    ) {
      setSelectedModal("start");
      return;
    }

    setSelectedModal(previousStep);
  };

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
              form={form}
              handleTimeChange={handleDateTimeChange}
              handleChange={handleChange}
              setSelectedVisibility={changeVisibilityType}
              selectedVisbility={selectedVisibility as VisibilityType}
              setSelectedModal={setSelectedModal}
              showSubmit={showSubmit}
              reveal={reveal}
              setReveal={setReveal}
            />
          )}

          {selectedModal === "circle" && (
            <Circle
              activeIndex={activeCircle}
              selectedCircle={selectedCircleProp}
              setActiveCircle={setActiveCircle}
              setSelectedCircleProp={setSelectedCircleProp}
              setSelectedModal={setSelectedModal}
              setForm={setForm}
            />
          )}

          {selectedModal === "people" && (
            <People
              selectedModal={selectedModal}
              setSelectedModal={setSelectedModal}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
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
            <MomentDetails
              selectedModal={selectedModal}
              setForm={setForm}
              handleChange={handleChange}
              form={form}
              onClose={onClose}
              selectedUsers={selectedUsers}
            />
          )}
        </AnimatePresence>
      </motion.section>
    </>
  );
}
