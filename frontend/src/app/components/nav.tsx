"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToggleState } from "../utils/toggleState";
import { useOutsideAlerter } from "../utils/outsideAlert";
import { ScrollLock } from "../utils/scrollLock";
import { motion, AnimatePresence, Variants } from "motion/react";
import {
  CloseIcon,
  MenuIcon,
  PinIcon,
  UsersPlusIcon,
  SpinnerIcon,
} from "./icons";

export default function Nav() {
  const path = usePathname();

  const ref = useRef<HTMLDivElement>(null);

  const [openNav, setOpenNav] = useState<boolean>(false);
  useOutsideAlerter(ref, () => setOpenNav(false));

  // close on path change
  useEffect(() => {
    setOpenNav(false);
  }, [path]);

  ScrollLock(openNav);

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
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
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -8,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-20 top-0 flex items-center mt-8 z-40"
      >
        {/* Main Nav Container */}
        <motion.div
          whileHover={{
            backgroundColor: "rgba(43, 43, 43, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex items-center shadow-lg px-4 py-2.5 backdrop-blur-2xl bg-[#2b2b2b]/25 rounded-md border border-white/10 gap-x-4"
        >
          <Link
            href="/pulse"
            className="text-2xl font-normal text-white/90 hover:text-white transition-colors duration-200"
          >
            brew
          </Link>

          <motion.button
            onClick={() => ToggleState(setOpenNav)}
            whileHover={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-8 h-8 bg-black/20 shadow-lg cursor-pointer flex justify-center items-center rounded-md border border-white/10"
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
              className="absolute z-50 top-0 left-0 mt-18 border border-white/10 backdrop-blur-3xl bg-[#1c1c1c]/95 rounded-lg w-64 shadow-2xl shadow-black/40 overflow-hidden"
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

                  {/* <motion.li variants={itemVariants}>
                    <div
                      className={`group relative flex items-center gap-x-4 px-4 py-3.5 rounded-md cursor-pointer transition-all duration-200 ${
                        path !== "/manage" && path !== "/pulse"
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white/90"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <UsersPlusIcon size={22} color="currentColor" />
                      </motion.div>
                      <span className="text-sm font-medium">Create</span>
                      {path !== "/manage" && path !== "/pulse" && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-white/5 rounded-md border border-white/10"
                          transition={{
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      )}
                    </div>
                  </motion.li> */}

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
      <AnimatePresence>
        {openNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed w-full h-screen bg-linear-to-br from-black/80 via-[#19535F]/20 to-[#98473E]/20 inset-0 backdrop-blur-xl z-30 overflow-hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
