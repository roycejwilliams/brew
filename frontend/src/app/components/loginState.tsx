import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoginForm from "./loginForm";
import InviteForm from "./inviteForm";
import Image from "next/image";

interface ActiveStateProp {
  active: "login" | "invite";
  setActive: (active: "login" | "invite") => void;
}

function LoginState({ active, setActive }: ActiveStateProp) {
  const [loginPhase, setLoginPhase] = useState<"form" | "verify" | "success">(
    "form",
  );
  const [invitePhase, setInvitePhase] = useState<"form" | "pending">("form");
  const [isLoading, setIsLoading] = useState(false);

  const isSuccess =
    loginPhase === "success" || invitePhase === "pending" || isLoading;

  return (
    <motion.div
      layout
      className="flex flex-col items-center w-full max-w-md px-6"
    >
      <AnimatePresence>
        {!isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Image
              src="/brew-logo.png"
              width={65}
              height={65}
              alt="BR3W Logo"
              priority
              className="mx-auto z-10 w-auto h-auto mb-6"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative w-full flex bg-white/5 justify-evenly items-center border border-white/10 p-1 rounded-md mb-2"
          >
            <div
              className={`absolute bg-white/10 rounded-sm transition-all duration-300 w-1/2 h-full ${
                active === "login" ? "left-0" : "left-1/2"
              }`}
            />
            <button
              onClick={() => setActive("login")}
              className={`relative z-10 flex-1 text-center cursor-pointer py-1.5 text-xs font-medium transition-colors ${
                active === "login" ? "text-white" : "text-white/35"
              }`}
            >
              I have an invite
            </button>
            <button
              onClick={() => setActive("invite")}
              className={`relative z-10 flex-1 text-center cursor-pointer py-1.5 text-xs font-medium transition-colors ${
                active === "invite" ? "text-white" : "text-white/35"
              }`}
            >
              Request Access
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {active === "login" ? (
          <LoginForm state={loginPhase} setState={setLoginPhase} />
        ) : (
          <InviteForm
            state={invitePhase}
            setState={setInvitePhase}
            setIsLoading={setIsLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default LoginState;
