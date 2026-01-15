import { motion } from "motion/react";

interface RadialGradientProps {
  centerColor: string;
  midColor: string;
  edgeColor: string;
  noiseOpacity?: number;
}

export function RadialGradientBackground({
  centerColor,
  midColor,
  edgeColor,
  noiseOpacity = 0.12,
}: RadialGradientProps) {
  return (
    <motion.div
      className="absolute inset-0 rounded-[inherit]"
      animate={{
        backgroundImage: [
          `radial-gradient(
            circle at 50% 50%,
            ${centerColor} 0%,
            ${midColor} 40%,
            ${edgeColor} 70%
          )`,
          `radial-gradient(
            circle at 46% 54%,
            ${centerColor} 0%,
            ${midColor} 40%,
            ${edgeColor} 70%
          )`,
          `radial-gradient(
            circle at 54% 46%,
            ${centerColor} 0%,
            ${midColor} 40%,
            ${edgeColor} 70%
          )`,
          `radial-gradient(
            circle at 50% 50%,
            ${centerColor} 0%,
            ${midColor} 40%,
            ${edgeColor} 70%
          )`,
        ],
      }}
      transition={{
        duration: 16,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        backgroundSize: "140% 140%",
      }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: noiseOpacity,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
}
