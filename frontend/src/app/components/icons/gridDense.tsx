import { motion } from "motion/react";
import React from "react";

type IconProps = {
  size?: number;
  className?: string;
  color?: string;
  changeGrid: () => void;
  active?: boolean;
};

export default function GridDense({
  size = 24,
  className,
  color,
  changeGrid,
  active,
}: IconProps) {
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.9 }}
      onClick={() => changeGrid()}
      className={`p-2 rounded-md transition ${
        active
          ? "border border-white shadow-md shadow-black/20"
          : "border border-transparent"
      }`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 350 156"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M78 0.75C120.664 0.75 155.25 35.336 155.25 78C155.25 120.664 120.664 155.25 78 155.25C35.336 155.25 0.75 120.664 0.75 78C0.75 35.336 35.336 0.75 78 0.75ZM272 0.75C314.664 0.75 349.25 35.336 349.25 78C349.25 120.664 314.664 155.25 272 155.25C229.336 155.25 194.75 120.664 194.75 78C194.75 35.336 229.336 0.75 272 0.75Z"
          stroke={color}
          strokeWidth="10"
        />
      </svg>
    </motion.button>
  );
}
