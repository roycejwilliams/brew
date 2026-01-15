"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MapLocation,
  SendMessageDm,
  UserGroupAccounts,
  MenuHambuger,
  XCloseDelete,
} from "react-basicons";

import { usePathname } from "next/navigation";
import { ToggleState } from "../utils/toggleState";
import { useOutsideAlerter } from "../utils/outsideAlert";
import { ScrollLock } from "../utils/scrollLock";
import { motion, AnimatePresence, Variants, rgba } from "motion/react";

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
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      maxHeight: "600px",
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {" "}
      <motion.div
        initial={{ backgroundPosition: "0% 50%" }}
        whileHover={{
          backgroundPosition: "100% 50%",
          backgroundColor:
            "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,${opacityValue} / 100), rgba(0,0,0,0))",
        }}
        whileTap={{
          scale: 0.95,
          backgroundColor: "",
        }}
        transition={{
          backgroundPosition: { duration: 0.4, ease: "easeInOut" },
        }}
        ref={ref}
        className="absolute left-20 top-0 flex items-center mt-8 z-40 shadow-md px-4 py-2.5 bg-linear-to-r border border-white/10 backdrop-blur-2xl bg-[#2b2b2b]/25 rounded-sm gap-x-4"
      >
        <Link href="/pulse" className=" text-2xl font-normal">
          brew
        </Link>
        <button
          onClick={() => ToggleState(setOpenNav)}
          className="max-w-lg w-8 h-8 bg-black/20 shadow-2xl cursor-pointer flex justify-center items-center rounded-sm border border-white/10"
        >
          <AnimatePresence mode="wait">
            {openNav ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-flex"
              >
                <XCloseDelete color="currentColor" size={16} weight={0.5} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-flex"
              >
                <MenuHambuger color="currentColor" size={16} weight={0.5} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        {openNav && (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute z-50 top-0 left-0 mt-16 border border-white/5  backdrop-blur-3xl rounded-sm w-[230px] flex justify-center items-center shadow-2xl  px-4 py-8 "
            >
              <motion.ul className="flex flex-col text-sm gap-y-8">
                <motion.li variants={itemVariants}>
                  <Link
                    href="/pulse"
                    className={`hover:text-white duration-300 flex gap-x-8 items-center px-2 py-4 ${
                      path === "/pulse" ? "text-white" : "text-white/50"
                    }`}
                  >
                    <MapLocation color="currentColor" size={20} />
                    <span>Pulse</span>
                  </Link>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <div className="hover:text-white  duration-300 flex gap-x-8 items-center px-2 py-4">
                    <UserGroupAccounts color="currentColor" size={20} />
                    <span>Create</span>
                  </div>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <Link
                    href="/inbox"
                    className={`hover:text-white duration-300 flex gap-x-8 items-center px-2 py-4 ${
                      path === "/inbox" ? "text-white" : "text-white/50"
                    }`}
                  >
                    <SendMessageDm color="currentColor" size={20} />
                    <span>Inbox</span>
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.div>
          </>
        )}
      </motion.div>
      <AnimatePresence>
        {openNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="fixed w-full h-screen bg-linear-to-br from-black/75 via-[#19535F]/25 to-[#98473E]/25 inset-0 backdrop-blur-xl z-30 overflow-hidden"
            ></motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
