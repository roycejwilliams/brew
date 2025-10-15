import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

function InviteForm() {
  const [phase, setPhase] = useState<"form" | "verify" | "success">("form");

  return (
    <AnimatePresence mode="wait">
      {phase === "form" && (
        <motion.div
          key="form"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
        >
          <h2 className="text-center mt-8 text-lg">Verify your number</h2>
          <p className="text-center mt-4 text-sm">
            We take privacy very seriously and will never share your phone
            number with anyone.
          </p>
          <input
            type="text"
            id="phone"
            className=" border mt-8 w-full px-4 border-gray-300/30 text-gray-900 text-sm rounded-full placeholder:text-xs block mx-auto p-2.5 bg-transparent placeholder:text-white/50 focus:border-none"
            placeholder="phone"
            required
          />

          <div className="flex items-center gap-x-4 mt-8">
            <p className="text-xs w-1/4 text-left flex-1">
              By continuing, you agree to Brew&apos;s Terms & Privacy Policy.
            </p>
            <button
              onClick={() => setPhase("verify")}
              className="rounded-full w-1/3 py-4 bg-[#19535F] shadow-md cursor-pointer"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {phase === "verify" && (
        <motion.div
          key="verify"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
        >
          <h2 className="text-center mt-8 text-lg">
            Enter the 6-digit verification code
          </h2>

          <div className="flex items-center gap-x-4 mt-8">
            <p className="text-xs  text-center flex-1">
              By continuing, you agree to Brew&apos;s Terms & Privacy Policy.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InviteForm;
