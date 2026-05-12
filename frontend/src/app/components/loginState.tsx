import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import LoginForm from "./loginForm";
import InviteForm from "./inviteForm";
import Asterisk from "./icons/AsterikIcon";

interface ActiveStateProp {
  active: "login" | "invite";
  setActive: (active: "login" | "invite") => void;
  isMobile: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function LoginState({ active, setActive, isMobile }: ActiveStateProp) {
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
    <LayoutGroup>
      <motion.div
        layout="position"
        transition={{ duration: 0.3, ease: EASE }}
        className="flex flex-col items-center w-full max-w-sm gap-5"
        style={{
          background: isMobile ? "rgba(8,8,8,0.95)" : "rgba(8,8,8,0.85)",
          border: "1px solid rgba(255,255,255,0.07)",
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
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[3px] uppercase text-white/25 font-medium">
            Private Beta
          </span>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Asterisk size={18} color="rgba(255,255,255,0.7)" />
          </div>
        </motion.div>

        {/* Header — hide on success */}
        <AnimatePresence mode="wait">
          {!isSuccess && (
            <motion.div
              key={`${active}-${loginPhase}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <h2 className="text-white text-lg font-medium tracking-[-0.3px]">
                {headerText.title}
              </h2>
              <p className="text-white/30 text-sm tracking-[-0.1px]">
                {headerText.sub}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle — hide on success */}
        <AnimatePresence>
          {!isSuccess && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative w-full flex items-center p-1 rounded-md"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <motion.div
                className="absolute top-1 bottom-1 rounded-sm"
                animate={{ left: active === "login" ? 4 : "50%" }}
                transition={{ duration: 0.2, ease: EASE }}
                style={{
                  width: "calc(50% - 4px)",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <button
                onClick={() => setActive("login")}
                className={`relative z-10 flex-1 text-center cursor-pointer py-1.5 text-xs font-medium transition-colors duration-150 ${
                  active === "login" ? "text-white" : "text-white/35"
                }`}
              >
                I have an invite
              </button>
              <button
                onClick={() => setActive("invite")}
                className={`relative z-10 flex-1 text-center cursor-pointer py-1.5 text-xs font-medium transition-colors duration-150 ${
                  active === "invite" ? "text-white" : "text-white/35"
                }`}
              >
                Request Access
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider — hide on success */}
        {!isSuccess && (
          <motion.div
            layout
            className="w-full"
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            }}
          />
        )}

        {/* Form */}
        <motion.div layout className="w-full">
          <AnimatePresence mode="popLayout">
            {active === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE }}
              >
                <LoginForm state={loginPhase} setState={setLoginPhase} />
              </motion.div>
            ) : (
              <motion.div
                key="invite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE }}
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
