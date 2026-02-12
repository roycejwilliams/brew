import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Circle {
  id: string;
  name: string;
  members: string[]; // or User[]
  image: string;
}

interface CircleSignalProp {
  circles: Circle[];
  activeIndex: number;
}

export default function CircleSignal({
  circles,
  activeIndex,
}: CircleSignalProp) {
  return (
    <motion.div
      className="absolute right-0 transform -translate-y-1/2  top-1/2 rounded-md "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <ul className="flex flex-col gap-y-8">
        {circles.map((circle, i) => (
          <motion.li
            key={i}
            className={`flex gap-x-8 justify-between items-center z-20 text-sm relative`}
            initial={{ opacity: 0, x: 30 }}
            animate={{
              opacity: activeIndex === i ? 1 : 0.4,
              x: 0,
              scale: activeIndex === i ? 1 : 0.95,
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {/* Active indicator */}
            <motion.div
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-linear-to-r from-blue-400 to-purple-500"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: activeIndex === i ? 1 : 0,
                opacity: activeIndex === i ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* Glow effect for active item */}
            {activeIndex === i && (
              <motion.div
                className="absolute inset-0 -z-10 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              />
            )}
            <div className="flex gap-2 items-center flex-wrap w-fit">
              {circle.members.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-white/10 relative text-white/80 overflow-hidden border border-white/15 w-12 h-12"
                  style={{
                    position: "relative",
                    left: `${i * -26}px`,
                    zIndex: circle.members.length - i,
                  }}
                >
                  <Image
                    src={circle.image}
                    alt={circle.members[i]}
                    fill
                    className="absolute w-full h-full inset-0"
                  />
                </div>
              ))}

              {circle.members.length > 3 && (
                <div className="px-3 py-1 text-sm border rounded-full">
                  +{circle.members.length - 3}
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
