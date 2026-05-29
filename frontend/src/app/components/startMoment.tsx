"use client";
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
  onInvite?: () => void;
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

const EASE = [0.16, 1, 0.3, 1] as const;

export default function StartMoment({
  onGoBack,
  onInvite,
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
    cap_attendance: "",
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
  const [selectedUsers, setSelectedUsers] = useState<UserProp[]>([]);

  const changeVisibilityType = (value: VisibilityType) => {
    setSelectVisibility(value);
    setShowSubmit(true);
    setForm((prev) => ({ ...prev, visibility_type: value ?? "" }));
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "moment_end_time") {
        const startDate = prev.moment_start.split("T")[0] || "";
        return {
          ...prev,
          moment_end: startDate && value ? `${startDate}T${value}` : "",
        };
      }
      const date =
        name === "moment_start_date" ? value : prev.moment_start.split("T")[0];
      const time =
        name === "moment_start_time"
          ? value
          : prev.moment_start.split("T")[1] || "00:00";
      // Keep moment_end's date in sync when start date changes
      const updatedEnd =
        prev.moment_end && prev.moment_end.includes("T")
          ? `${date}T${prev.moment_end.split("T")[1]}`
          : prev.moment_end;
      return {
        ...prev,
        moment_start: `${date}T${time}`,
        moment_end: updatedEnd,
      };
    });
  };

  const goBack = (steps: MomentStage[]) => {
    if (!steps.includes(selectedModal)) return;
    const position = steps.indexOf(selectedModal);

    if (position === 0) {
      onGoBack?.();
      return;
    }

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

    setSelectedModal(steps[position - 1]);
  };

  return (
    <>
      {/* Back button */}
      <motion.button
        onClick={() => goBack(startMomentProp)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        whileTap={{ scale: 0.94 }}
        className="absolute left-0 top-0 m-5 sm:m-6 z-50 cursor-pointer flex items-center gap-2 group"
      >
        <div
          className="flex items-center justify-center transition-colors duration-200"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(var(--fg),0.06)",
            border: "1px solid rgba(var(--fg),0.1)",
          }}
        >
          <ChevronLeftIcon size={16} />
        </div>
        <span
          className="text-xs tracking-[-0.1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "rgba(var(--fg),0.25)" }}
        >
          Back
        </span>
      </motion.button>

      {/* Stage indicator dots — 3 steps: details / who / confirm */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 mt-6 flex items-center gap-1.5"
        style={{ zIndex: 20 }}
      >
        {[0, 1, 2].map((i) => {
            const stepIndex =
              selectedModal === "start" ? 0
              : selectedModal === "confirm" ? 2
              : 1;
            const isActive = i === stepIndex;
            const isPast = stepIndex > i;
            return (
              <motion.div
                key={i}
                animate={{
                  width: isActive ? 18 : 4,
                  background: isActive
                    ? "#d4a574"
                    : isPast
                      ? "rgba(212,165,116,0.32)"
                      : "rgba(var(--fg),0.1)",
                }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ height: 3, borderRadius: 2 }}
              />
            );
          })}
      </div>

      {/* Content */}
      <section
        className={`mx-auto w-full ${
          selectedModal !== "confirm"
            ? "max-w-full px-0"
            : "max-w-7xl px-4 sm:px-6 h-full"
        }`}
        style={{ color: "rgba(var(--fg),0.75)" }}
      >
        <AnimatePresence mode="wait">
          {selectedModal === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
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
            </motion.div>
          )}

          {selectedModal === "circle" && (
            <motion.div
              key="circle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Circle
                activeIndex={activeCircle}
                selectedCircle={selectedCircleProp}
                setActiveCircle={setActiveCircle}
                setSelectedCircleProp={setSelectedCircleProp}
                setSelectedModal={setSelectedModal}
                setForm={setForm}
                onInvite={onInvite}
              />
            </motion.div>
          )}

          {selectedModal === "people" && (
            <motion.div
              key="people"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <People
                selectedModal={selectedModal}
                setSelectedModal={setSelectedModal}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                onInvite={onInvite}
              />
            </motion.div>
          )}

          {selectedModal === "nearby" && (
            <motion.div
              key="nearby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <AroundYou
                goback={() => goBack(startMomentProp)}
                selectedModal={selectedModal}
                setSelectedModal={setSelectedModal}
              />
            </motion.div>
          )}

          {selectedModal === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              <MomentDetails
                selectedModal={selectedModal}
                setForm={setForm}
                handleChange={handleChange}
                form={form}
                onClose={onClose}
                selectedUsers={selectedUsers}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
