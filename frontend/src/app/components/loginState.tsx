import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoginForm from "./loginForm";
import InviteForm from "./inviteForm";
import Image from "next/image";

function LoginState() {
  const [active, setActive] = useState<"login" | "invite">("login");
  const [loginPhase, setLoginPhase] = useState<"form" | "verify" | "success">(
    "form"
  );
  const [invitePhase, setInvitePhase] = useState<"form" | "verify" | "success">(
    "form"
  );

  return (
    <motion.div layout className="flex flex-col items-center">
      <Image
        hidden={loginPhase === "success" || invitePhase === "success"}
        src="/brew-logo.png"
        width={80}
        height={80}
        alt="Brew Logo"
        priority
        className="mx-auto z-10 w-auto h-auto"
      />

      <motion.div
        layout
        className={`${
          loginPhase === "success" || invitePhase === "success"
            ? "bg-transparent"
            : "bg-black/35 backdrop-blur-2xl border border-white/20 shadow-2xl "
        }  m-4  overflow-hidden max-w-sm w-full  p-8 rounded-md `}
      >
        <div
          hidden={loginPhase === "success" || invitePhase === "success"}
          className="max-w-2xl relative w-full mx-auto flex bg-white/10 my-4 justify-evenly items-center text-sm font-medium border border-white/15 shadow p-2 rounded-full "
        >
          <div
            className={`absolute bg-black rounded-full transition-all duration-300 p-2 w-1/2 h-[calc(100%)]  shadow-lg ${
              active === "login" ? "left-0" : "left-1/2"
            }`}
          />
          <button
            onClick={() => setActive("login")}
            className={`relative z-10 flex-1 text-center cursor-pointer py-2 text-sm font-medium ${
              active === "login" ? "text-white" : "text-white/70"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActive("invite")}
            className={`relative z-10 flex-1 text-center cursor-pointer py-2 text-sm font-medium ${
              active === "invite" ? "text-white" : "text-white/70"
            }`}
          >
            Request Invite
          </button>
        </div>
        {}
        <AnimatePresence mode="popLayout">
          {active === "login" ? (
            <LoginForm state={loginPhase} setState={setLoginPhase} />
          ) : (
            <InviteForm state={invitePhase} setState={setInvitePhase} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default LoginState;
