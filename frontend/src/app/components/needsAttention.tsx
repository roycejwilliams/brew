import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { openEventCard } from "@/stores/store";
import { useInviteUserMomentView } from "@/hooks/useInvites";
import { useInviteAttendeeDecision } from "@/hooks/useInvites";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";

export default function NeedsAttention() {
  const openCard = openEventCard((state) => state.openEvent);
  const { user } = useUserStore();
  const router = useRouter();
  const { data: invitesData } = useInviteUserMomentView(user?.id as string);
  const { mutate: decideInvite } = useInviteAttendeeDecision();

  const invites = invitesData?.data?.data ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pending = invites.filter((i: any) => i.status === "pending");

  if (pending.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium">
          Needs Attention
        </p>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full tabular-nums"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {pending.length}
        </span>
      </div>

      <div className="space-y-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {pending.map((invite: any, i: number) => (
          <motion.div
            key={invite.id}
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
            <div className="flex gap-3 p-3">
              {/* Image */}
              <button
                onClick={() => {
                  openCard({
                    id: invite.moment_id,
                    moments_name: invite.moments_name,
                    image: invite.image,
                    moment_start: invite.moment_start,
                    location_name: invite.location_name,
                  } as MomentProp);
                  router.push(`/moments/${invite.moment_id}`, { scroll: false });
                }}
                className="relative w-16 h-16 rounded-sm overflow-hidden shrink-0 cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Image
                  src={invite.image || "/brew.jpg"}
                  fill
                  alt={invite.moment_name || "moment"}
                  className="object-cover brightness-75"
                />
              </button>

              {/* Info */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white/90 truncate tracking-[-0.1px]">
                    {invite.moments_name ?? "Untitled Moment"}
                  </p>
                  <p className="text-[11px] text-white/35 tracking-[-0.1px]">
                    {invite.moment_start
                      ? new Date(invite.moment_start).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          },
                        ) +
                        " · " +
                        new Date(invite.moment_start).toLocaleTimeString(
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
                <p className="text-[10px] text-white/25 tracking-[-0.1px]">
                  Awaiting your response
                </p>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => decideInvite({ ...invite, status: "accepted" })}
                className="flex-1 py-2.5 text-[11px] font-medium text-white/50 hover:text-white/90 hover:bg-white/4 transition-all cursor-pointer tracking-[-0.1px]"
              >
                Accept
              </motion.button>
              <div
                className="w-px"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => decideInvite({ ...invite, status: "rejected" })}
                className="flex-1 py-2.5 text-[11px] text-white/25 hover:text-red-400/60 hover:bg-red-500/5 transition-all cursor-pointer tracking-[-0.1px]"
              >
                Decline
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
