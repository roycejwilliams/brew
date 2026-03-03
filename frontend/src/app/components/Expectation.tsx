import React from "react";
import { motion } from "motion/react";
import ExpectationAssistant from "./ExpectationAssistant";

type InviteSelection = "people" | "where" | "share";

interface InviteSelectionProp {
  setInviteSelection: (inviteSelection: InviteSelection) => void;
}

export default function Expectation({
  setInviteSelection,
}: InviteSelectionProp) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center w-full p-6 gap-y-8"
    >
      {/* Assistant */}
      <ExpectationAssistant setInviteSelection={setInviteSelection} />
    </motion.section>
  );
}
