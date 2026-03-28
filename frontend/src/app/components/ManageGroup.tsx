import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Tools from "./Tools";
import ManageMoments from "./ManageMoments";
import ManageCircle from "./ManageCircle";
import ManageReferral from "./ManageReferral";

type ManageView = "moments" | "circle" | "referral" | null;

const viewProps = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

function Manage() {
  const [manage, setManage] = useState<ManageView>("moments");

  return (
    <section className="w-full h-screen bg-linear-to-b to-black flex from-[#2b2b2b] overflow-hidden relative pl-56">
      <Tools manage={manage} setManage={setManage} />

      <AnimatePresence mode="wait">
        {manage === "moments" && (
          <motion.div
            key="moments"
            className="flex-1 shrink-0 flex"
            {...viewProps}
          >
            <ManageMoments />
          </motion.div>
        )}
        {manage === "circle" && (
          <motion.div
            key="circle"
            className="flex-1 shrink-0 flex"
            {...viewProps}
          >
            <ManageCircle />
          </motion.div>
        )}
        {manage === "referral" && (
          <motion.div
            key="referral"
            className="flex-1 shrink-0 flex"
            {...viewProps}
          >
            <ManageReferral />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Manage;
