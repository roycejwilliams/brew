"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import Feed from "./feed";
import Image from "next/image";
import { motion } from "motion/react";

interface DashboardProp {
  userId: string;
}

const COMPLETION = 3;
const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07, ease: EASE },
});

function Dashboard({ userId }: DashboardProp) {
  return (
    <section className="min-h-screen bg-[#111111] relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 900,
          height: 500,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 35%, transparent 65%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto p-4 mt-4  pb-20">
        {/* Profile header */}
        <div className="flex items-start justify-between gap-8">
          {/* Left — avatar + info */}
          <div className="flex gap-6 items-start">
            {/* Avatar */}
            <motion.div {...stagger(0)} className="relative shrink-0">
              <div
                className="w-24 h-24 rounded-xl overflow-hidden relative"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src="/profile_4.png"
                  fill
                  priority
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Online dot */}
              <div
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full"
                style={{
                  background: "#4ade80",
                  border: "2px solid #111111",
                  boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                }}
              />
            </motion.div>

            {/* Info */}
            <div className="flex flex-col gap-3 pt-1">
              <motion.div {...stagger(1)}>
                <h1
                  className="text-white font-semibold leading-none"
                  style={{ fontSize: 22, letterSpacing: "-0.5px" }}
                >
                  Lorem Ipsum
                </h1>
                <p className="text-white/40 text-sm mt-0.5 tracking-[-0.1px]">
                  @username
                </p>
              </motion.div>

              {/* Location */}
              <motion.div
                {...stagger(2)}
                className="flex items-center gap-1.5 text-white/30 text-xs tracking-[-0.1px]"
              >
                <FontAwesomeIcon icon={faMapPin} className="text-[10px]" />
                Los Angeles, California
              </motion.div>

              {/* Bio */}
              <motion.p
                {...stagger(3)}
                className="text-white/50 text-sm tracking-[-0.1px] leading-relaxed max-w-xs"
              >
                Notes about me go here.
              </motion.p>

              {/* Socials */}
              <motion.div {...stagger(4)} className="flex items-center gap-3">
                {[
                  { icon: faInstagram, href: "/" },
                  { icon: faXTwitter, href: "/" },
                  { icon: faLinkedin, href: "/" },
                ].map(({ icon, href }, i) => (
                  <Link
                    key={i}
                    href={href}
                    className="text-white/25 hover:text-white/70 transition-colors duration-200 text-base"
                  >
                    <FontAwesomeIcon icon={icon} />
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right — connections + completion */}
          <div className="flex flex-col items-end gap-4 pt-1 shrink-0">
            {/* Profile completion */}
            <motion.div
              {...stagger(1)}
              className="flex flex-col items-end gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-white/25 text-xs tracking-[-0.1px]">
                  Profile
                </span>
                <span className="text-white/60 text-xs font-medium tracking-[-0.2px]">
                  {COMPLETION}%
                </span>
              </div>
              <div
                className="w-28 h-[3px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "rgba(255,255,255,0.55)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${COMPLETION}%` }}
                  transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                />
              </div>
            </motion.div>

            {/* Active connections */}
            <motion.div
              {...stagger(2)}
              className="flex flex-col items-end gap-2"
            >
              <span className="text-white/25 text-xs tracking-[-0.1px]">
                Active connections
              </span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full"
                      style={{
                        background: `rgba(255,255,255,${0.05 + i * 0.03})`,
                        border: "1.5px solid #111111",
                        marginLeft: i === 0 ? 0 : -10,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      }}
                    />
                  ))}
                </div>
                <span className="text-white/40 text-sm font-medium tracking-[-0.2px]">
                  0
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45, ease: EASE }}
        >
          <Feed id={userId} />
        </motion.div>
      </div>
    </section>
  );
}

export default Dashboard;
