"use client";
import { Suspense, useEffect, useState } from "react";
import Loading from "./components/loading";
import LoginState from "./components/loginState";
import { motion, AnimatePresence } from "motion/react";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter, useSearchParams } from "next/navigation";

const EASE = [0.16, 1, 0.3, 1] as const;

type AuthPhase = "authenticating" | "almost" | "brand" | "confirmed" | "ready";

function LoginContent() {
  const [transition, setTransition] = useState<boolean>(false);
  const [active, setActive] = useState<"login" | "invite">("login");
  const [authPhase, setAuthPhase] = useState<AuthPhase>("authenticating");
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { user } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/pulse";
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    if (tabParam === "invite") setActive("invite");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    document.body.style.overflow = "hidden";
    document.body.style.background =
      "radial-gradient(ellipse at bottom left, rgba(255,80,30,0.22) 0%, transparent 70%), radial-gradient(ellipse at top right, rgba(255,107,53,0.12) 0%, transparent 70%), #0c0c0c";
    return () => {
      document.body.style.overflow = "";
      document.body.style.background = "#0c0c0c";
    };
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
        setTimeout(() => router.replace(redirect), 3000);
      } else {
        setTransition(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative min-h-dvh flex justify-center items-center overflow-hidden bg-[#0c0c0c]">
      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="w-full h-full relative"
          style={{ background: "#0c0c0c" }}
        >
          {/* Primary warm glow — bottom left */}
          <div
            className="absolute animate-drift-slow"
            style={{
              bottom: "-15%",
              left: "-10%",
              width: "75%",
              height: "70%",
              background:
                "radial-gradient(ellipse, rgba(255,80,30,0.22) 0%, rgba(180,50,10,0.08) 40%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          {/* Secondary glow — top right */}
          <div
            className="absolute animate-drift-medium"
            style={{
              top: "-10%",
              right: "-15%",
              width: "65%",
              height: "60%",
              background:
                "radial-gradient(ellipse, rgba(255,107,53,0.12) 0%, rgba(200,60,20,0.04) 45%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          {/* Center ambient glow */}
          <div
            className="absolute animate-drift-center"
            style={{
              top: "25%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              height: "50%",
              background:
                "radial-gradient(ellipse, rgba(255,60,20,0.07) 0%, transparent 60%)",
              filter: "blur(70px)",
            }}
          />
          {/* Subtle cool shadow — top */}
          <div
            className="absolute"
            style={{
              top: "-5%",
              left: "20%",
              width: "60%",
              height: "40%",
              background:
                "radial-gradient(ellipse, rgba(10,10,10,0.8) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
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
              isMobile={isMobile ?? false}
              active={active}
              setActive={setActive}
              redirect={redirect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-[#0c0c0c] flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
