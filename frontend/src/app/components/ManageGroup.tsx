"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Tools from "./Tools";
import ManageMoments from "./manageMoments";
import ManageCircle from "./manageCircle";
import ManageReferral from "./manageReferral";

type ManageView = "moments" | "circle" | "referral" | null;

const EASE = [0.16, 1, 0.3, 1] as const;

function Manage() {
  const [manage, setManage] = useState<ManageView>("moments");

  return (
    <section className="w-full h-dvh bg-[#0c0c0c] flex overflow-hidden relative">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0"
        style={{
          width: 800,
          height: 400,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      <Tools manage={manage} setManage={setManage} />

      <div className="flex-1 overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          {manage === "moments" && (
            <motion.div
              key="moments"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <ManageMoments />
            </motion.div>
          )}
          {manage === "circle" && (
            <motion.div
              key="circle"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <ManageCircle />
            </motion.div>
          )}
          {manage === "referral" && (
            <motion.div
              key="referral"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <ManageReferral />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Manage;
