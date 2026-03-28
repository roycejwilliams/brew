"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import Attended from "./attended";
import Hosted from "./hosted";
import Suggested from "./suggested";

interface FeedProp {
  id: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function Feed({ id }: FeedProp) {
  const [completedProfile, setCompletedProfile] = useState<boolean>(false);

  return (
    <section className="w-full mt-8 h-full flex justify-center items-center">
      {completedProfile ? (
        <div className="flex flex-col gap-y-16 w-full">
          <Attended id={id} />
          <Hosted id={id} />
          <Suggested id={id} />
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
                width: 130,
                height: 175,
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
                width: 148,
                height: 200,
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
                width: 130,
                height: 175,
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
            className="flex flex-col items-center gap-1 text-center relative z-10"
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
            className="flex items-center gap-3 relative z-10"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="px-5 py-2.5 text-sm font-medium tracking-[-0.1px] cursor-pointer rounded-md transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.9)",
                color: "#111111",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              Find your first night
            </motion.button>

            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="px-5 py-2.5 text-sm font-medium tracking-[-0.1px] cursor-pointer rounded-md transition-all duration-200"
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
