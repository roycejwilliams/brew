"use client";
import React from "react";
import { motion } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface CircleControlProp {
  nextMarker: () => void;
  prevMarker: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const ArrowButton = ({
  onClick,
  children,
  size = 40,
}: {
  onClick: () => void;
  children: React.ReactNode;
  size?: number;
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.94 }}
    className="flex items-center justify-center cursor-pointer transition-colors duration-150"
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `rgba(var(--bg),0.75)`,
      border: `1px solid rgba(var(--fg),0.1)`,
      backdropFilter: "blur(12px)",
      color: `rgba(var(--fg),0.6)`,
      flexShrink: 0,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = `rgba(var(--fg),0.08)`;
      e.currentTarget.style.borderColor = `rgba(var(--fg),0.2)`;
      e.currentTarget.style.color = `rgba(var(--fg),0.9)`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = `rgba(var(--bg),0.75)`;
      e.currentTarget.style.borderColor = `rgba(var(--fg),0.1)`;
      e.currentTarget.style.color = `rgba(var(--fg),0.6)`;
    }}
  >
    {children}
  </motion.button>
);

export default function CircleControls({
  nextMarker,
  prevMarker,
}: CircleControlProp) {
  return (
    <>
      {/* Mobile — row below the scene */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="md:hidden flex items-center justify-center gap-6 py-3"
      >
        <ArrowButton onClick={prevMarker}>
          <ChevronLeftIcon size={15} color="currentColor" />
        </ArrowButton>
        <ArrowButton onClick={nextMarker}>
          <ChevronRightIcon size={15} color="currentColor" />
        </ArrowButton>
      </motion.div>

      {/* Desktop — overlaid on scene edges, bigger */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 w-full items-center justify-around px-4 pointer-events-none"
      >
        <div className="pointer-events-auto">
          <ArrowButton onClick={prevMarker} size={64}>
            <ChevronLeftIcon size={24} color="currentColor" />
          </ArrowButton>
        </div>
        <div className="pointer-events-auto">
          <ArrowButton onClick={nextMarker} size={64}>
            <ChevronRightIcon size={24} color="currentColor" />
          </ArrowButton>
        </div>
      </motion.div>
    </>
  );
}
