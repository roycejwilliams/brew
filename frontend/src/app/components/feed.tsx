"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Attended from "./attended";
import Hosted from "./hosted";
import {
  useGetAllMomentsOwnedByUser,
  useGetAllMomentsUserIsAttendee,
} from "@/hooks/useMoments";

interface FeedProp {
  completed: number;
  userId: string;
  onCreateMoment?: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function Feed({ completed, userId, onCreateMoment }: FeedProp) {
  const router = useRouter();
  const { data: member } = useGetAllMomentsUserIsAttendee(userId);
  const { data: owner } = useGetAllMomentsOwnedByUser(userId);

  const attended = member?.data.data || [];
  const hosted = owner?.data.data || [];
  const hasMoments = attended.length > 0 || hosted.length > 0;

  return (
    <section className="w-full mt-4 flex flex-col flex-1">
      {completed === 100 && hasMoments ? (
        <div className="flex flex-col gap-y-16 w-full pb-8">
          <Attended id={userId} />
          <Hosted id={userId} />
        </div>
      ) : (
        <div className="relative flex flex-col gap-y-10 flex-1 justify-center items-center w-full">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: -12 }}
              transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
              className="relative overflow-hidden"
              style={{
                width: "clamp(90px, 28vw, 130px)",
                height: "clamp(120px, 38vw, 175px)",
                borderRadius: 14,
                marginBottom: 28,
                border: "1px solid rgba(var(--fg),0.12)",
                boxShadow:
                  "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(var(--fg),0.04)",
                zIndex: 1,
                marginRight: -18,
              }}
            >
              <Image
                src="/profile_2.png"
                fill
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.18, ease: EASE }}
              className="relative overflow-hidden"
              style={{
                width: "clamp(105px, 32vw, 148px)",
                height: "clamp(140px, 42vw, 200px)",
                borderRadius: 16,
                border: "1px solid rgba(var(--fg),0.16)",
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(var(--fg),0.06)",
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 12 }}
              transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
              className="relative overflow-hidden"
              style={{
                width: "clamp(90px, 28vw, 130px)",
                height: "clamp(120px, 38vw, 175px)",
                borderRadius: 14,
                marginBottom: 28,
                border: "1px solid rgba(var(--fg),0.12)",
                boxShadow:
                  "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(var(--fg),0.04)",
                zIndex: 1,
                marginLeft: -18,
              }}
            >
              <Image
                src="/profile_4.png"
                fill
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.28, ease: EASE }}
            className="flex flex-col items-center gap-1 text-center relative z-10 px-6"
          >
            <p
              className="text-[15px] font-medium tracking-[-0.2px]"
              style={{ color: "rgba(var(--fg),0.7)" }}
            >
              Your story begins when you show up.
            </p>
            <p
              className="text-sm tracking-[-0.1px]"
              style={{ color: "rgba(var(--fg),0.25)" }}
            >
              Find your first night or make one.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.35, ease: EASE }}
            className="flex items-center gap-3 relative z-10 px-6 w-full justify-center"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/pulse")}
              className="whitespace-nowrap px-5 py-2.5 text-sm font-medium tracking-[-0.1px] cursor-pointer rounded-xl transition-colors duration-150"
              style={{
                background: "rgba(var(--fg),0.9)",
                color: "rgb(var(--bg))",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              Find your first night
            </motion.button>

            <div
              className="w-1 h-1 rounded-full shrink-0"
              style={{ background: "rgba(var(--fg),0.2)" }}
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onCreateMoment}
              className="whitespace-nowrap px-5 py-2.5 text-sm font-medium tracking-[-0.1px] cursor-pointer rounded-xl transition-colors duration-150"
              style={{
                background: "rgba(var(--fg),0.06)",
                color: "rgba(var(--fg),0.7)",
                border: "1px solid rgba(var(--fg),0.1)",
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
