import { motion, AnimatePresence } from "motion/react";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "@/stores/useUserStore";
import {
  useInviteUserMomentView,
  useInviteUserCircleView,
  useInviteAttendeeDecision,
  useInviteMemberDecision,
} from "@/hooks/useInvites";
import Image from "next/image";

interface NotificationProp {
  onClose: () => void;
}

type Tab = "moments" | "circles";

export default function Notification({ onClose }: NotificationProp) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tab, setTab] = useState<Tab>("moments");
  const { user } = useUserStore();

  useOutsideAlerter(ref, onClose);

  const { data: momentInvitesData } = useInviteUserMomentView(
    user?.id as string,
  );
  const { data: circleInvitesData } = useInviteUserCircleView(
    user?.id as string,
  );
  const { mutate: decideMoment } = useInviteAttendeeDecision();
  const { mutate: decideCircle } = useInviteMemberDecision();

  const momentInvites = (momentInvitesData?.data?.data ?? []).filter(
    (i: any) => i.status === "pending",
  );
  const circleInvites = (circleInvitesData?.data?.data ?? []).filter(
    (i: any) => i.status === "pending",
  );
  const totalCount = momentInvites.length + circleInvites.length;

  const activeInvites = tab === "moments" ? momentInvites : circleInvites;
  const isEmpty = activeInvites.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-screen absolute top-0 left-0 bg-black/40 backdrop-blur-xl z-50 flex justify-end items-center"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 400 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.8,
          },
        }}
        exit={{
          opacity: 0,
          x: 400,
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }}
        className="w-full max-w-md h-screen relative rounded-tl-2xl rounded-bl-2xl shadow-2xl shadow-black/60 border-l border-t border-b border-white/8 overflow-hidden flex flex-col"
        style={{
          background: "rgba(10,10,10,0.97)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Top accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-px origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          }}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="px-7 pt-10 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="space-y-0.5">
              <p className="text-[10px] tracking-[3px] uppercase text-white/20 font-medium">
                BR3W
              </p>
              <h2 className="text-base font-medium text-white/90 tracking-[-0.2px]">
                Signals
              </h2>
            </div>
            {totalCount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] px-2 py-0.5 rounded-full tabular-nums"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {totalCount}
              </motion.span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {(["moments", "circles"] as Tab[]).map((t) => {
              const count =
                t === "moments" ? momentInvites.length : circleInvites.length;
              const active = tab === t;
              return (
                <motion.button
                  key={t}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTab(t)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs cursor-pointer transition-all duration-200 capitalize"
                  style={{
                    background: active
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid transparent",
                    color: active
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.3)",
                  }}
                >
                  {t}
                  {count > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full tabular-nums"
                      style={{
                        background: active
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(255,255,255,0.06)",
                        color: active
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full min-h-96 flex flex-col items-center justify-center px-8 gap-5"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMugHot}
                    className="text-2xl text-white/20"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-white/40 tracking-[-0.1px]">
                    It's quiet.
                  </p>
                  <p className="text-xs text-white/20 tracking-[-0.1px]">
                    No pending {tab} invites right now.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="px-5 py-5 space-y-2"
              >
                {activeInvites.map((invite: any, i: number) => (
                  <motion.div
                    key={invite.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex gap-3 p-4">
                      {/* Avatar / image */}
                      <div
                        className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {invite.image || invite.circle_image ? (
                          <Image
                            src={invite.image || invite.circle_image}
                            alt="invite"
                            fill
                            className="object-cover brightness-75"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-xs font-medium">
                            {
                              (invite.moments_name ||
                                invite.circle_name ||
                                "?")?.[0]
                            }
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-sm font-medium text-white/90 tracking-[-0.1px] truncate">
                          {invite.moments_name ||
                            invite.circle_name ||
                            "Untitled"}
                        </p>
                        <p className="text-[11px] text-white/30 tracking-[-0.1px]">
                          {tab === "moments" && invite.moment_start
                            ? new Date(invite.moment_start).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "Circle invite"}
                        </p>
                        <p className="text-[10px] text-white/20">
                          from @{invite.invited_by_username ?? "someone"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className="flex"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          tab === "moments"
                            ? decideMoment({ ...invite, status: "accepted" })
                            : decideCircle({ ...invite, status: "accepted" })
                        }
                        className="flex-1 py-2.5 text-[11px] font-medium text-white/50 hover:text-white/90 hover:bg-white/4 transition-all cursor-pointer tracking-[-0.1px]"
                      >
                        Accept
                      </motion.button>
                      <div
                        style={{
                          width: 1,
                          background: "rgba(255,255,255,0.05)",
                        }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          tab === "moments"
                            ? decideMoment({ ...invite, status: "rejected" })
                            : decideCircle({ ...invite, status: "rejected" })
                        }
                        className="flex-1 py-2.5 text-[11px] text-white/25 hover:text-red-400/60 hover:bg-red-500/5 transition-all cursor-pointer tracking-[-0.1px]"
                      >
                        Decline
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
