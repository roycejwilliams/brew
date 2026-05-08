import React from "react";
import Carousel from "./carousel";
import { useGetAllMomentsUserIsAttendee } from "@/hooks/useMoments";
import { motion } from "motion/react";

interface AttendedProp {
  id: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function Attended({ id }: AttendedProp) {
  const { data: member, isLoading } = useGetAllMomentsUserIsAttendee(id);
  const momentsAttended = member?.data.data || [];

  if (isLoading)
    return (
      <section className="w-full relative">
        <div className="flex items-center gap-2 border-b border-white/8 pb-4 mb-4">
          <p className="text-xs tracking-[3px] uppercase text-white/20">
            Presence
          </p>
        </div>
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="rounded-xl bg-white/3 border border-white/5"
              style={{ width: 300, height: 300 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </section>
    );

  if (momentsAttended.length === 0) return null;

  return (
    <motion.section
      className="w-full relative"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="flex items-center gap-2 border-b border-white/8 pb-4 mb-4">
        <p className="text-xs tracking-[3px] uppercase text-white/20">
          Presence
        </p>
        <span className="text-xs text-white/15">{momentsAttended.length}</span>
      </div>
      <Carousel moments={momentsAttended} width={300} height={300} />
    </motion.section>
  );
}

export default Attended;
