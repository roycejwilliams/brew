// EditMoment.tsx
import React, { useState } from "react";
import { motion } from "motion/react";
import { EditIcon } from "./icons";

interface EditMomentProps {
  setUtils: (view: "attendance" | "history" | "edit") => void;
  moment?: {
    title: string;
    location: string;
    date: Date;
    startTime: Date;
    endTime: Date;
  } | null;
}

export default function EditMoment({ setUtils, moment }: EditMomentProps) {
  const [title, setTitle] = useState(moment?.title ?? "");
  const [location, setLocation] = useState(moment?.location ?? "");

  const inputClass =
    "bg-white/6 border border-white/10 rounded-sm px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all w-full";

  const labelClass = "text-white/30 text-xs uppercase tracking-wide";

  return (
    <motion.div
      className="col-span-2 w-full h-full flex flex-col gap-4"
      key="edit"
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
          <EditIcon size={14} color="#fff" />
          <span className="text-xs uppercase tracking-widest">Edit Moment</span>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's the occasion?"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where is it happening?"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Date</label>
            <input
              type="date"
              defaultValue={moment?.date.toISOString().split("T")[0]}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Start</label>
            <input
              type="time"
              defaultValue={moment?.startTime.toTimeString().slice(0, 5)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>End Time</label>
          <input
            type="time"
            defaultValue={moment?.endTime.toTimeString().slice(0, 5)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Image</label>
          <div className="bg-white/4 border border-dashed border-white/10 rounded-sm px-3 py-6 text-center cursor-pointer hover:border-white/20 hover:bg-white/6 transition-all">
            <p className="text-white/20 text-xs">
              Drop an image or click to upload
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      <motion.button
        className="relative w-full bg-white text-black text-xs uppercase tracking-widest font-medium py-3 rounded-sm overflow-hidden mt-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
        Save Changes
      </motion.button>
    </motion.div>
  );
}
