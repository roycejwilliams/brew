import React from "react";
import { motion } from "motion/react";
import { GroupIcon, X, QrCode } from "lucide-react";
import {
  useGetMomentAttendeesWithDetails,
  useRemoveAttendeeBasedOnRole,
  useCheckInAttendee,
} from "@/hooks/useMoments";
import Image from "next/image";

interface AttendanceListProps {
  setUtils: (view: "attendance" | "history" | "edit") => void;
  featuredId: string;
}

type Attendee = {
  attendee_id: string;
  profile_image?: string;
  username: string;
  first_name?: string;
  last_name?: string;
  checked_in: boolean;
  status: string;
};

const statusColor: Record<string, string> = {
  attending: "#008000",
  pending: "#8B837E",
  rejected: "#761F17",
};

export default function AttendanceList({
  setUtils,
  featuredId,
}: AttendanceListProps) {
  const { data: getAttendeesDetails, isLoading } =
    useGetMomentAttendeesWithDetails(featuredId);

  const { mutate: checkIn } = useCheckInAttendee();
  const { mutate: removeAttendee } = useRemoveAttendeeBasedOnRole();

  const seen = new Set<string>();
  const attendees = (getAttendeesDetails?.data?.data ?? []).filter((a: Attendee) => {
    if (seen.has(a.attendee_id)) return false;
    seen.add(a.attendee_id);
    return true;
  });

  return (
    <motion.div
      key="attendance"
      className="col-span-2 w-full h-full flex flex-col gap-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setUtils("history")}
          className="text-white/30 hover:text-white/60 text-xs uppercase tracking-wide transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex items-center gap-x-2 text-white/50">
          <GroupIcon size={14} />
          <span className="text-xs uppercase tracking-widest">
            Attendees {attendees.length > 0 && `· ${attendees.length}`}
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {isLoading ? (
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 rounded-sm bg-white/3 border border-white/5"
            />
          ))
        ) : attendees.length > 0 ? (
          attendees.map((attendee: Attendee, i: number) => (
            <motion.div
              key={attendee.attendee_id ?? i}
              className="flex items-center justify-between px-3 py-2.5 border border-white/8 rounded-sm bg-white/3 hover:bg-white/6 transition-colors"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
            >
              <div className="flex items-center gap-x-3">
                <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 relative overflow-hidden flex items-center justify-center text-white/50 text-xs shrink-0">
                  {attendee.profile_image ? (
                    <Image
                      src={attendee.profile_image}
                      alt={attendee.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    `${attendee.first_name?.[0]}${attendee.last_name?.[0]}`
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-white/80 text-sm">
                    {attendee.first_name} {attendee.last_name}
                  </span>
                  <span className="text-white/30 text-xs">
                    @{attendee.username}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-x-3">
                {!attendee.checked_in ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      checkIn({
                        moment_id: featuredId,
                        attendee_id: attendee.attendee_id,
                      })
                    }
                    className="flex items-center gap-x-1 px-2 py-1 rounded text-[10px] text-white/40 border border-white/8 hover:border-white/20 hover:text-white/70 cursor-pointer transition-all duration-150"
                  >
                    <QrCode size={11} />
                    Check in
                  </motion.button>
                ) : (
                  <span className="text-[10px] text-green-500/60 uppercase tracking-wide">
                    Checked in
                  </span>
                )}

                <div className="flex items-center gap-x-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: statusColor[attendee.status] ?? "#8B837E",
                      opacity: 0.7,
                    }}
                  />
                  <span className="text-white/30 text-xs capitalize">
                    {attendee.status}
                  </span>
                </div>

                <button
                  onClick={() =>
                    removeAttendee({
                      moment: { id: featuredId } as MomentProp,
                      attendee: attendee as unknown as InviteAttendeesProp,
                    })
                  }
                  className="text-white/20 hover:text-red-400/70 transition-colors cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-white/20 text-xs text-center py-8">
            No attendees yet.
          </p>
        )}
      </div>
    </motion.div>
  );
}
