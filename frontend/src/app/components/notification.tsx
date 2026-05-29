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
import { useGetKnocksForOwner, useDecideKnock } from "@/hooks/useMoments";
import {
  useGetNearbyFriendNotifications,
  useDismissNotification,
  type NearbyFriendNotification,
} from "@/hooks/useNotifications";
import Image from "next/image";

interface NotificationProp {
  onClose: () => void;
}

type Tab = "moments" | "circles" | "knocks";

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
  const { data: knocksData } = useGetKnocksForOwner(user?.id as string);
  const { mutate: decideKnock } = useDecideKnock();
  const { data: nearbyFriendData } = useGetNearbyFriendNotifications(user?.id as string);
  const { mutate: dismiss } = useDismissNotification();

  const momentInvites = (momentInvitesData?.data?.data ?? []).filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (i: any) => i.status === "pending",
  );
  const circleInvites = (circleInvitesData?.data?.data ?? []).filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (i: any) => i.status === "pending",
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const knockRequests = (knocksData?.data?.data ?? []).filter((k: any) => k.status === "pending");
  const nearbySignals: NearbyFriendNotification[] = (nearbyFriendData?.data?.data ?? []).filter(
    (n: NearbyFriendNotification) => !n.read,
  );
  const totalCount =
    momentInvites.length + circleInvites.length + knockRequests.length + nearbySignals.length;

  const activeInvites =
    tab === "moments" ? momentInvites : tab === "circles" ? circleInvites : knockRequests;
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
          background: "rgba(var(--bg),0.97)",
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
              "linear-gradient(90deg, transparent, rgba(var(--fg),0.15), transparent)",
          }}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="px-7 pt-10 pb-5"
          style={{ borderBottom: "1px solid rgba(var(--fg),0.06)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="space-y-0.5">
              <p className="text-[10px] tracking-[3px] uppercase text-black/20 dark:text-white/20 font-medium">
                BR3W
              </p>
              <h2 className="text-base font-medium text-black/90 dark:text-white/90 tracking-[-0.2px]">
                Signals
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {totalCount > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[10px] px-2 py-0.5 rounded-full tabular-nums"
                  style={{
                    background: "rgba(var(--fg),0.08)",
                    border: "1px solid rgba(var(--fg),0.1)",
                    color: "rgba(var(--fg),0.5)",
                  }}
                >
                  {totalCount}
                </motion.span>
              )}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-150"
                style={{
                  background: "rgba(var(--fg),0.06)",
                  border: "1px solid rgba(var(--fg),0.08)",
                  color: "rgba(var(--fg),0.4)",
                }}
                aria-label="Close"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {(["moments", "circles", "knocks"] as Tab[]).map((t) => {
              const count =
                t === "moments"
                  ? momentInvites.length
                  : t === "circles"
                  ? circleInvites.length
                  : knockRequests.length;
              const active = tab === t;
              return (
                <motion.button
                  key={t}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTab(t)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs cursor-pointer transition-all duration-200 capitalize"
                  style={{
                    background: active
                      ? "rgba(var(--fg),0.08)"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(var(--fg),0.1)"
                      : "1px solid transparent",
                    color: active
                      ? "rgba(var(--fg),0.8)"
                      : "rgba(var(--fg),0.3)",
                  }}
                >
                  {t}
                  {count > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full tabular-nums"
                      style={{
                        background: active
                          ? "rgba(var(--fg),0.12)"
                          : "rgba(var(--fg),0.06)",
                        color: active
                          ? "rgba(var(--fg),0.7)"
                          : "rgba(var(--fg),0.3)",
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

        {/* Nearby-friend signals — passive, no action required */}
        <AnimatePresence>
          {nearbySignals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
              style={{ borderBottom: "1px solid rgba(var(--fg),0.06)" }}
            >
              <div className="px-7 py-3 space-y-2.5">
                <p
                  className="text-[9px] tracking-[2.5px] uppercase font-medium"
                  style={{ color: "rgba(var(--fg),0.25)" }}
                >
                  Nearby
                </p>
                {nearbySignals.map((signal, i) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    {/* Friend avatar */}
                    <div
                      className="w-7 h-7 rounded-full relative overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-medium"
                      style={{
                        background: "rgba(var(--fg),0.06)",
                        border: "1px solid rgba(var(--fg),0.1)",
                        color: "rgba(var(--fg),0.4)",
                      }}
                    >
                      {signal.friend_profile_image ? (
                        <Image
                          src={signal.friend_profile_image}
                          alt={signal.friend_username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        `${signal.friend_first_name?.[0]}${signal.friend_last_name?.[0]}`
                      )}
                    </div>

                    {/* Text */}
                    <p
                      className="flex-1 text-[11px] leading-snug tracking-[-0.1px]"
                      style={{ color: "rgba(var(--fg),0.45)" }}
                    >
                      <span style={{ color: "rgba(var(--fg),0.75)", fontWeight: 500 }}>
                        {signal.friend_first_name}
                      </span>
                      {" is going to "}
                      <span style={{ color: "rgba(var(--fg),0.75)", fontWeight: 500 }}>
                        {signal.moments_name}
                      </span>
                    </p>

                    {/* Dismiss */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dismiss(signal.id)}
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150"
                      style={{
                        background: "rgba(var(--fg),0.05)",
                        color: "rgba(var(--fg),0.25)",
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    background: "rgba(var(--fg),0.04)",
                    border: "1px solid rgba(var(--fg),0.08)",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMugHot}
                    className="text-2xl text-black/20 dark:text-white/20"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-black/40 dark:text-white/40 tracking-[-0.1px]">
                    It&apos;s quiet.
                  </p>
                  <p className="text-xs text-black/20 dark:text-white/20 tracking-[-0.1px]">
                    {tab === "knocks"
                      ? "No knock requests right now."
                      : `No pending ${tab} invites right now.`}
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
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {activeInvites.map((invite: any, i: number) => {
                  const isKnock = tab === "knocks";
                  return (
                    <motion.div
                      key={invite.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="rounded-xl overflow-hidden"
                      style={{ background: "rgba(var(--fg),0.03)", border: "1px solid rgba(var(--fg),0.07)" }}
                    >
                      <div className="flex gap-3 p-4">
                        {/* Avatar — for knocks show requester profile image; for invites show moment/circle image */}
                        <div
                          className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 flex items-center justify-center"
                          style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                        >
                          {isKnock ? (
                            invite.requester_profile_image ? (
                              <Image
                                src={invite.requester_profile_image}
                                alt={invite.requester_username ?? "requester"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-black/30 dark:text-white/30 text-sm font-medium" style={{ background: "rgba(var(--fg),0.06)" }}>
                                {invite.requester_first_name?.[0]}
                                {invite.requester_last_name?.[0]}
                              </div>
                            )
                          ) : invite.image || invite.circle_image ? (
                            <Image
                              src={invite.image || invite.circle_image}
                              alt="invite"
                              fill
                              className="object-cover brightness-75"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-black/20 dark:text-white/20 text-xs font-medium">
                              {(invite.moments_name || invite.circle_name || "?")?.[0]}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          {isKnock ? (
                            <>
                              <p className="text-sm font-medium text-black/90 dark:text-white/90 tracking-[-0.1px] truncate">
                                {invite.requester_first_name} {invite.requester_last_name}
                              </p>
                              <p className="text-[11px] text-black/30 dark:text-white/30 tracking-[-0.1px]">
                                wants into{" "}
                                <span className="text-black/50 dark:text-white/50">
                                  {invite.moments_name ?? "your moment"}
                                </span>
                              </p>
                              {invite.requester_username && (
                                <p className="text-[10px] text-black/20 dark:text-white/20">
                                  @{invite.requester_username}
                                  {invite.mutual_context ? ` · ${invite.mutual_context}` : ""}
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-black/90 dark:text-white/90 tracking-[-0.1px] truncate">
                                {invite.moments_name || invite.circle_name || "Untitled"}
                              </p>
                              <p className="text-[11px] text-black/30 dark:text-white/30 tracking-[-0.1px]">
                                {tab === "moments" && invite.moment_start
                                  ? new Date(invite.moment_start).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "Circle invite"}
                              </p>
                              <p className="text-[10px] text-black/20 dark:text-white/20">
                                from @{invite.invited_by_username ?? "someone"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex" style={{ borderTop: "1px solid rgba(var(--fg),0.05)" }}>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            if (isKnock) {
                              decideKnock({ knock_id: invite.id, status: "accepted" });
                            } else if (tab === "moments") {
                              decideMoment({ ...invite, status: "accepted" });
                            } else {
                              decideCircle({ ...invite, status: "accepted" });
                            }
                          }}
                          className="flex-1 py-2.5 text-[11px] font-medium text-black/50 dark:text-white/50 hover:text-black/90 dark:hover:text-white/90 hover:bg-white/4 transition-all cursor-pointer tracking-[-0.1px]"
                        >
                          {isKnock ? "Let in" : "Accept"}
                        </motion.button>
                        <div style={{ width: 1, background: "rgba(var(--fg),0.05)" }} />
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            if (isKnock) {
                              decideKnock({ knock_id: invite.id, status: "rejected" });
                            } else if (tab === "moments") {
                              decideMoment({ ...invite, status: "rejected" });
                            } else {
                              decideCircle({ ...invite, status: "rejected" });
                            }
                          }}
                          className="flex-1 py-2.5 text-[11px] text-black/25 dark:text-white/25 hover:text-red-400/60 hover:bg-red-500/5 transition-all cursor-pointer tracking-[-0.1px]"
                        >
                          Decline
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
