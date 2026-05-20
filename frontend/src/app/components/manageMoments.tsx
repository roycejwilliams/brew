"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EditIcon, EyeIcon } from "./icons";
import Image from "next/image";
import { GroupIcon } from "lucide-react";
import { openEventCard } from "@/stores/store";
import AttendanceList from "./AttendanceList";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useGetAllMomentsOwnedByUser } from "@/hooks/useMoments";
import EditMoment from "./EditMoment";
import { getMomentStatus, sortMomentsByStatus } from "../utils/momentsUtils";

type StatusSymbol = "prequel" | "live" | "end" | null;

const EASE = [0.16, 1, 0.3, 1] as const;

const statusConfig = {
  live: { label: "Live now", color: "#4ade80" },
  prequel: { label: "Upcoming", color: "rgba(255,255,255,0.4)" },
  end: { label: "Ended", color: "rgba(255,255,255,0.2)" },
};

export function FocusStatus({ status }: { status: StatusSymbol }) {
  if (!status) return null;
  const config = statusConfig[status];

  return (
    <div className="flex gap-x-2 items-center absolute top-0 left-0 m-3 z-10">
      {status === "live" ? (
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: config.color }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: config.color, opacity: 0.6 }}
        />
      )}
      <span
        className="text-[9px] tracking-[2px] uppercase font-medium"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        {config.label}
      </span>
    </div>
  );
}

const formatDate = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
};

export default function ManageMoments() {
  const [selectedMoment, setSelectedMoment] = useState<MomentProp | null>(null);
  const [utils, setUtils] = useState<"attendance" | "history" | "edit">(
    "history",
  );

  const openMoment = openEventCard((state) => state.openEvent);
  const router = useRouter();

  const { user } = useUserStore();
  const { data: MomentsByUser, isLoading } = useGetAllMomentsOwnedByUser(
    user?.id ?? "",
  );

  const moments: MomentProp[] = MomentsByUser?.data?.data ?? [];
  const sortedMoments = sortMomentsByStatus(moments);
  const featured = selectedMoment ?? sortedMoments[0] ?? null;
  const historyMoments = sortedMoments.filter((m) => m.id !== featured?.id);
  const featuredStatus = featured ? getMomentStatus(featured) : null;

  return (
    <section className="flex-1 h-full overflow-hidden flex flex-col relative">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0 relative z-10"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,8,8,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          className="text-[9px] tracking-[3px] uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Moments
        </p>
        {featured && (
          <div className="flex items-center gap-2">
            {(["attendance", "edit"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setUtils(utils === view ? "history" : view)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium tracking-[-0.1px] cursor-pointer transition-all duration-150"
                style={{
                  background:
                    utils === view
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    utils === view
                      ? "1px solid rgba(255,255,255,0.14)"
                      : "1px solid rgba(255,255,255,0.07)",
                  color:
                    utils === view
                      ? "rgba(255,255,255,0.82)"
                      : "rgba(255,255,255,0.35)",
                }}
              >
                {view === "attendance" ? (
                  <GroupIcon size={11} />
                ) : (
                  <EditIcon size={11} color="currentColor" />
                )}
                <span className="hidden sm:block">
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Featured moment */}
        <div
          className="sm:w-2/5 lg:w-1/3 shrink-0 relative overflow-hidden"
          style={{
            minHeight: 280,
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {isLoading ? (
            <motion.div
              className="w-full h-full"
              style={{ background: "rgba(255,255,255,0.03)" }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ) : featured ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="w-full h-full relative"
              >
                <FocusStatus status={featuredStatus} />

                {featured.image && (
                  <Image
                    src={featured.image}
                    alt={featured.moments_name}
                    fill
                    sizes="33vw"
                    priority
                    className="object-cover"
                    style={{ filter: "brightness(0.45)" }}
                  />
                )}

                {/* Gradient scrim */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)",
                  }}
                />

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <div className="flex flex-col gap-1 min-w-0 flex-1 mr-3">
                    <h2
                      className="font-medium tracking-[-0.3px] truncate"
                      style={{ fontSize: 18, color: "rgba(255,255,255,0.9)" }}
                    >
                      {featured.moments_name}
                    </h2>
                    <p
                      className="text-[11px] tracking-[-0.1px]"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {featured.moment_start
                        ? formatDate(featured.moment_start)
                        : "Date TBD"}
                    </p>
                    {featured.location_name && (
                      <p
                        className="text-[10px] tracking-[-0.1px]"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {featured.location_name}
                      </p>
                    )}
                  </div>

                  {/* View button */}
                  <motion.button
                    onClick={() => {
                      openMoment(featured);
                      router.push(`/moments/${featured.id}`, { scroll: false });
                    }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 shrink-0 text-[11px] font-medium tracking-[-0.1px]"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      color: "rgba(255,255,255,0.75)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <EyeIcon />
                    <span className="hidden sm:block">View</span>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-6">
              <div className="relative w-14 h-14">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full flex items-center justify-center"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "rgba(255,255,255,0.25)" }}
                  />
                </div>
              </div>
              <div className="text-center flex flex-col gap-1">
                <p
                  className="text-sm tracking-[-0.1px]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Nothing live yet.
                </p>
                <p
                  className="text-[11px] tracking-[-0.1px]"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Create a moment and bring people together.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {utils === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 ${historyMoments.length === 0 && "h-full"}`}
              >
                {historyMoments.length > 0 ? (
                  historyMoments.map((event, index) => {
                    const status = getMomentStatus(event);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.18, delay: index * 0.05 }}
                        onClick={() => setSelectedMoment(event)}
                        className="aspect-3/4 rounded-xl overflow-hidden relative cursor-pointer"
                        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Image
                          src={event.image || "/brew.jpg"}
                          alt={event.moments_name || "moment"}
                          fill
                          sizes="25vw"
                          className="object-cover"
                          style={{ filter: "brightness(0.65)" }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)",
                          }}
                        />

                        {/* Status dot */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          {status === "live" ? (
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: "#4ade80" }}
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          ) : (
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background:
                                  status === "prequel"
                                    ? "rgba(255,255,255,0.4)"
                                    : "rgba(255,255,255,0.2)",
                              }}
                            />
                          )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-2.5">
                          <p
                            className="text-xs font-medium tracking-[-0.1px] truncate"
                            style={{ color: "rgba(255,255,255,0.85)" }}
                          >
                            {event.moments_name}
                          </p>
                          <p
                            className="text-[10px] tracking-[-0.1px] mt-0.5"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {event.moment_start
                              ? new Date(event.moment_start).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" },
                                )
                              : "TBD"}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="flex relative w-32 h-40 mx-auto items-center justify-center">
                      {[-12, 10, 0].map((rotate, i) => (
                        <div
                          key={i}
                          className="absolute w-20 h-28 rounded-xl"
                          style={{
                            transform: `rotate(${rotate}deg) translateX(${i === 0 ? -20 : i === 1 ? 20 : 0}px) translateY(${i === 2 ? 0 : 8}px)`,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            opacity: 1 - i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p
                        className="text-sm tracking-[-0.1px]"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        Your moments live here.
                      </p>
                      <p
                        className="text-[11px] tracking-[-0.1px]"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        The nights worth remembering will find their place.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {utils === "attendance" && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <AttendanceList
                  setUtils={setUtils}
                  featuredId={featured?.id as string}
                />
              </motion.div>
            )}

            {utils === "edit" && (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <EditMoment setUtils={setUtils} featured={featured} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
