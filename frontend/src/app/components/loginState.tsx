import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import LoginForm from "./loginForm";
import InviteForm from "./inviteForm";
import Asterisk from "./icons/AsterikIcon";

interface ActiveStateProp {
  active: "login" | "invite";
  setActive: (active: "login" | "invite") => void;
  isMobile: boolean;
  redirect?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function LoginState({ active, setActive, isMobile, redirect }: ActiveStateProp) {
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
      sub: "B R 3 W is invite-only. Tell us who you are.",
    },
  }[active];

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col items-center w-full max-w-sm gap-5"
        style={{
          background: isMobile ? "rgba(var(--bg),0.95)" : "rgba(var(--bg),0.85)",
          border: "1px solid rgba(var(--fg),0.07)",
          borderRadius: 16,
          padding: "36px 24px",
          backdropFilter: isMobile ? "none" : "blur(20px)",
          position: "relative",
          overflow: "hidden",
          maxHeight: "90svh",
        }}
      >
        {/* Top shimmer */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(var(--fg),0.08), transparent)",
          }}
        />

        {/* Logo + Private Beta */}
        <motion.div
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, layout: { duration: 0.35, ease: EASE } }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[3px] uppercase text-black/25 dark:text-white/25 font-medium">
            Private Beta
          </span>
          {!isSuccess && (
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full"
              style={{
                background: "rgba(var(--fg),0.06)",
                border: "1px solid rgba(var(--fg),0.1)",
              }}
            >
              <Asterisk size={18} color="rgba(var(--fg),0.7)" />
            </div>
          )}
        </motion.div>

        {/* Header — hide on success */}
        <AnimatePresence mode="wait">
          {!isSuccess && (
            <motion.div
              key={`${active}-${loginPhase}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <h2 className="text-black dark:text-white text-lg font-medium tracking-[-0.3px]">
                {headerText.title}
              </h2>
              <p className="text-black/30 dark:text-white/30 text-sm tracking-[-0.1px]">
                {headerText.sub}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle — hide on success */}
        <AnimatePresence>
          {!isSuccess && (
            <motion.div
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                layout: { duration: 0.35, ease: EASE },
              }}
              className="relative w-full flex items-center p-1 rounded-md"
              style={{
                background: "rgba(var(--fg),0.04)",
                border: "1px solid rgba(var(--fg),0.08)",
              }}
            >
              <motion.div
                className="absolute top-1 bottom-1 rounded-sm"
                animate={{ left: active === "login" ? 4 : "50%" }}
                transition={{ duration: 0.28, ease: EASE }}
                style={{
                  width: "calc(50% - 4px)",
                  background: "rgba(var(--fg),0.08)",
                  border: "1px solid rgba(var(--fg),0.1)",
                }}
              />
              <button
                onClick={() => setActive("login")}
                className={`relative z-10 flex-1 text-center cursor-pointer py-1.5 text-xs font-medium transition-colors duration-150 ${
                  active === "login" ? "text-black dark:text-white" : "text-black/35 dark:text-white/35"
                }`}
              >
                I have an invite
              </button>
              <button
                onClick={() => setActive("invite")}
                className={`relative z-10 flex-1 text-center cursor-pointer py-1.5 text-xs font-medium transition-colors duration-150 ${
                  active === "invite" ? "text-black dark:text-white" : "text-black/35 dark:text-white/35"
                }`}
              >
                Request Access
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider — hide on success */}
        <AnimatePresence>
          {!isSuccess && (
            <motion.div
              layout="position"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                layout: { duration: 0.35, ease: EASE },
              }}
              className="w-full"
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(var(--fg),0.06), transparent)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.div
          layout="position"
          transition={{ duration: 0.35, ease: EASE }}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            {active === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                <LoginForm state={loginPhase} setState={setLoginPhase} redirect={redirect} />
              </motion.div>
            ) : (
              <motion.div
                key="invite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                <InviteForm
                  state={invitePhase}
                  setState={setInvitePhase}
                  setIsLoading={setIsLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}

export default LoginState;
