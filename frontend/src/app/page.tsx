"use client";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import LoginState from "./components/loginState";
import { motion, AnimatePresence } from "motion/react";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import Plasma from "./components/Plasma";

type AuthPhase = "authenticating" | "almost" | "brand" | "confirmed" | "ready";

export default function Login() {
  const [transition, setTransition] = useState<boolean>(false);
  const [active, setActive] = useState<"login" | "invite">("login");
  const [authPhase, setAuthPhase] = useState<AuthPhase>("authenticating");
  const { user } = useUserStore();
  const router = useRouter();

  const phrases: Record<AuthPhase, string> = {
    authenticating: "Authenticating...",
    almost: "Just a moment.",
    brand: "If you know, you know.",
    confirmed: `Welcome back, ${user?.first_name ?? "you"}.`,
    ready: "",
  };

  useEffect(() => {
    const minDelay = new Promise((res) => setTimeout(res, 2000));
    const pageLoad = new Promise((res) => {
      if (document.readyState === "complete") res(true);
      else window.addEventListener("load", () => res(true));
    });

    Promise.all([minDelay, pageLoad]).then(() => {
      if (user?.id) {
        // authenticated flow — cycle through phrases then redirect
        setTimeout(() => setAuthPhase("almost"), 400);
        setTimeout(() => setAuthPhase("brand"), 1000);
        setTimeout(() => setAuthPhase("confirmed"), 1800);
        setTimeout(() => router.replace("/pulse"), 3000);
      } else {
        setTransition(true);
      }
    });
  }, []);

  return (
    <section
      className={`relative h-screen flex justify-center items-center transition-colors overflow-hidden`}
    >
      <div style={{ width: "100%", height: "100%", position: "absolute" }}>
        <Plasma
          color="#ff6b35"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.5}
          mouseInteractive={false}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* Authenticated flow */}
        {user?.id && !transition && (
          <motion.div
            key="auth-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10 space-y-1"
          >
            <h1 className="text-[30px] font-normal tracking-widest uppercase">
              br3w
            </h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={authPhase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`text-xs font-light tracking-wide ${
                  authPhase === "confirmed" ? "text-white/70" : "text-white/40"
                }`}
              >
                {phrases[authPhase]}
              </motion.p>
            </AnimatePresence>
            <Loading />
          </motion.div>
        )}

        {/* Login flow */}
        {transition && !user?.id && (
          <motion.div
            key="login-state"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="z-50"
          >
            <LoginState active={active} setActive={setActive} />
          </motion.div>
        )}

        {/* Unauthenticated splash */}
        {!transition && !user?.id && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-center z-10 space-y-4"
          >
            <h1 className="text-[30px] font-normal tracking-widest uppercase">
              br3w
            </h1>
            <p className="text-xs font-light">If you know, you know.</p>
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
