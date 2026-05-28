"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ToggleState } from "../utils/toggleState";
import { useOutsideAlerter } from "../utils/outsideAlert";
import { ScrollLock } from "../utils/scrollLock";
import { motion, AnimatePresence, Variants } from "motion/react";
import { CloseIcon, MenuIcon, PinIcon, SpinnerIcon } from "./icons";
import { openEventCard, useUIStore } from "@/stores/store";
import { useUserStore } from "@/stores/useUserStore";
export default function Nav() {
  const path = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [openNav, setOpenNav] = useState<boolean>(false);
  useOutsideAlerter(ref, () => setOpenNav(false));

  useEffect(() => {
    setOpenNav(false);
  }, [path]);

  ScrollLock(openNav);

  const { clearUser } = useUserStore();

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
        delayChildren: 0.1,
        staggerChildren: 0.06,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const isEventOpen = openEventCard((state) => state.isEventOpen);
  const { pulseOpen } = useUIStore();

  if (isEventOpen || pulseOpen) return null;

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute left-4 top-4 flex items-center ${openNav ? "z-200" : "z-60"}`}
      >
        {/* Main Nav Container */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center px-4 py-2.5 rounded-md gap-x-4"
        >
          <Link
            href="/pulse"
            className="text-lg tracking-[4px] font-medium text-white/90 transition-colors duration-200"
          >
            BR3W
          </Link>

          <motion.button
            onClick={() => ToggleState(setOpenNav)}
            whileHover={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-8 h-8 shadow-lg cursor-pointer flex justify-center items-center rounded-md border border-white/20"
          >
            <AnimatePresence mode="wait">
              {openNav ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex"
                >
                  <CloseIcon size={16} color="currentColor" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex"
                >
                  <MenuIcon size={16} color="currentColor" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {openNav && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute  top-0 left-0 mt-18 rounded-lg w-64 overflow-hidden"
            >
              <div className="p-4">
                <motion.ul className="flex flex-col gap-y-1">
                  <motion.li variants={itemVariants}>
                    <Link
                      href="/pulse"
                      className={`group relative flex items-center gap-x-4 px-4 py-3.5 rounded-md transition-all duration-200 ${
                        path === "/pulse"
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white/90"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <PinIcon size={22} color="currentColor" />
                      </motion.div>
                      <span className="text-sm font-medium">Pulse</span>
                      {path === "/pulse" && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-white/5 rounded-md border border-white/10"
                          transition={{
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      )}
                    </Link>
                  </motion.li>

                  <motion.li variants={itemVariants}>
                    <Link
                      href="/manage"
                      className={`group relative flex items-center gap-x-4 px-4 py-3.5 rounded-md transition-all duration-200 ${
                        path === "/manage"
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white/90"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <SpinnerIcon size={22} color="currentColor" />
                      </motion.div>
                      <span className="text-sm font-medium">Manage</span>
                      {path === "/manage" && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-white/5 rounded-md border border-white/10"
                          transition={{
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      )}
                    </Link>
                  </motion.li>

                  {/* Divider */}
                  <motion.li variants={itemVariants}>
                    <div className="h-px bg-white/5 my-1" />
                  </motion.li>

                  {/* Logout */}
                  <motion.li variants={itemVariants}>
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-x-4 px-4 py-3.5 rounded-md text-white/30 hover:text-red-400/70 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span className="text-sm font-medium">Sign out</span>
                    </motion.button>
                  </motion.li>
                </motion.ul>
              </div>

              {/* Bottom Accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent origin-left"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Backdrop Overlay */}
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {openNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed w-full h-screen inset-0 z-50 overflow-hidden"
            style={{ background: "#0c0c0c" }}
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
            {/* Top-right neutral dark */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
