"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CanvasQRcode from "./canvasQRcode";
import {
  TicketIcon,
  BroadcastIcon,
  RefreshIcon,
  MailIcon,
  ChevronLeftIcon,
  SendIcon,
  ArrowRightIcon,
} from "./icons";

type TransferModal = "transfer" | "invite" | "connect" | null;

const EASE = [0.16, 1, 0.3, 1] as const;

const MODAL_CONTENT: Record<
  NonNullable<TransferModal> | "default",
  { title: string; sub: string; placeholder: string }
> = {
  transfer: {
    title: "Transfer your pass",
    sub: "Pass your access on to someone you trust.",
    placeholder: "Username, email, or phone…",
  },
  invite: {
    title: "Send an invite",
    sub: "Extend the night to someone who should be here.",
    placeholder: "Username, email, or phone…",
  },
  connect: {
    title: "Contact the host",
    sub: "Reach out and keep the experience seamless.",
    placeholder: "Send a message…",
  },
  default: {
    title: "Your night begins here",
    sub: "A quiet moment before the night unfolds.",
    placeholder: "",
  },
};

const ACTIONS: { key: NonNullable<TransferModal>; label: string; Icon: any }[] =
  [
    { key: "transfer", label: "Transfer", Icon: ArrowRightIcon },
    { key: "invite", label: "Invite", Icon: MailIcon },
    { key: "connect", label: "Contact", Icon: BroadcastIcon },
  ];

function Transfer() {
  const [activeTransferModal, setTransferActiveModal] =
    useState<TransferModal>(null);
  const contentKey = activeTransferModal ?? "default";
  const content = MODAL_CONTENT[contentKey];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div
      className="w-1/2 mx-auto overflow-hidden grid grid-cols-1  xl:grid-rows-1 grid-rows-2"
      style={{
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.03)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      }}
    >
      {/* LEFT — QR */}
      <div
        className="flex flex-col items-center justify-center pt-12 px-8 gap-5"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="overflow-hidden"
          style={{
            borderRadius: 14,
            background: "#f0efed",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          <CanvasQRcode qrWidth={200} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          />
          <p className="text-white/30 text-xs tracking-[-0.1px]">
            Scan for entry
          </p>
        </div>
      </div>

      {/* RIGHT — Actions */}
      <div className="flex flex-col items-center justify-center pt-4 pb-12 px-8 gap-8">
        {/* Icon */}
        <AnimatePresence mode="wait">
          <motion.div
            key={contentKey + "-icon"}
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            {activeTransferModal === "transfer" && (
              <RefreshIcon size={26} color="#B3B3B3" />
            )}
            {activeTransferModal === "invite" && (
              <MailIcon size={26} color="#B3B3B3" />
            )}
            {activeTransferModal === "connect" && (
              <BroadcastIcon size={26} color="#B3B3B3" />
            )}
            {activeTransferModal === null && (
              <div style={{ transform: "rotate(45deg)" }}>
                <TicketIcon size={26} color="#B3B3B3" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Title + sub */}
        <AnimatePresence mode="wait">
          <motion.div
            key={contentKey + "-title"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="text-center flex flex-col gap-1"
          >
            <h2
              className="text-white font-medium tracking-[-0.3px]"
              style={{ fontSize: 17 }}
            >
              {content.title}
            </h2>
            <p className="text-white/35 text-sm tracking-[-0.1px]">
              {content.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Form or action buttons */}
        <AnimatePresence mode="wait">
          {activeTransferModal ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              onSubmit={handleSubmit}
              className="flex items-center gap-2 w-full"
            >
              {/* Back */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setTransferActiveModal(null)}
                className="shrink-0 flex items-center justify-center cursor-pointer transition-all duration-200"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <ChevronLeftIcon size={20} color="#fff" />
              </motion.button>

              {/* Input */}
              <input
                type="text"
                id={activeTransferModal}
                className="flex-1 bg-transparent text-white text-sm tracking-[-0.1px] placeholder-white/20 outline-none px-4 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                }}
                placeholder={content.placeholder}
                required
              />

              {/* Send */}
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="shrink-0 flex items-center justify-center cursor-pointer"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#ffffff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                }}
              >
                <SendIcon size={16} color="#111111" />
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-center gap-8"
            >
              {ACTIONS.map(({ key, label, Icon }, i) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06, ease: EASE }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setTransferActiveModal(key)}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                >
                  <div
                    className="flex items-center justify-center transition-all duration-200"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    }}
                  >
                    <Icon size={22} color="rgba(255,255,255,0.5)" />
                  </div>
                  <span className="text-white/30 text-xs tracking-[-0.1px] group-hover:text-white/60 transition-colors duration-200">
                    {label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Transfer;
