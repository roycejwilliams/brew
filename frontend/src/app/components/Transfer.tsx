"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CanvasQRcode from "./canvasQRcode";
import { TicketIcon, BroadcastIcon, RefreshIcon, MailIcon, ChevronLeftIcon, SendIcon, ArrowRightIcon } from "./icons";

function Transfer() {
  const [activeTransferModal, setTransferActiveModal] = useState<
    "transfer" | "invite" | "connect" | null
  >(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="h-2/3 w-full overflow-hidden inset-0 grid xl:grid-cols-2 grid-cols-1 xl:grid-rows-1 grid-rows-2 rounded-lg shadow-lg bg-[#2b2b2b]/50 border border-white/20">
      <div className="xl:col-span-1 place-content-center place-items-center  xl:border-r  border-white/25">
        <div className="overflow-hidden rounded-xl w-fit mt-4 mx-auto">
          <CanvasQRcode qrWidth={250} />
        </div>
        <p className="mt-6 text-white/50 text-sm">Scan for entry</p>
      </div>

      <div className="xl:col-span-1 place-content-center place-items-center relative">
        {/* OPTION STATES */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            key={activeTransferModal ?? "default"}
            className={`mb-8 w-20 h-20 bg-linear-to-b from-[#2f1613] to-[#00000084] border border-white/10  shadow-lg relative rounded-full  flex justify-center items-center mx-auto `}
          >
            {activeTransferModal === "transfer" && (
              <RefreshIcon size={44}  color="#fff" />
            )}
            {activeTransferModal === "invite" && (
              <MailIcon size={44}  color="#fff" />
            )}
            {activeTransferModal === "connect" && (
              <BroadcastIcon size={44}  color="#fff" />
            )}
            {activeTransferModal === null && (
              <div className="transform rotate-45">
              <TicketIcon size={44}  color="#fff" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTransferModal ?? "default-title"}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h2 className="text-xl font-medium">
              {activeTransferModal === "transfer"
                ? "Transfer Your Pass"
                : activeTransferModal === "invite"
                ? "Send an Invite"
                : activeTransferModal === "connect"
                ? "Contact the Host"
                : "Your night begins here"}
            </h2>

            <p className="text-white/75 text-sm mt-1">
              {activeTransferModal === "transfer"
                ? "Pass your access on to someone you trust."
                : activeTransferModal === "invite"
                ? "Extend the night to someone who should be here."
                : activeTransferModal === "connect"
                ? "Reach out and keep the experience seamless."
                : "A quiet moment before the night unfolds."}
            </p>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {activeTransferModal ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10, width: "0%" }}
              animate={{ opacity: 1, y: 0, width: "100%" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onSubmit={handleSubmit}
              className="mt-8 flex px-16 gap-x-2  items-center justify-center text-xs text-white/75  mx-auto"
            >
              <button
                type="button"
                onClick={() => setTransferActiveModal(null)}
                className={` border-[0.5px] rounded-full w-10 h-10 bg-[#2b2b2b] cursor-pointer shadow-xl border-black flex justify-center items-center ${
                  activeTransferModal ? "block" : "hidden"
                }`}
              >
                <ChevronLeftIcon size={36}  color="#fff" />
              </button>
              <input
                type="text"
                id={activeTransferModal}
                className="border text-white flex-1 px-4 border-gray-300/30 text-sm rounded-full placeholder:text-xs block mx-auto p-2.5 bg-transparent placeholder:text-white/50 focus:outline-none"
                placeholder={
                  activeTransferModal === "transfer"
                    ? "Transfer to.."
                    : activeTransferModal === "invite"
                    ? "Invite.."
                    : activeTransferModal === "connect"
                    ? "Send Message.."
                    : ""
                }
                required
              />{" "}
              <button
                type="submit"
                className={` border-[0.5px] rounded-full w-10 h-10 bg-[#e7e7e7] cursor-pointer shadow-xl border-black flex justify-center items-center ${
                  activeTransferModal ? "block" : "hidden"
                }`}
              >
                <SendIcon size={20}  color="#000" />
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-8 flex px-16 gap-x-12 w-full items-center justify-center text-xs text-white/75  mx-auto"
            >
              {/* Transfer */}
              <button
                role="transfer"
                onClick={() => setTransferActiveModal("transfer")}
                className="cursor-pointer group hover:text-white duration-300 ease-in-out transition "
              >
                <div className=" w-20 h-20 rounded-full group-hover:scale-110 duration-300 ease-in-out transition   shadow-xl backdrop-blur-3xl flex justify-center items-center  border border-white/10 bg-linear-to-r from-black/25 to-[#2b2b2b]/20">
                  <ArrowRightIcon size={28}  color="currentColor" />
                </div>
                <p className="mt-4 mx-auto text-center">Transfer</p>
              </button>
              {/* Invite  */}
              <button
                role="invite"
                onClick={() => setTransferActiveModal("invite")}
                className="cursor-pointer group hover:text-white duration-300 ease-in-out transition "
              >
                <div className=" w-20 h-20 rounded-full group-hover:scale-110 duration-300 ease-in-out transition   shadow-xl backdrop-blur-3xl flex justify-center items-center  border border-white/10 bg-linear-to-r from-black/25 to-[#2b2b2b]/20">
                    <MailIcon size={44}  color="#fff" />
                </div>
                <p className="mt-4 mx-auto text-center">Invite</p>
              </button>
              {/* Connect */}
              <button
                role="connect"
                onClick={() => setTransferActiveModal("connect")}
                className="cursor-pointer group hover:text-white duration-300 ease-in-out transition "
              >
                <div className=" w-20 h-20 rounded-full group-hover:scale-110 duration-300 ease-in-out transition   shadow-xl backdrop-blur-3xl flex justify-center items-center  border border-white/10 bg-linear-to-r from-black/25 to-[#2b2b2b]/20">
                  {activeTransferModal === "connect" && (
                    <BroadcastIcon size={44}  color="#fff" />
                  )}
                </div>
                <p className="mt-4 mx-auto text-center">Contact</p>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Transfer;
