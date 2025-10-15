import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoginForm from "./loginForm";
import InviteForm from "./inviteForm";
import Image from "next/image";

function LoginState() {
  const [active, setActive] = useState<"login" | "invite">("login");

  return (
    <motion.div layout className="flex flex-col items-center">
      <Image
        src="/brew-logo.png"
        width={80}
        height={80}
        alt="Brew Logo"
        priority
        className="mx-auto z-10"
      />

      <div className="bg-black/35 m-4 shadow-2xl overflow-hidden max-w-sm backdrop-blur-2xl p-8  rounded-md border border-white/20">
        <div className="max-w-2xl relative w-full mx-auto flex bg-white/10 my-4 justify-evenly items-center text-sm font-medium border border-white/15 shadow p-2 rounded-full">
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
        <AnimatePresence mode="wait">
          {active === "login" ? <LoginForm /> : <InviteForm />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default LoginState;
