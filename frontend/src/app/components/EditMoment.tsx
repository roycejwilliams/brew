import React, { useState } from "react";
import { motion } from "motion/react";
import { EditIcon } from "./icons";
import { useUpdateMomentsByOwner } from "@/hooks/useMoments";
import { normalizeDate } from "@/lib/momentsUtil";
import {
  useLocationSearch,
  reverseGeolocateSearch,
} from "@/hooks/useReverseGeolocateSearch";

interface EditMomentProps {
  setUtils: (view: "attendance" | "history" | "edit") => void;
  featured: MomentProp | null;
}

export default function EditMoment({ setUtils, featured }: EditMomentProps) {
  const {
    mutate: updateMoment,
    isPending,
    isSuccess,
  } = useUpdateMomentsByOwner();

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [locationQuery, setLocationQuery] = useState("");
  const { suggestions } = useLocationSearch(locationQuery);

  const [form, setForm] = useState({
    moments_name: featured?.moments_name ?? "",
    //issue is here is that when the location_name
    // remains the same its causing a error for the coordinates
    close_moment: featured?.close_moment ?? false,
    location: featured?.location ?? "",
    location_name: featured?.location_name ?? "",
    moment_start: normalizeDate(featured?.moment_start),
    moment_end: normalizeDate(featured?.moment_end),
    description: featured?.description ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    //should update the date portion not the time
    //value would be the date you insert followed by time.
    if (name === "moment_start_date") {
      const time = form.moment_start.split("T")[1] || "00:00";
      setForm((prev) => ({ ...prev, moment_start: `${value}T${time}` }));
    }

    //Takes the first part of the date
    //parses it with the value you place.
    if (name === "moment_start_time") {
      const date = form.moment_start.split("T")[0];
      setForm((prev) => ({ ...prev, moment_start: `${date}T${value}` }));
    }
    //Takes the first part of the date
    //parses it with the value you place.
    if (name === "moment_end_time") {
      const date = form.moment_start.split("T")[0];
      setForm((prev) => ({ ...prev, moment_end: `${date}T${value}` }));
    }
  };

  //PostgreSQL's point type expects the l
  // iteral string format (x,y) but you're sending it a JSON object.
  //Location_name and location are a pair and must be changed together
  const handleSave = async () => {
    if (!featured) return;

    let location = form.location;

    //if the form location name does match the db
    //call the reverseGeoLocate to Search
    if (form.location_name !== featured.location_name) {
      const suggestions: any[] = [];
      await reverseGeolocateSearch(
        form.location_name,
        (results) => suggestions.push(...results),
        () => {},
      );
      const first = suggestions[0];
      if (first?.center) {
        location = `(${first.center[0]},${first.center[1]})`;
      }
    }

    updateMoment({ ...featured, ...form, location } as MomentProp, {
      onSuccess: () => setUtils("history"),
    });
  };

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
            name="moments_name"
            type="text"
            value={form.moments_name}
            onChange={handleChange}
            placeholder="What's the occasion?"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1 relative">
          <label className={labelClass}>Location</label>
          <input
            name="location_name"
            type="text"
            value={form.location_name}
            onChange={(e) => {
              handleChange(e);
              setLocationQuery(e.target.value);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Where is it happening?"
            className={inputClass}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-sm border border-white/10 bg-[#1a1a1a] overflow-hidden">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      location_name: s.label,
                      location: s.center
                        ? `(${s.center[0]},${s.center[1]})`
                        : prev.location,
                    }));
                    setLocationQuery("");
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-white/60 hover:bg-white/5 hover:text-white/90 transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Date</label>
            <input
              name="moment_start_date"
              type="date"
              value={form.moment_start ? form.moment_start.slice(0, 10) : ""}
              onChange={(e) => handleDateTimeChange(e)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Start</label>
            <input
              name="moment_start_time"
              type="time"
              value={form.moment_start ? form.moment_start.slice(11, 16) : ""}
              onChange={(e) => handleDateTimeChange(e)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>End</label>
            <input
              name="moment_end_time"
              type="time"
              value={form.moment_end ? form.moment_end.slice(11, 16) : ""}
              onChange={(e) => handleDateTimeChange(e)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows={5}
            maxLength={300}
            value={form.description}
            onChange={(e) => handleChange(e)}
            placeholder="Set the vibe..."
            className={inputClass}
          />
        </div>

        {/* Close Moment */}
        <div className="flex items-center justify-between px-3 py-2.5 border border-white/8 rounded-sm bg-white/3">
          <div className="flex flex-col gap-0.5">
            <span className="text-white/70 text-xs font-medium">
              Close Moment
            </span>
            <span className="text-white/30 text-[10px]">
              No new check-ins or attendees
            </span>
          </div>
          <motion.button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, close_moment: !prev.close_moment }))
            }
            className={`w-10 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${
              form.close_moment ? "bg-white/30" : "bg-white/10"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5"
              animate={{
                left: form.close_moment ? "calc(100% - 18px)" : "2px",
              }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.button>
        </div>
      </div>

      {/* Save */}
      <motion.button
        onClick={handleSave}
        disabled={isPending}
        className="relative w-full bg-white text-black text-xs uppercase tracking-widest font-medium py-3 rounded-sm overflow-hidden mt-auto disabled:opacity-40 cursor-pointer"
        whileHover={{ scale: isPending ? 1 : 1.02 }}
        whileTap={{ scale: isPending ? 1 : 0.97 }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
        {isPending ? "Saving..." : isSuccess ? "Saved ✓" : "Save Changes"}
      </motion.button>
    </motion.div>
  );
}
