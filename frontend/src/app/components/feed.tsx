"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Attended from "./attended";
import Hosted from "./hosted";
import {
  useGetAllMomentsOwnedByUser,
  useGetAllMomentsUserIsAttendee,
} from "@/hooks/useMoments";

interface FeedProp {
  completed: number;
  userId: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function Feed({ completed, userId }: FeedProp) {
  const { data: member } = useGetAllMomentsUserIsAttendee(userId);
  const { data: owner } = useGetAllMomentsOwnedByUser(userId);

  const attended = member?.data.data || [];
  const hosted = owner?.data.data || [];
  const hasMoments = attended.length > 0 || hosted.length > 0;

  return (
    <section className="w-full mt-8 h-full flex justify-center items-center pb-24 sm:pb-0">
      {completed === 100 && hasMoments ? (
        <div className="flex flex-col gap-y-16 w-full">
          <Attended id={userId} />
          <Hosted id={userId} />
        </div>
      ) : (
        <div className="relative flex flex-col gap-y-10 h-full justify-center items-center mt-8 w-full">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(152,71,62,0.18) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />

          {/* Cards */}
          <div
            className="flex items-end justify-center relative z-10"
            style={{ gap: 0 }}
          >
            {/* Left card */}
            <motion.div
              initial={{ opacity: 0, x: -20, rotate: -14 }}
              animate={{ opacity: 1, x: 0, rotate: -12 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              whileHover={{
                y: -12,
                rotate: -10,
                transition: { duration: 0.3, ease: EASE },
              }}
              className="relative overflow-hidden cursor-pointer"
              style={{
                width: "clamp(90px, 28vw, 130px)",
                height: "clamp(120px, 38vw, 175px)",
                borderRadius: 14,
                marginBottom: 28,
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                zIndex: 1,
                marginRight: -18,
              }}
            >
              <Image
                src="/profile_2.png"
                fill
                priority
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)",
                }}
              />
            </motion.div>

            {/* Center card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
              whileHover={{ y: -14, transition: { duration: 0.3, ease: EASE } }}
              className="relative overflow-hidden cursor-pointer"
              style={{
                width: "clamp(105px, 32vw, 148px)",
                height: "clamp(140px, 42vw, 200px)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.16)",
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
                zIndex: 3,
              }}
            >
              <Image
                src="/profile_3.png"
                fill
                priority
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)",
                }}
              />
            </motion.div>

            {/* Right card */}
            <motion.div
              initial={{ opacity: 0, x: 20, rotate: 14 }}
              animate={{ opacity: 1, x: 0, rotate: 12 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              whileHover={{
                y: -12,
                rotate: 10,
                transition: { duration: 0.3, ease: EASE },
              }}
              className="relative overflow-hidden cursor-pointer"
              style={{
                width: "clamp(90px, 28vw, 130px)",
                height: "clamp(120px, 38vw, 175px)",
                borderRadius: 14,
                marginBottom: 28,
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                zIndex: 1,
                marginLeft: -18,
              }}
            >
              <Image
                src="/profile_4.png"
                fill
                priority
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)",
                }}
              />
            </motion.div>
          </div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32, ease: EASE }}
            className="flex flex-col items-center gap-1 text-center relative z-10 px-6"
          >
            <p className="text-white/70 text-[15px] font-medium tracking-[-0.2px]">
              Your story begins when you show up.
            </p>
            <p className="text-white/25 text-sm tracking-[-0.1px]">
              Find your first night or make one.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
            className="flex items-center gap-3 relative z-10 px-6 w-full justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex-1 max-w-40 px-4 py-2.5 text-sm font-medium tracking-[-0.1px] cursor-pointer rounded-md transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.9)",
                color: "#111111",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              Find your first night
            </motion.button>

            <div
              className="w-1 h-1 rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex-1 max-w-40 px-4 py-2.5 text-sm font-medium tracking-[-0.1px] cursor-pointer rounded-md transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Curate your own event
            </motion.button>
          </motion.div>
        </div>
      )}
    </section>
  );
}

export default Feed;
