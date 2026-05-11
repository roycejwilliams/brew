import { motion } from "motion/react";
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
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<"details" | "generating" | "done">(
    "details",
  );
  const [createdMomentId, setCreatedMomentId] = useState<string | null>(null);

  // Single source of truth for coordinates
  const [locationCoordinates, setLocationCoordinates] = useState<
    [number, number] | null
  >(null);

  const { coordinates, locationName: near } = useNearbyLocation(
    setForm,
    selectedLocation === "near",
  );
  const { locationName: around } = useGetLocationName(viewport?.center ?? null);
  const { mutate: createMoment, isPending } = useCreateMoment();
  const { user } = useUserStore();
  const { mutate: inviteAttendee } = useInviteAttendeeToMoment();

  // Set coordinates when near mode resolves GPS
  useEffect(() => {
    if (selectedLocation === "near" && coordinates) {
      setLocationCoordinates(coordinates);
    }
  }, [coordinates, selectedLocation]);

  // Set coordinates when area is confirmed
  useEffect(() => {
    if (selectedLocation === "area" && selectedArea) {
      setLocationCoordinates(selectedArea.center);
    }
  }, [selectedArea, selectedLocation]);

  // Set coordinates when venue is selected
  useEffect(() => {
    if (selectedLocation === "venue" && venue?.center) {
      setLocationCoordinates(venue.center);
    }
  }, [venue, selectedLocation]);

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
    if (!locationCoordinates) return;
    setStage("generating");
    try {
      const imageUrl = file ? ((await uploadImage(file)) ?? "") : "";
      const generated = await generateContent(form.description);
      if (!generated) {
        setStage("details");
        return;
      }

      createMoment(
        {
          ...form,
          creator_id: user?.id,
          image: imageUrl,
          ...generated,
          location: `(${locationCoordinates[0]},${locationCoordinates[1]})`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        {
          onSuccess: (data) => {
            const momentId = data.data.data.id;
            selectedUsers.forEach((user) => {
              inviteAttendee({
                moment_id: momentId,
                recipient: user.username,
              });
            });
            setCreatedMomentId(momentId);
            setStage("done");
          },
          onError: () => setStage("details"),
        },
      );
    } catch (error) {
      console.error("Error generating moment:", error);
      setStage("details");
    }
  };

  const locationChange = (location: "near" | "area" | "venue") => {
    setSelectedLocation(location);
    // Reset coordinates when switching modes
    setLocationCoordinates(null);
    if (location !== "area") {
      handleChangeArea();
    }
    if (location !== "venue") {
      setVenue(null);
    }
    if (location === "near" && coordinates) {
      setViewport({ center: coordinates, zoom: 11, bearing: 0, pitch: 0 });
    }
  };

  const isLocationSet =
    (selectedLocation === "near" && locationCoordinates !== null) ||
    (selectedLocation === "area" && selectedArea !== null) ||
    (selectedLocation === "venue" &&
      venue !== null &&
      locationCoordinates !== null);

  useEffect(() => {
    const typingTimeout = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(typingTimeout);
  }, [isTyping]);

  useEffect(() => {
    if (!coordinates || viewport !== null) return;
    setViewport({ center: coordinates, zoom: 11, bearing: 0, pitch: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  if (stage === "generating") return <GeneratingScreen />;
  if (stage === "done")
    return <DoneScreen momentId={createdMomentId} onClose={onClose} />;

  return (
    <div className="text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <ImageDrop setForm={setForm} onFileSelect={setFile} />
        <div className="flex flex-col justify-start gap-4 h-full">
          <div>
            <LocationSelector
              selectedLocation={selectedLocation}
              onLocationChange={locationChange}
            />
            <div className="mt-4">
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

          {isLocationSet && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full bg-[#1c1c1c] backdrop-blur-xl border border-white/8 rounded-xl shadow-2xl shadow-black/20 overflow-hidden mt-auto">
                <textarea
                  name="description"
                  rows={5}
                  maxLength={300}
                  value={form.description}
                  onChange={(e) => handleChange(e)}
                  placeholder="Set the vibe..."
                  className="w-full bg-transparent text-white/90 text-sm placeholder:text-white/30 resize-none px-5 pt-4 pb-10 focus:outline-none"
                />
                <div className="absolute bottom-0 left-0 right-0 px-5 py-2.5 flex justify-between items-center border-t border-white/6">
                  <span className="text-[10px] uppercase tracking-wider text-white/20 font-medium">
                    Description
                  </span>
                  <span className="text-[10px] text-white/25 tabular-nums">
                    {form.description?.length}/300
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {!isTyping && isLocationSet && (
            <motion.button
              onClick={handleGenerate}
              disabled={isPending}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: isPending ? 1 : 1.02 }}
              whileTap={{ scale: isPending ? 1 : 0.97 }}
              className="w-fit mt-auto px-5 py-3.5 rounded-md text-sm font-medium text-white/90 bg-[#1c1c1c] backdrop-blur-xl border border-white/8 shadow-2xl shadow-black/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <motion.span
                key={isPending ? "creating" : "idle"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {isPending ? "Creating..." : "Generate Moment"}
              </motion.span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
