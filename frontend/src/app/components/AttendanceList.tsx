// AttendanceList.tsx
import React from "react";
import { motion } from "motion/react";
import { GroupIcon, X } from "lucide-react";

interface Attendee {
  id: string;
  name: string;
  status: "attending" | "invited" | "pending";
  avatar?: string;
}

interface AttendanceListProps {
  setUtils: (view: "attendance" | "history" | "edit") => void;
  attending?: number | null;
  invited?: number | null;
  pending?: number | null;
}

const mockAttendees: Attendee[] = [
  { id: "1", name: "Jordan Miles", status: "attending" },
  { id: "2", name: "Ava Chen", status: "attending" },
  { id: "3", name: "Marcus Webb", status: "attending" },
  { id: "4", name: "Priya Nair", status: "invited" },
  { id: "5", name: "Tyler Ross", status: "pending" },
  { id: "6", name: "Simone Park", status: "pending" },
];

const statusColor: Record<Attendee["status"], string> = {
  attending: "#008000",
  invited: "#8B837E",
  pending: "#761F17",
};

export default function AttendanceList({ setUtils }: AttendanceListProps) {
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
          <span className="text-xs uppercase tracking-widest">Attendees</span>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {mockAttendees.map((attendee, i) => (
          <motion.div
            key={attendee.id}
            className="flex items-center justify-between px-3 py-2.5 border border-white/8 rounded-sm bg-white/3 hover:bg-white/6 transition-colors"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
          >
            <div className="flex items-center gap-x-3">
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/50 text-xs">
                {attendee.name[0]}
              </div>
              <span className="text-white/80 text-sm">{attendee.name}</span>
            </div>
            <div className="flex items-center gap-x-3">
              <div className="flex items-center gap-x-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: statusColor[attendee.status],
                    opacity: 0.7,
                  }}
                />
                <span className="text-white/30 text-xs capitalize">
                  {attendee.status}
                </span>
              </div>
              <button className="text-white/20 hover:text-red-400/70 transition-colors cursor-pointer">
                <X size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
