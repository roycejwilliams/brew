"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useState, useEffect } from "react";
import LocationSelector from "./locationSelector";
import ChooseAreaPanel from "./chooseAreaPanel";
import NearYou from "./nearYou";
import Venue from "./Venue";
import ImageDrop from "./imageDrop";
import { useNearbyLocation } from "@/hooks/useNearbyLocation";
import { supabase } from "@/lib/supabase";
import { useGetLocationName } from "@/hooks/useGetLocationName";
import { useCreateMoment } from "@/hooks/useMoments";
import { useUserStore } from "@/stores/useUserStore";
import { generateContent } from "@/hooks/useGenerateContent";
import GeneratingScreen from "./GeneratingScreen";
import DoneScreen from "./DoneScreen";
import { useInviteAttendeeToMoment } from "@/hooks/useInvites";

type MomentSelectionProp = "start" | "circle" | "people" | "nearby" | "confirm";

type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing?: number;
  pitch?: number;
};

interface SelectModal {
  selectedModal: MomentSelectionProp;
  form: {
    moments_name: string;
    location: string;
    location_name: string;
    moment_start: string;
    visibility_type: string;
    moment_end: string;
    description: string;
    close_moment: string;
    principles: string[];
    expectations: string[];
    vibes: string[];
    faqs: { question: string; answer: string }[];
    circle_id?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onClose: () => void;
  selectedUsers: UserProp[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

const inputClass =
  "w-full bg-transparent text-white/90 text-sm placeholder:text-white/25 resize-none px-4 pt-4 pb-10 focus:outline-none tracking-[-0.1px]";

export default function MomentDetails({
  selectedModal,
  form,
  setForm,
  handleChange,
  onClose,
  selectedUsers,
}: SelectModal) {
  const [selectedLocation, setSelectedLocation] = useState<
    "near" | "area" | "venue"
  >("near");
  const [selectedArea, setSelectedArea] = useState<{
    center: [number, number];
    zoom: number;
  } | null>(null);
  const [venue, setVenue] = useState<{
    label: string;
    center?: [number, number];
  } | null>(null);
  const [viewport, setViewport] = useState<MapViewport | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasTyped, setHasTyped] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<"details" | "generating" | "done" | "error">(
    "details",
  );
  const [createdMomentId, setCreatedMomentId] = useState<string | null>(null);
  const [locationCoordinates, setLocationCoordinates] = useState<
    [number, number] | null
  >(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { coordinates, locationName: near } = useNearbyLocation(
    setForm,
    selectedLocation === "near",
  );
  const { locationName: around } = useGetLocationName(viewport?.center ?? null);
  const { mutate: createMoment, isPending } = useCreateMoment();
  const { user } = useUserStore();
  const { mutate: inviteAttendee } = useInviteAttendeeToMoment();

  useEffect(() => {
    if (selectedLocation === "near" && coordinates)
      setLocationCoordinates(coordinates);
  }, [coordinates, selectedLocation]);

  useEffect(() => {
    if (selectedLocation === "area" && selectedArea)
      setLocationCoordinates(selectedArea.center);
  }, [selectedArea, selectedLocation]);

  useEffect(() => {
    if (selectedLocation === "venue" && venue?.center)
      setLocationCoordinates(venue.center);
  }, [venue, selectedLocation]);

  useEffect(() => {
    const t = setTimeout(() => setIsTyping(false), 800);
    return () => clearTimeout(t);
  }, [isTyping]);

  useEffect(() => {
    if (!coordinates || viewport !== null) return;
    setViewport({ center: coordinates, zoom: 11, bearing: 0, pitch: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  const handleChangeArea = () => {
    setSelectedArea(null);
    setIsConfirming(false);
  };

  const uploadImage = async (file: File) => {
    const fileName = `moments/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("brew-image")
      .upload(fileName, file, { upsert: true });
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data: urlData } = supabase.storage
      .from("brew-image")
      .getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleGenerate = async () => {
    if (!locationCoordinates) {
      setLocationError("Location unavailable — switch to Area or Venue.");
      return;
    }
    setLocationError(null);
    setStage("generating");
    try {
      const imageUrl = file ? ((await uploadImage(file)) ?? "") : "";
      const generated = await generateContent(form.description);
      if (!generated) {
        setStage("error");
        return;
      }

      createMoment(
        {
          ...form,
          creator_id: user?.id,
          image: imageUrl,
          ...generated,
          location: `(${locationCoordinates[0]},${locationCoordinates[1]})`,
          moment_start: form.moment_start
            ? new Date(form.moment_start).toISOString()
            : form.moment_start,
          moment_end: form.moment_end
            ? new Date(form.moment_end).toISOString()
            : form.moment_end,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        {
          onSuccess: (data) => {
            const momentId = data.data.data.id;
            selectedUsers.forEach((u) =>
              inviteAttendee({ moment_id: momentId, recipient: u.username }),
            );
            setCreatedMomentId(momentId);
            setStage("done");
          },
          onError: () => setStage("error"),
        },
      );
    } catch (error) {
      console.error("Error generating moment:", error);
      setStage("error");
    }
  };

  const locationChange = (location: "near" | "area" | "venue") => {
    setSelectedLocation(location);
    setLocationCoordinates(null);
    if (location !== "area") handleChangeArea();
    if (location !== "venue") setVenue(null);
    if (location === "near" && coordinates) {
      setViewport({ center: coordinates, zoom: 11, bearing: 0, pitch: 0 });
    }
  };

  const isLocationSet =
    selectedLocation === "near" ||
    (selectedLocation === "area" && selectedArea !== null) ||
    (selectedLocation === "venue" &&
      venue !== null &&
      locationCoordinates !== null);

  if (stage === "generating")
    return (
      <AnimatePresence mode="wait">
        <GeneratingScreen key="generating" />
      </AnimatePresence>
    );
  if (stage === "done")
    return (
      <AnimatePresence mode="wait">
        <DoneScreen key="done" momentId={createdMomentId} onClose={onClose} />
      </AnimatePresence>
    );
  if (stage === "error")
    return (
      <AnimatePresence mode="wait">
      <motion.div
        key="error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-10"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,80,50,0.08)",
            border: "1px solid rgba(255,80,50,0.2)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4m0 4h.01" stroke="rgba(255,100,80,0.8)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="rgba(255,100,80,0.4)" strokeWidth="1.5" />
          </svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: EASE }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <h2 className="text-white/80 text-xl font-medium tracking-[-0.3px]">
            Moment didn&apos;t go through.
          </h2>
          <p className="text-white/30 text-sm tracking-[-0.1px] max-w-[240px]">
            Something went wrong on our end. Your details are still saved.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, ease: EASE }}
          className="flex items-center gap-4"
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-white/35 hover:text-white/60 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => setStage("details")}
            className="px-5 py-2.5 text-sm text-white/80 bg-white/5 border border-white/10 rounded-md hover:bg-white/8 hover:border-white/18 transition-all cursor-pointer tracking-[-0.1px]"
          >
            Try again
          </button>
        </motion.div>
      </motion.div>
      </AnimatePresence>
    );

  return (
    <div className="w-full h-full text-white px-4 sm:px-6 pb-24 sm:pb-10 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
        {/* Image drop */}
        <div className="w-full">
          <ImageDrop setForm={setForm} onFileSelect={setFile} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Location selector */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Top shimmer */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              }}
            />
            <div className="p-4">
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationChange={locationChange}
              />
              <div className="mt-3">
                {selectedLocation === "near" && (
                  <NearYou place={near as string} />
                )}
                {selectedLocation === "area" && viewport && (
                  <ChooseAreaPanel
                    onAreaSelected={(center, zoom) => {
                      setSelectedArea({ center, zoom });
                      setLocationCoordinates(center);
                    }}
                    viewport={viewport as MapViewport}
                    isAreaConfirmed={isConfirming}
                    onAreaCleared={handleChangeArea}
                    selectedArea={selectedArea}
                    setViewport={setViewport}
                    place={around as string}
                    onCancel={() => setSelectedLocation("area")}
                  />
                )}
                {selectedLocation === "venue" && viewport && (
                  <Venue
                    selectedModal={selectedModal}
                    viewport={viewport as MapViewport}
                    selectedVenue={venue}
                    setSelectedVenue={(v) => {
                      setVenue(v);
                      if (v?.center) setLocationCoordinates(v.center);
                    }}
                    setForm={setForm}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Description textarea */}
          {isLocationSet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <div
                className="relative w-full rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Top shimmer */}
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                  }}
                />
                <textarea
                  name="description"
                  rows={5}
                  maxLength={300}
                  value={form.description}
                  onChange={(e) => {
                    setIsTyping(true);
                    setHasTyped(true);
                    handleChange(e);
                  }}
                  placeholder="Set the vibe..."
                  className={inputClass}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-2.5 flex justify-between items-center"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="text-[9px] tracking-[2px] uppercase font-medium"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    Description
                  </span>
                  <span
                    className="text-[10px] tabular-nums tracking-[-0.1px]"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    {form.description?.length}/300
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Generate button */}
          {locationError && (
            <p className="text-xs text-center" style={{ color: "rgba(255,100,80,0.8)" }}>
              {locationError}
            </p>
          )}
          <AnimatePresence mode="wait">
            {hasTyped && !isTyping && isLocationSet && (
              <motion.button
                key="generate-btn"
                onClick={handleGenerate}
                disabled={isPending}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
                whileTap={{ scale: isPending ? 1 : 0.97 }}
                className="w-full flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-sm font-medium tracking-[-0.1px] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  color: "#0c0c0c",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span>{isPending ? "Creating..." : "Generate Moment"}</span>
                {!isPending && (
                  <span style={{ opacity: 0.4, fontSize: 16 }}>✦</span>
                )}
                {isPending && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      borderColor: "rgba(0,0,0,0.1)",
                      borderTopColor: "rgba(0,0,0,0.5)",
                    }}
                  />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
