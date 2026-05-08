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
import CreateModal from "./CreateModal";

type StatusSymbol = "prequel" | "live" | "end" | null;

const indicators = [
  { key: "prequel", code: "Upcoming", color: "#8B837E" },
  { key: "live", code: "Live now", color: "#008000" },
  { key: "end", code: "Ended", color: "#761F17" },
];

export function FocusStatus({ status }: { status: StatusSymbol }) {
  const indicator = indicators.find((stat) => stat.key === status);

  return (
    <>
      {indicator && (
        <div className="flex gap-x-2 items-center absolute top-0 left-0 m-4 z-10">
          {status === "live" ? (
            <motion.div
              className="w-2 h-2 rounded-full border border-white/10 shadow-sm"
              style={{ background: indicator.color }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ) : (
            <div
              className="w-2 h-2 rounded-full border border-white/10 shadow-sm"
              style={{ background: indicator.color, opacity: 0.5 }}
            />
          )}
          <span className="uppercase text-xs text-white font-medium tracking-wide">
            {indicator.code}
          </span>
        </div>
      )}
    </>
  );
}

export default function ManageMoments() {
  const [selectedMoment, setSelectedMoment] = useState<MomentProp | null>(null);
  const [utils, setUtils] = useState<"attendance" | "history" | "edit">(
    "history",
  );

  const openMoment = openEventCard((state) => state.openEvent);
  const router = useRouter();

  const { user } = useUserStore();
  const { data: MomentsByUser, isLoading } = useGetAllMomentsOwnedByUser(
    user?.id as string,
  );

  const moments: MomentProp[] = MomentsByUser?.data?.data ?? [];

  // Sort — live first, then upcoming, then ended
  const sortedMoments = sortMomentsByStatus(moments);

  const featured = selectedMoment ?? sortedMoments[0] ?? null;
  const historyMoments = sortedMoments.filter((m) => m.id !== featured?.id);
  const featuredStatus = featured ? getMomentStatus(featured) : null;

  return (
    <section className="flex-1 shrink-0 relative">
      {/* Header */}
      <motion.div
        className="flex justify-between px-8 pb-4 pt-8 items-start z-20 text-sm backdrop-blur-[10px] bg-[#1b1b1b]/5 border-b border-white/5 shadow-sm absolute top-0 w-full"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h1 className="tracking-wide font-normal uppercase text-[#656565]">
          Moments
        </h1>
      </motion.div>

      <motion.div className="grid grid-cols-2 h-full gap-8 px-8 items-center">
        {/* Featured moment */}
        <motion.div
          key="live-moment"
          className="col-span-1 h-5/6 mt-12 border border-white/10 rounded-sm relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {isLoading ? (
            <motion.div
              className="w-full h-full bg-white/3"
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
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full relative"
              >
                <FocusStatus status={featuredStatus} />
                {featured.image && (
                  <Image
                    src={featured.image}
                    alt={featured.moments_name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority
                    className="absolute w-full h-full object-cover brightness-50"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                {/* Moment info */}
                <div className="absolute bottom-0 left-0 p-4 space-y-1 max-w-2/5">
                  <h2 className="text-white text-xl font-medium tracking-[-0.3px]">
                    {featured.moments_name}
                  </h2>
                  <p className="text-white/50 text-xs">
                    {/* There's no T in the string so we have to use this. */}
                    {featured?.moment_start
                      ? new Date(featured.moment_start).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          },
                        ) +
                        " · " +
                        new Date(featured.moment_start).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          },
                        )
                      : "Date TBD"}
                  </p>
                  {featured.location_name && (
                    <p className="text-white/40 text-xs">
                      {featured.location_name}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute bottom-0 right-0 p-4 flex gap-x-2">
                  <motion.button
                    onClick={() => setUtils("attendance")}
                    className="relative flex items-center gap-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/10 bg-white/8 backdrop-blur-sm hover:text-white hover:border-white/25 hover:bg-white/15 transition-colors duration-150 cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GroupIcon size={15} />
                    <span>Attendees</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setUtils("edit")}
                    className="relative flex items-center gap-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/10 bg-white/8 backdrop-blur-sm hover:text-white hover:border-white/25 hover:bg-white/15 transition-colors duration-150 cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <EditIcon size={15} color="#fff" />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      openMoment(featured);
                      router.push(`/moments/${featured.id}`, { scroll: false });
                    }}
                    className="relative flex items-center gap-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/10 bg-white/8 backdrop-blur-sm hover:text-white hover:border-white/25 hover:bg-white/15 transition-colors duration-150 cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <EyeIcon />
                    <span>View</span>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
              <div className="relative w-16 h-16">
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/10"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/5"
                  animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                />
                <div className="absolute inset-0 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                </div>
              </div>
              <div className="flex flex-col gap-1 text-center">
                <p className="text-white/50 text-sm tracking-wide">
                  Nothing live yet.
                </p>
                <p className="text-white/20 text-xs">
                  Create a moment and bring people together.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right panel */}
        <motion.div className="col-span-1 h-full pb-10 pt-24 justify-center gap-4 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {utils === "history" && (
              <motion.div
                key="history"
                className="w-full grid grid-cols-2 gap-4 content-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {historyMoments.length > 0 ? (
                  historyMoments.map((event, index) => {
                    const status = getMomentStatus(event);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.08 }}
                        onClick={() => setSelectedMoment(event)}
                        className="w-full aspect-3/4 rounded-md overflow-hidden relative cursor-pointer group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Image
                          src={event.image || "/brew.jpg"}
                          alt={event.moments_name || "brew"}
                          fill
                          priority
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

                        {/* Status indicator */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          {status === "live" ? (
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full bg-green-500"
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
                                  status === "prequel" ? "#8B837E" : "#761F17",
                                opacity: 0.7,
                              }}
                            />
                          )}
                          <span className="text-white/50 text-[9px] uppercase tracking-wide">
                            {status === "live"
                              ? "Live"
                              : status === "prequel"
                                ? "Upcoming"
                                : "Ended"}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 p-3">
                          <p className="text-white/90 text-xs font-medium truncate">
                            {event.moments_name}
                          </p>
                          <p className="text-white/40 text-[10px]">
                            {event.moment_start
                              ? new Date(event.moment_start).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "TBD"}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center w-full h-full gap-6 text-center">
                    <div className="relative w-48 h-48 mx-auto flex justify-center items-center">
                      <div
                        className="absolute w-28 h-36 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
                        style={{
                          transform:
                            "rotate(-12deg) translateX(-30px) translateY(10px)",
                        }}
                      />
                      <div
                        className="absolute w-28 h-36 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
                        style={{
                          transform:
                            "rotate(10deg) translateX(30px) translateY(10px)",
                        }}
                      />
                      <div
                        className="absolute w-28 h-36 rounded-lg border border-white/10 bg-white/8 backdrop-blur-sm"
                        style={{ transform: "rotate(0deg)" }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-white/60 text-sm tracking-wide">
                        Your moments live here.
                      </p>
                      <p className="text-white/25 text-xs">
                        The nights worth remembering will find their place.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {utils === "attendance" && (
              <AttendanceList
                key="attendance"
                setUtils={setUtils}
                featuredId={featured?.id as string}
              />
            )}
            {utils === "edit" && (
              <EditMoment key="edit" setUtils={setUtils} featured={featured} />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
