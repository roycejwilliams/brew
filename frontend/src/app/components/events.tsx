import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NeedsAttention from "./needsAttention";
import Confirmation from "./confirmation";
import Nearby from "./nearby";
import ScopeLocator from "./scopeLocator";
import { ToggleState } from "../utils/toggleState";
import { AnimatePresence } from "motion/react";
import { PinIcon, BellIcon } from "./icons";

interface OpenModal {
  openModal: (type: "notifications") => void;
  id: string;
}

export default function Events({ openModal, id }: OpenModal) {
  const [openScope, setOpenScope] = useState<boolean>(false);

  const openScopeLocator = () => {
    ToggleState(setOpenScope);
  };

  return (
    <section className="absolute top-0 right-0 h-full overflow-y-hidden  max-w-lg  flex   shadow-lg   z-20">
      {/* Actions */}
      <div className=" mx-auto max-w-sm  h-full  border-l border-r border-white/10 backdrop-blur-xl  bg-linear-to-b from-black/30 to-black/10  text-white">
        <div className="flex justify-between w-full h-fit  px-5 py-4  border-white/20">
          <div className=" w-full">
            <h2 className="text-lg mb-1">Pulse</h2>
            <p className="text-xs">Here&apos;s what&apos;s next</p>
          </div>

          <button
            role="notifications"
            onClick={() => openModal("notifications")}
            className="cursor-pointer group transform translate-y-0  hover:-translate-y-1 ease-in-out duration-500  flex flex-col items-center justify-center gap-y-1"
          >
            <div className="w-8 h-8 cursor-pointer   bg-white/10 transform translate-y-0 hover:-translate-y-1 ease-in-out duration-200 backdrop-blur-sm shadow-lg  flex flex-col items-center justify-center border border-white/10 rounded-md">
              <BellIcon size={16} color="currentColor" />
            </div>
            <span className="text-xs opacity-0 group-hover:opacity-100 ease-in-out duration-500">
              Signals
            </span>
          </button>
        </div>
        {/* Location picker */}
        <div className="w-full px-4">
          <div className="px-4 py-1 bg-black rounded-md border border-white/20 shadow flex justify-between items-center">
            <p className="text-xs">San Francisco</p>
            <div className="flex gap-x-4 items-center">
              <span className="text-xs">Tonight</span>
              <button
                role="filter"
                onClick={openScopeLocator}
                className="w-8 h-8 rounded-md cursor-pointer hover:scale-95 duration-300 ease-in-out transition-all bg-[#2b2b2b]/50 backdrop-blur-md shadow-lg border border-white/10 flex justify-center items-center"
              >
                <PinIcon size={16} color="currentColor" />
              </button>
            </div>
          </div>
          <AnimatePresence mode="popLayout">
            {openScope && <ScopeLocator onClose={openScopeLocator} />}
          </AnimatePresence>
        </div>
        {/* Pulse */}
        <section className="flex flex-col  gap-2  pb-32 pt-4 mt-1 px-4  border-white/20 relative w-full max-w-sm h-screen mx-auto overflow-auto customScroll">
          <NeedsAttention id={id} />
          <Confirmation />
          <Nearby />
        </section>
      </div>

      {/* Profile */}
      <div className="w-[25%] bg-linear-to-b from-black/20 to-transparent/70 backdrop-blur-sm py-4">
        <div className="cursor-pointer group transform  translate-y-0 hover:-translate-y-1 ease-in-out duration-500 shadow-lg px-4  flex  flex-col items-center gap-y-1">
          <Link
            href="/profile"
            className="w-16 h-16 cursor-pointer bg-white/10 transform translate-y-0 hover:-translate-y-1 ease-in-out duration-200 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col items-center justify-center border border-white/10 rounded-md"
          >
            <Image
              src="/profile_1.png"
              alt="test"
              fill
              className="w-full h-full cursor-pointer"
            />
          </Link>
          <span className="text-xs opacity-0 group-hover:opacity-100 ease-in-out duration-500">
            Profile
          </span>
        </div>
      </div>

      {/* Event Cards */}
    </section>
  );
}
