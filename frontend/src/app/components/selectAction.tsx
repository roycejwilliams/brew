"use client";
import { motion } from "motion/react";
import { CalendarDate } from "@internationalized/date";

const dotVariants = {
  idle: { opacity: 0.55, scale: 1 },
  pressed: { opacity: 0.75, scale: 1.1 },
};

interface Circle {
  id: string;
  name: string;
  members: string[]; // or User[]
  image: string;
}

interface SelectedCircleSignalProp {
  selectedSignal: Circle | null;
  onSelect: () => void;
  onContinue: () => void;
}

export default function SelectAction({
  selectedSignal,
  onSelect,
  onContinue,
}: SelectedCircleSignalProp) {
  const isSelected = selectedSignal !== null;

  return (
    <motion.div
      variants={dotVariants}
      whileTap="pressed"
      initial="idle"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
    >
      <motion.button
        onClick={isSelected ? onContinue : onSelect}
        className="
          px-8 py-3.5
          rounded-md
          text-sm tracking-wide font-medium text-white
          bg-white/5
          border border-white/15
          backdrop-blur-md
          shadow-[0_12px_40px_rgba(0,0,0,0.45)]
          hover:border-white/25
          focus:outline-none
          cursor-pointer
        "
      >
        {isSelected ? "Continue" : "Select"}
      </motion.button>

      <motion.span
        variants={dotVariants}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mt-1.5 w-1.25 h-1.25 rounded-full bg-white pointer-events-none"
      />
    </motion.div>
  );
}
