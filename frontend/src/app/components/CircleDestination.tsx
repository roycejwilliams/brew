import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Expectation from "./Expectation";

type InviteSelection = "people" | "where" | "share";
type Destination = "destination" | "expectation";
interface InviteSelectionProp {
  setInviteSelection: (inviteSelection: InviteSelection) => void;
  step: Destination;
  setStep: (step: Destination) => void;
}

const existingCircles = [
  { id: "1", name: "Close Friends", count: 8, image: "/profile_4.png" },
  { id: "2", name: "Work Crew", count: 5, image: "/profile_2.png" },
  { id: "3", name: "Family", count: 12, image: "/profile_3.png" },
];

export default function CircleDestination({
  setInviteSelection,
  step,
  setStep,
}: InviteSelectionProp) {
  const [circleOption, setCircleOption] = useState<"new" | "existing" | null>(
    null,
  );
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [newCircleName, setNewCircleName] = useState("");

  const canContinue =
    circleOption === "new"
      ? newCircleName.trim().length > 0
      : circleOption === "existing"
        ? selectedCircle !== null
        : false;

  if (step === "destination") {
    return (
      <motion.section
        key="circle-destination"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-y-8 mx-auto w-full px-6 py-8"
      >
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-1 pt-2"
        >
          <h2 className="text-white text-xl font-medium tracking-[-0.3px] leading-tight">
            Where should these people live?
          </h2>
          <p className="text-white/40 text-sm tracking-[-0.1px]">
            Invite them into an existing Circle or start a new one.
          </p>
        </motion.div>

        {/* Two cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* New Circle */}
          <motion.button
            onClick={() => {
              setCircleOption("new");
              setSelectedCircle(null);
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              opacity: circleOption === "existing" ? 0.25 : 1,
              scale: circleOption === "new" ? 1.01 : 1,
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center gap-3 rounded-md p-5 cursor-pointer"
            style={{
              background:
                circleOption === "new"
                  ? "rgba(255,255,255,0.09)"
                  : "rgba(255,255,255,0.04)",
              border:
                circleOption === "new"
                  ? "1px solid rgba(255,255,255,0.22)"
                  : "1px solid rgba(255,255,255,0.06)",
              minHeight: 130,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                width: 40,
                height: 40,
                background:
                  circleOption === "new"
                    ? "rgba(255,255,255,0.14)"
                    : "rgba(255,255,255,0.06)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M3 8h10"
                  stroke={
                    circleOption === "new"
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.4)"
                  }
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className="text-sm font-medium tracking-[-0.1px]"
                style={{
                  color:
                    circleOption === "new"
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.45)",
                }}
              >
                New Circle
              </p>
              <p
                className="text-xs mt-0.5"
                style={{
                  color:
                    circleOption === "new"
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.2)",
                }}
              >
                Start fresh
              </p>
            </div>
          </motion.button>

          {/* Existing Circle */}
          <motion.button
            onClick={() => {
              setCircleOption("existing");
              setNewCircleName("");
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              opacity: circleOption === "new" ? 0.25 : 1,
              scale: circleOption === "existing" ? 1.01 : 1,
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center gap-3 rounded-md p-5 cursor-pointer"
            style={{
              background:
                circleOption === "existing"
                  ? "rgba(255,255,255,0.09)"
                  : "rgba(255,255,255,0.04)",
              border:
                circleOption === "existing"
                  ? "1px solid rgba(255,255,255,0.22)"
                  : "1px solid rgba(255,255,255,0.06)",
              minHeight: 130,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                width: 40,
                height: 40,
                background:
                  circleOption === "existing"
                    ? "rgba(255,255,255,0.14)"
                    : "rgba(255,255,255,0.06)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="5"
                  stroke={
                    circleOption === "existing"
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.4)"
                  }
                  strokeWidth="1.6"
                />
                <circle
                  cx="8"
                  cy="8"
                  r="2"
                  fill={
                    circleOption === "existing"
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.4)"
                  }
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className="text-sm font-medium tracking-[-0.1px]"
                style={{
                  color:
                    circleOption === "existing"
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.45)",
                }}
              >
                Existing
              </p>
              <p
                className="text-xs mt-0.5"
                style={{
                  color:
                    circleOption === "existing"
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.2)",
                }}
              >
                Add to one
              </p>
            </div>
          </motion.button>
        </div>

        {/* Expanded content */}
        <AnimatePresence mode="popLayout">
          {circleOption === "new" && (
            <motion.div
              key="new-circle-input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-1"
            >
              <p className="text-white/25 text-xs tracking-wide uppercase font-medium mb-2">
                Circle name
              </p>
              <div
                className="w-full rounded-md px-4 py-4 transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: newCircleName.trim()
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <input
                  type="text"
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  placeholder="e.g. Inner Circle, NYC crew…"
                  autoFocus
                  className="w-full bg-transparent text-white placeholder-white/20 text-sm  placeholder:text-sm tracking-[-0.3px] outline-none"
                />
              </div>
              <p className="text-white/20 text-xs tracking-[-0.1px] mt-1 px-1">
                This name defines who's inside. Choose carefully.
              </p>
            </motion.div>
          )}

          {circleOption === "existing" && (
            <motion.div
              key="existing-circles"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2"
            >
              <p className="text-white/25 text-xs tracking-wide uppercase font-medium mb-2">
                Your circles
              </p>
              {existingCircles.map((circle, i) => (
                <motion.button
                  key={circle.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.22,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedCircle(circle.id)}
                  className="flex items-center justify-between w-full px-4 py-3.5 rounded-md cursor-pointer transition-all duration-200"
                  style={{
                    background:
                      selectedCircle === circle.id
                        ? "rgba(255,255,255,0.09)"
                        : "rgba(255,255,255,0.03)",
                    border:
                      selectedCircle === circle.id
                        ? "1px solid rgba(255,255,255,0.2)"
                        : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex gap-x-4 items-center">
                    <div className="w-8 h-8 rounded-sm relative overflow-hidden">
                      <Image
                        src={circle.image}
                        alt={circle.name}
                        fill
                        className="w-full h-full "
                      />
                    </div>
                    <span
                      className="text-sm font-medium tracking-[-0.1px] transition-colors duration-200"
                      style={{
                        color:
                          selectedCircle === circle.id
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {circle.name}
                    </span>
                  </div>
                  <span
                    className="text-xs transition-colors duration-200"
                    style={{
                      color:
                        selectedCircle === circle.id
                          ? "rgba(255,255,255,0.35)"
                          : "rgba(255,255,255,0.18)",
                    }}
                  >
                    {circle.count} people
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue */}
        <AnimatePresence>
          {circleOption && (
            <motion.button
              onClick={() => setStep("expectation")}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: canContinue ? 1 : 0.3, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              whileTap={{ scale: canContinue ? 0.97 : 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              disabled={!canContinue}
              className="w-full py-4 rounded-md text-sm font-medium tracking-[-0.2px] transition-opacity duration-200 hover:opacity-90"
              style={{
                background: "#ffffff",
                color: "#111111",
                cursor: canContinue ? "pointer" : "default",
              }}
            >
              Continue
            </motion.button>
          )}
        </AnimatePresence>
      </motion.section>
    );
  }

  if (step === "expectation") {
    return <Expectation setInviteSelection={setInviteSelection} />;
  }
}
