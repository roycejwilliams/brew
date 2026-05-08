import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoginForm from "./loginForm";
import InviteForm from "./inviteForm";
import Asterisk from "./icons/AsterikIcon";

interface ActiveStateProp {
  active: "login" | "invite";
  setActive: (active: "login" | "invite") => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function LoginState({ active, setActive }: ActiveStateProp) {
  const [loginPhase, setLoginPhase] = useState<"form" | "verify" | "success">(
    "form",
  );
  const [invitePhase, setInvitePhase] = useState<"form" | "pending">("form");
  const [isLoading, setIsLoading] = useState(false);

  const isSuccess =
    loginPhase === "success" || invitePhase === "pending" || isLoading;

  const headerText = {
    login: {
      title:
        loginPhase === "verify"
          ? "Check your inbox."
          : loginPhase === "success"
            ? "You're in."
            : "Welcome back.",
      sub:
        loginPhase === "verify"
          ? "Enter the code we sent you."
          : loginPhase === "success"
            ? "Taking you there now."
            : "Your circle. Your vision. Your momentum.",
    },
    invite: {
      title: "Request Access.",
      sub: "BR3W is invite-only. Tell us who you are.",
    },
  }[active];

  return (
    <>
      {/* Private Beta Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed top-6 left-6 flex items-center gap-2"
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.3)" }}
        />
        <span className="text-[10px] tracking-[3px] uppercase text-white/75">
          Private Beta
        </span>
      </motion.div>
      <motion.div
        layout
        className="flex flex-col items-center w-full max-w-md px-6 py-24 gap-6"
      >
        {/* Logo — never remounts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Asterisk size={18} color="rgba(255,255,255,0.7)" />
        </motion.div>

        {/* Header — animates text on state change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${loginPhase}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <h2 className="text-white text-lg font-medium tracking-[-0.3px]">
              {headerText.title}
            </h2>
            <p className="text-white/30 text-sm tracking-[-0.1px]">
              {headerText.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Toggle — hides on success */}
        <AnimatePresence>
          {!isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="relative w-full flex bg-white/5 justify-evenly items-center border border-white/10 p-1 rounded-md"
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

        {/* Divider */}
        <div
          className="w-full"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
          }}
        />

        {/* Form content — only this swaps */}
        <div className="w-full">
          <AnimatePresence mode="popLayout">
            {active === "login" ? (
              <LoginForm
                key="login"
                state={loginPhase}
                setState={setLoginPhase}
              />
            ) : (
              <InviteForm
                key="invite"
                state={invitePhase}
                setState={setInvitePhase}
                setIsLoading={setIsLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

export default LoginState;
