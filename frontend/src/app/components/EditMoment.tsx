import React, { useState } from "react";
import { motion } from "motion/react";
import { EditIcon } from "./icons";
import { useUpdateMomentsByOwner, useRegenerateVibes } from "@/hooks/useMoments";
import { normalizeDate } from "@/lib/momentsUtil";
import {
  useLocationSearch,
  geocodeQuery,
} from "@/hooks/useReverseGeolocateSearch";
import { openEventCard } from "@/stores/store";

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

  const { mutateAsync: regenerateVibes, isPending: isRegenerating } =
    useRegenerateVibes();

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [locationQuery, setLocationQuery] = useState("");
  const { suggestions, retrieve } = useLocationSearch(locationQuery);

  const [form, setForm] = useState({
    moments_name: featured?.moments_name ?? "",
    //issue is here is that when the location_name
    // remains the same its causing a error for the coordinates
    close_moment: featured?.close_moment ?? false,
    location: featured?.location ?? "",
    location_name: featured?.location_name ?? "",
    moment_start: normalizeDate(featured?.moment_start),
    moment_end: normalizeDate(featured?.moment_end) || normalizeDate(featured?.moment_start),
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
      const startTime = form.moment_start.split("T")[1] || "00:00";
      const endTime = form.moment_end.split("T")[1] || "00:00";
      setForm((prev) => ({
        ...prev,
        moment_start: `${value}T${startTime}`,
        moment_end: `${value}T${endTime}`,
      }));
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

  const descriptionChanged =
    form.description.trim() !== (featured?.description ?? "").trim();

  const handleSave = async () => {
    if (!featured) return;

    let location = form.location;

    if (form.location_name !== featured.location_name) {
      const result = await geocodeQuery(form.location_name);
      if (result?.center) {
        location = `(${result.center[0]},${result.center[1]})`;
      }
    }

    // If description changed, regenerate AI-derived fields before saving.
    // Failures are silent — save proceeds with existing vibes/principles/etc.
    let generated: Partial<MomentProp> = {};
    if (descriptionChanged && form.description.trim()) {
      try {
        generated = await regenerateVibes({
          description: form.description,
          moments_name: form.moments_name,
          location_name: form.location_name,
        });
      } catch {
        generated = {};
      }
    }

    const updatedMoment = {
      ...featured,
      ...form,
      location,
      ...generated,
    } as MomentProp;

    updateMoment(updatedMoment, {
      onSuccess: () => {
        // Reflect changes in the open EventCard without a page reload
        const storeMoment = openEventCard.getState().moment;
        if (storeMoment?.id === featured.id) {
          openEventCard.getState().openEvent(updatedMoment);
        }
        setUtils("history");
      },
    });
  };

  const inputClass =
    "bg-white/6 border border-white/10 rounded-sm px-3 py-2.5 text-black dark:text-white text-sm placeholder:text-black/20 dark:placeholder:text-white/20 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all w-full";

  const labelClass = "text-black/30 dark:text-white/30 text-xs uppercase tracking-wide";

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
          className="text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 text-xs uppercase tracking-wide transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex items-center gap-x-2 text-black/50 dark:text-white/50">
          <EditIcon size={14} color="currentColor" />
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
            <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-sm border border-white/10 overflow-hidden" style={{ background: `rgb(var(--bg-elevated))` }}>
              {suggestions.map((s, i) => (
                <button
                  key={s.mapbox_id ?? i}
                  onClick={async () => {
                    const center = await retrieve(s.mapbox_id);
                    setForm((prev) => ({
                      ...prev,
                      location_name: s.label,
                      location: center ? `(${center[0]},${center[1]})` : prev.location,
                    }));
                    setLocationQuery("");
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black/90 dark:hover:text-white/90 transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
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
          <div className="grid grid-cols-2 gap-3">
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
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label className={labelClass}>Description</label>
            {descriptionChanged && (
              <span
                className="text-[9px] tracking-[1.5px] uppercase font-medium"
                style={{ color: "rgba(var(--fg),0.35)" }}
              >
                ✦ will regenerate
              </span>
            )}
          </div>
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
            <span className="text-black/70 dark:text-white/70 text-xs font-medium">
              Close Moment
            </span>
            <span className="text-black/30 dark:text-white/30 text-[10px]">
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
        disabled={isRegenerating || isPending}
        className="relative w-full bg-white text-black text-xs uppercase tracking-widest font-medium py-3 rounded-sm overflow-hidden mt-auto disabled:opacity-40 cursor-pointer"
        whileHover={{ scale: isRegenerating || isPending ? 1 : 1.02 }}
        whileTap={{ scale: isRegenerating || isPending ? 1 : 0.97 }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
        {isRegenerating
          ? "Regenerating..."
          : isPending
          ? "Saving..."
          : isSuccess
          ? "Saved ✓"
          : "Save Changes"}
      </motion.button>
    </motion.div>
  );
}
