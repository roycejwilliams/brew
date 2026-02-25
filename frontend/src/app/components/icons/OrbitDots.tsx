import { motion } from "motion/react";
import React from "react";

export default function OrbitDots() {
  const DOT_COUNT = 8;
  const RADIUS = 20;

  return (
    <div
      className="relative"
      style={{ width: RADIUS * 2 + 12, height: RADIUS * 2 + 12 }}
    >
      {Array.from({ length: DOT_COUNT }).map((_, i) => {
        const angle = (i / DOT_COUNT) * 2 * Math.PI - Math.PI / 2;
        const x = RADIUS + RADIUS * Math.cos(angle);
        const y = RADIUS + RADIUS * Math.sin(angle);
        const delay = (i / DOT_COUNT) * -1.0;

        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white shadow-2xl"
            style={{
              width: 8,
              height: 8,
              left: x + 1,
              top: y + 1,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{ opacity: [0.08, 0.9, 0.08] }}
            transition={{
              duration: 1.0,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        );
      })}
    </div>
  );
}
