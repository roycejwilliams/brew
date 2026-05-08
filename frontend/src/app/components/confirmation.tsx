import React from "react";
import { motion } from "motion/react";
import { openEventCard } from "@/stores/store";
import { useGetAllMomentsUserIsAttendee } from "@/hooks/useMoments";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";

export default function Confirmation() {
  const { user } = useUserStore();
  const openCard = openEventCard((state) => state.openEvent);
  const router = useRouter();

  const { data: momentData } = useGetAllMomentsUserIsAttendee(
    user?.id as string,
  );

  const moments: MomentProp[] = momentData?.data?.data ?? [];

  if (moments.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium">
          Coming Up
        </p>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full tabular-nums"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {moments.length}
        </span>
      </div>

      <div className="space-y-2">
        {moments.map((moment, i) => (
          <motion.div
            key={moment.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.06,
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative rounded-md overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="p-3 space-y-2">
              <div
                className="pb-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-sm font-medium text-white/90 tracking-[-0.1px] truncate">
                  {moment.moments_name}
                </p>
                <p className="text-[11px] text-white/35 mt-0.5 tracking-[-0.1px]">
                  {moment.moment_start
                    ? new Date(moment.moment_start).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        },
                      ) +
                      " · " +
                      new Date(moment.moment_start).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )
                    : "Date TBD"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                {moment.location_name && (
                  <p className="text-[11px] text-white/30 truncate flex-1 tracking-[-0.1px]">
                    {moment.location_name}
                  </p>
                )}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    openCard(moment);
                    router.push(`/moments/${moment.id}`, { scroll: false });
                  }}
                  className="text-[11px] px-3 py-1.5 rounded-sm cursor-pointer text-white/50 hover:text-white/90 transition-all shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  View
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
