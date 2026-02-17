"use client";
import { motion } from "motion/react";
import { CalendarDate } from "@internationalized/date";

const dotVariants = {
  idle: { opacity: 0.85, scale: 1 },
  pressed: { opacity: 1, scale: 1.1 },
};

interface Circle {
  id: string;
  name: string;
  members: string[]; // or User[]
  image: string;
}

interface SelectedCircleSignalProp {
  selectedCircle: Circle | null;
  onSelect: () => void;
  onContinue: () => void;
}

export default function SelectAction({
  selectedCircle,
  onSelect,
  onContinue,
}: SelectedCircleSignalProp) {
  const isSelected = selectedCircle !== null;

  return (
    <motion.div
      variants={dotVariants}
      whileTap="pressed"
      initial="idle"
      className=" mx-auto mt-8 mb-4 flex flex-col items-center"
    >
      <motion.button
        onClick={isSelected ? onContinue : onSelect}
        className="
          text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/90 backdrop-blur-2xl 
                      text-black border border-white/20 rounded-md 
                      hover:bg-white shadow-lg shadow-white/10
                      transition-all duration-200
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
