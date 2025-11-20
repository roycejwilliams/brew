"use client";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import LoginState from "./components/loginState";
import { motion, AnimatePresence } from "motion/react";

export default function Login() {
  const [transition, setTransition] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransition(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex justify-center items-center transition-colors duration-500 bg-linear-to-b from-[#19535F] to-[#98473E] overflow-hidden">
      <div
        className="absolute inset-0  before:absolute before:left-[20%] before:h-[50%] before:w-[50%] before:origin-[60%] before:animate-blob before:rounded-3xl before:bg-linear-to-br before:from-[#19535F] before:to-[#98473E] before:blur-[50px] before:brightness-125 
                      after:absolute after:left-[40%] after:top-[30%] after:h-[80%] after:w-[70%] after:origin-[60%] after:animate-blob-reverse after:rounded-3xl after:bg-linear-to-br after:from-[#19535F] after:to-[#98473E] after:blur-[50px] after:brightness-125"
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
            <LoginState />
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
            className={`text-center z-10`}
          >
            <h1 className="text-6xl font-normal">brew</h1>
            <p className="text-xs font-medium">If you know, you know.</p>
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
