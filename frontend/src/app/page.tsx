"use client";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import LoginState from "./components/loginState";
import { motion, AnimatePresence } from "motion/react";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import Plasma from "./components/Plasma";

const EASE = [0.16, 1, 0.3, 1] as const;

type AuthPhase = "authenticating" | "almost" | "brand" | "confirmed" | "ready";

export default function Login() {
  const [transition, setTransition] = useState<boolean>(false);
  const [active, setActive] = useState<"login" | "invite">("login");
  const [authPhase, setAuthPhase] = useState<AuthPhase>("authenticating");
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

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
        setTimeout(() => setAuthPhase("almost"), 400);
        setTimeout(() => setAuthPhase("brand"), 1000);
        setTimeout(() => setAuthPhase("confirmed"), 1800);
        setTimeout(() => router.replace("/pulse"), 3000);
      } else {
        setTransition(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Private Beta */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="fixed top-6 left-6 flex items-center gap-2 z-50"
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.3)" }}
        />
        <span className="text-[10px] tracking-[3px] uppercase text-white/25 font-medium">
          Private Beta
        </span>
      </motion.div>

      <section className="relative h-screen flex justify-center items-center overflow-hidden bg-[#0c0c0c]">
        {/* Background */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 0,
            willChange: isMobile ? undefined : "transform",
          }}
        >
          {isMobile ? (
            // BR3W mobile background — static, no GPU cost
            <div
              className="w-full h-full"
              style={{
                background: "#0c0c0c",
              }}
            >
              {/* Bottom-left warm ember */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-10%",
                  left: "-10%",
                  width: "70%",
                  height: "65%",
                  background:
                    "radial-gradient(ellipse, rgba(255,80,30,0.18) 0%, rgba(180,50,10,0.08) 40%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              {/* Top-right cool shadow */}
              <div
                style={{
                  position: "absolute",
                  top: "-5%",
                  right: "-10%",
                  width: "60%",
                  height: "55%",
                  background:
                    "radial-gradient(ellipse, rgba(18,18,18,0.9) 0%, rgba(10,10,10,0.5) 40%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />
              {/* Center subtle glow */}
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  height: "40%",
                  background:
                    "radial-gradient(ellipse, rgba(255,60,20,0.06) 0%, transparent 65%)",
                  filter: "blur(50px)",
                }}
              />
            </div>
          ) : (
            <Plasma
              color="#ff6b35"
              speed={0.6}
              direction="forward"
              scale={1.1}
              opacity={0.5}
              mouseInteractive={false}
            />
          )}
        </div>

        {/* Vignette — stronger on edges */}
        {/* Vignette — desktop only */}
        {!isMobile && (
          <>
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.65) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.3) 100%)",
              }}
            />
          </>
        )}

        <AnimatePresence mode="wait">
          {/* Authenticated */}
          {user?.id && !transition && (
            <motion.div
              key="auth-flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="z-10 flex flex-col items-center gap-4"
            >
              <div className="flex flex-col items-center gap-1.5">
                <h1 className="text-[24px] tracking-[4px] uppercase text-white/60">
                  br3w
                </h1>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={authPhase}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className={`text-sm tracking-[-0.1px] ${
                      authPhase === "confirmed"
                        ? "text-white/70"
                        : "text-white/30"
                    }`}
                  >
                    {phrases[authPhase]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <Loading />
            </motion.div>
          )}

          {/* Unauthenticated splash */}
          {!transition && !user?.id && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="z-10 flex flex-col items-center gap-4"
            >
              <div className="flex flex-col items-center gap-1.5">
                <h1 className="text-[24px] tracking-[4px] uppercase text-white/60">
                  br3w
                </h1>
                <p className="text-sm text-white/25 tracking-[-0.1px]">
                  If you know, you know.
                </p>
              </div>
              <Loading />
            </motion.div>
          )}

          {/* Login form */}
          {transition && !user?.id && (
            <motion.div
              key="login-state"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="z-10 w-full flex justify-center px-4"
            >
              <LoginState
                isMobile={isMobile}
                active={active}
                setActive={setActive}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
