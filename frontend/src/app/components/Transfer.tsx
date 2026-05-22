"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CanvasQRcode from "./canvasQRcode";
import {
  TicketIcon,
  MailIcon,
  ChevronLeftIcon,
  SendIcon,
  ArrowRightIcon,
} from "./icons";
import { useTransferTicket } from "@/hooks/useMoments";
import { openEventCard } from "@/stores/store";
import { useUserStore } from "@/stores/useUserStore";
import { useInviteAttendeeToMoment } from "@/hooks/useInvites";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

type TransferModal = "transfer" | "invite" | null;

const EASE = [0.16, 1, 0.3, 1] as const;

const config = {
  transfer: {
    title: "Transfer your pass",
    sub: "Pass your access on to someone you trust.",
    placeholder: "Username, email, or phone…",
    Icon: ArrowRightIcon,
  },
  invite: {
    title: "Send an invite",
    sub: "Extend the night to someone who should be here.",
    placeholder: "Username, email, or phone…",
    Icon: MailIcon,
  },
};

function Transfer() {
  const [active, setActive] = useState<TransferModal>(null);
  const current = active ? config[active] : null;

  const {
    mutate: transferTicket,
    isPending: isTransferring,
    isSuccess: transferSuccess,
    isError: transferError,
  } = useTransferTicket();
  const {
    mutate: inviteAttendee,
    isPending: isInviting,
    isSuccess: inviteSuccess,
    isError: inviteError,
  } = useInviteAttendeeToMoment();
  const isPending = isTransferring || isInviting;
  const isSuccess = transferSuccess || inviteSuccess;
  const isError = transferError || inviteError;

  const { user } = useUserStore();
  const eventCard = openEventCard((state) => state.moment);

  const [recipient, setRecipient] = useState<string>("");

  return (
    <div
      className="max-w-xl mx-auto overflow-hidden"
      style={{
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.03)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      }}
    >
      {/* QR */}
      <div className="flex flex-col items-center justify-center py-10 px-8 gap-5">
        <div
          className="overflow-hidden"
          style={{
            borderRadius: 14,
            background: "#f0efed",
            padding: 8,
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          <CanvasQRcode
            qrWidth={160}
            type="checkin"
            id={eventCard?.id as string}
          />{" "}
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

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      {/* Actions */}
      <div className="flex flex-col items-center justify-center py-10 px-8 gap-6">
        {/* Eyebrow */}
        <p className="text-[10px] tracking-[3px] uppercase text-white/20">
          {active
            ? active === "transfer"
              ? "Transfer"
              : "Invite"
            : "Your pass"}
        </p>

        {/* Icon */}
        <div
          className="flex items-center justify-center "
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {current ? (
            //Picks either transfer or invite icon
            <current.Icon size={26} color="#B3B3B3" />
          ) : (
            <div style={{ transform: "rotate(45deg)" }}>
              <TicketIcon size={26} color="#B3B3B3" />
            </div>
          )}
        </div>

        {/* Title + sub */}
        <div className="text-center flex flex-col gap-1">
          <h2
            className="text-white font-medium tracking-[-0.3px]"
            style={{ fontSize: 17 }}
          >
            {current?.title ?? "Your night begins here"}
          </h2>
          <p className="text-white/35 text-sm tracking-[-0.1px]">
            {current?.sub ?? "A quiet moment before the night unfolds."}
          </p>
        </div>

        {/* Form or buttons */}
        {/* Takes the form of whatever's active */}
        <AnimatePresence mode="wait">
          {active ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 w-4/5"
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setActive(null)}
                className="shrink-0 flex items-center justify-center cursor-pointer"
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

              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm placeholder-white/20 outline-none px-4 py-2.5 rounded-xl"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                }}
                placeholder={current?.placeholder}
                required
              />

              <motion.button
                onClick={() =>
                  active === "transfer"
                    ? transferTicket({
                        attendee_id: user?.id as string,
                        moment_id: eventCard?.id as string,
                        recipient: recipient,
                      })
                    : inviteAttendee({
                        moment_id: eventCard?.id as string,
                        recipient: recipient,
                      })
                }
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={isPending}
                className="shrink-0 flex items-center justify-center cursor-pointer disabled:opacity-40"
                style={{
                  width: 40,
                  height: 40,
                  rotate: "90deg",
                  borderRadius: "50%",
                  background: isSuccess
                    ? "rgba(74,222,128,0.15)"
                    : isError
                      ? "rgba(220,80,80,0.15)"
                      : "rgba(255,255,255,0.1)",
                  border: isSuccess
                    ? "1px solid rgba(74,222,128,0.3)"
                    : isError
                      ? "1px solid rgba(220,80,80,0.3)"
                      : "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {isPending ? (
                  <FontAwesomeIcon
                    icon={faArrowRotateRight}
                    size="xs"
                    className="animate-spin text-white/60"
                  />
                ) : isSuccess ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    size="xs"
                    className="text-green-400/70"
                  />
                ) : isError ? (
                  <FontAwesomeIcon
                    icon={faXmark}
                    size="xs"
                    className="text-red-400/70"
                  />
                ) : (
                  <SendIcon size={16} color="#fff" />
                )}
              </motion.button>
            </motion.form>
          ) : (
            // Pick an option point
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-center gap-8"
            >
              {/* Nonnullable - constructs a new type by excluding null and undefined from an existing type */}
              {(Object.keys(config) as NonNullable<TransferModal>[]).map(
                (key, i) => {
                  {
                    /* Refers to the Icon in the object */
                  }
                  const { Icon } = config[key];
                  return (
                    <motion.button
                      key={key}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.06,
                        ease: EASE,
                      }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActive(key)}
                      className="flex flex-col items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                        }}
                      >
                        <Icon size={22} color="#FFFFFF80" />
                      </div>
                      <span className="text-white/30 text-xs tracking-[-0.1px] group-hover:text-white/60 transition-colors duration-200">
                        {key === "transfer" ? "Transfer" : "Invite"}
                      </span>
                    </motion.button>
                  );
                },
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Transfer;
