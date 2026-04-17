"use client";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import LoginState from "./components/loginState";
import { motion, AnimatePresence } from "motion/react";

export default function Login() {
  const [transition, setTransition] = useState<boolean>(false);
  const [active, setActive] = useState<"login" | "invite">("login");

  useEffect(() => {
    //the delay for the branding to show.
    const minDelay = new Promise((res) => setTimeout(res, 2000));
    //loads the branding until readyState is complete
    const pageLoad = new Promise((res) => {
      if (document.readyState === "complete") res(true);
      else window.addEventListener("load", () => res(true));
    });

    //take a array of promises and wait for all of them to resolve
    Promise.all([minDelay, pageLoad]).then(() => setTransition(true));
  }, []);

  return (
    <section
      className={`relative min-h-screen flex justify-center items-center transition-colors duration-500 bg-linear-to-b ${active === "login" && "to-[#19535F]"} ${active === "invite" && "to-[#98473E]"}  from-black overflow-hidden`}
    >
      <div
        className={`absolute top-[10%] left-[15%] w-[40%] h-[40%] rounded-full  ${active === "login" && "bg-[#19535F]"} ${active === "invite" && "bg-[#98473E]"} opacity-40 blur-[80px] pointer-events-none   animate-blob`}
      />
      <div
        className={`absolute top-[40%] left-[50%] w-[50%] h-[50%] rounded-full ${active === "login" && "bg-[#19535F]"} ${active === "invite" && "bg-[#98473E]"} opacity-30 blur-[100px] pointer-events-none   animate-blob-reverse`}
      />
      <div
        className={`absolute top-[60%] left-[10%] w-[35%] h-[35%] rounded-full ${active === "login" && "bg-[#19535F]"} ${active === "invite" && "bg-[#98473E]"} opacity-25 blur-[80px] pointer-events-none   animate-blob`}
        style={{ animationDelay: "2s" }}
      />
      <AnimatePresence mode="wait">
        {transition ? (
          <motion.div
            key="login-state"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            <LoginState active={active} setActive={setActive} />
          </motion.div>
        ) : (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className={`text-center z-10 space-y-4`}
          >
            <h1 className="text-[35px] font-medium uppercase">br3w</h1>
            <p className="text-xs font-light">If you know, you know.</p>
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
