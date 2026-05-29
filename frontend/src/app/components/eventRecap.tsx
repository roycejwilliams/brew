"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { PlusIcon } from "./icons";
import GridSpacious from "./icons/gridSpacious";
import GridDefault from "./icons/gridDefault";
import GridDense from "./icons/gridDense";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores/useUserStore";
import { openEventCard } from "@/stores/store";
import {
  useGetMomentPhotos,
  useAddMomentPhoto,
  useDeleteMomentPhoto,
} from "@/hooks/useMoments";

type GridDensity = "spacious" | "default" | "dense";

const EASE = [0.16, 1, 0.3, 1] as const;

const gridCols: Record<GridDensity, string> = {
  spacious: "grid-cols-2",
  default: "grid-cols-3",
  dense: "grid-cols-4",
};

// On mobile, cap at 2 columns regardless of density
const mobileGridCols: Record<GridDensity, string> = {
  spacious: "grid-cols-1",
  default: "grid-cols-2",
  dense: "grid-cols-2",
};

const gridGap: Record<GridDensity, number> = {
  spacious: 16,
  default: 10,
  dense: 6,
};

type MomentPhoto = {
  id: string;
  moment_id: string;
  uploader_id: string;
  image_url: string;
  created_at: string;
  username: string;
  profile_image: string | null;
};

export default function EventRecap() {
  const [density, setDensity] = useState<GridDensity>("dense");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useUserStore();
  const eventCard = openEventCard((state) => state.moment);

  const { data: photosData } = useGetMomentPhotos(eventCard?.id);
  const { mutate: addPhoto } = useAddMomentPhoto();
  const { mutate: deletePhoto } = useDeleteMomentPhoto();

  const photos: MomentPhoto[] = photosData?.data?.data ?? [];
  const hasPhotos = photos.length > 0;

  const handleUpload = async (file: File) => {
    if (!eventCard?.id) return;
    setUploading(true);
    try {
      const fileName = `moment-photos/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("brew-image")
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("brew-image")
        .getPublicUrl(fileName);

      addPhoto({ moment_id: eventCard.id, image_url: urlData.publicUrl });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <section className="flex flex-col gap-8 sm:gap-10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 sm:gap-8">
        <div className="flex flex-col gap-2 min-w-0">
          <p
            className="text-[10px] tracking-widest uppercase font-medium"
            style={{ color: "rgba(var(--fg),0.2)" }}
          >
            Recap
          </p>
          <h2
            className="text-black dark:text-white font-semibold tracking-[-0.5px] leading-tight"
            style={{ fontSize: "clamp(20px, 5vw, 28px)" }}
          >
            {hasPhotos ? "Join the recap" : "Be the first to share"}
          </h2>
          <p
            className="text-sm tracking-[-0.1px] leading-relaxed"
            style={{ color: "rgba(var(--fg),0.35)" }}
          >
            {hasPhotos
              ? "Add your moments from the night and help shape the story."
              : "Upload your photos from the night — it starts with you."}
          </p>
        </div>

        {/* Density toggles — hidden on mobile, not useful at small sizes */}
        <div
          className="hidden sm:flex items-center gap-1 p-1 rounded-lg shrink-0"
          style={{
            background: "rgba(var(--fg),0.04)",
            border: "1px solid rgba(var(--fg),0.07)",
          }}
        >
          {(
            [
              { key: "dense" as GridDensity, Icon: GridSpacious },
              { key: "default" as GridDensity, Icon: GridDefault },
              { key: "spacious" as GridDensity, Icon: GridDense },
            ] as const
          ).map(({ key, Icon }) => (
            <motion.div
              key={key}
              whileTap={{ scale: 0.92 }}
              onClick={() => setDensity(key)}
              className="relative flex items-center justify-center cursor-pointer"
              style={{ width: 32, height: 32, borderRadius: 8 }}
            >
              {density === key && (
                <motion.div
                  layoutId="density-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "rgba(var(--fg),0.1)",
                    border: "1px solid rgba(var(--fg),0.1)",
                  }}
                  transition={{ duration: 0.25, ease: EASE }}
                />
              )}
              <div className="relative z-10 pointer-events-none">
                <Icon
                  color={
                    density === key
                      ? "rgba(var(--fg),0.8)"
                      : "rgba(var(--fg),0.25)"
                  }
                  size={16}
                  changeGrid={() => setDensity(key)}
                  active={density === key}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className={`w-full grid ${mobileGridCols[density]} sm:${gridCols[density]}`}
        animate={{ gap: gridGap[density] }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ willChange: "transform" }}
      >
        <AnimatePresence>
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03, ease: EASE }}
              whileHover="hover"
              className="relative overflow-hidden group flex flex-col gap-1.5"
            >
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <Image
                  src={photo.image_url}
                  fill
                  alt=""
                  className="object-cover"
                />
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  variants={{ hover: { opacity: 1 } }}
                  transition={{ duration: 0.2 }}
                  style={{ background: "rgba(0,0,0,0.25)" }}
                />

                {/* Delete — always visible on mobile, hover on desktop */}
                {photo.uploader_id === user?.id && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    variants={{ hover: { opacity: 1 } }}
                    // Always show on mobile
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150"
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      border: "1px solid rgba(var(--fg),0.1)",
                    }}
                    onClick={() =>
                      deletePhoto({
                        moment_id: eventCard?.id as string,
                        photo_id: photo.id,
                      })
                    }
                  >
                    <span
                      className="leading-none text-xs"
                      style={{ color: "rgba(var(--fg),0.6)" }}
                    >
                      ✕
                    </span>
                  </motion.button>
                )}
              </div>

              {/* Uploader info */}
              <div className="flex items-center gap-1.5 px-0.5">
                <div className="w-4 h-4 rounded-full overflow-hidden relative shrink-0">
                  <Image
                    src={photo.profile_image || "/profile_4.png"}
                    fill
                    alt={photo.username}
                    className="object-cover"
                  />
                </div>
                <span
                  className="text-[10px] tracking-[-0.1px] truncate"
                  style={{ color: "rgba(var(--fg),0.3)" }}
                >
                  {photo.username}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Upload card */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="aspect-square flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer rounded-lg"
          style={{
            border: "1px dashed rgba(var(--fg),0.1)",
            background: "rgba(var(--fg),0.02)",
            opacity: uploading ? 0.5 : 1,
          }}
        >
          {uploading ? (
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{
                borderColor: "rgba(var(--fg),0.15)",
                borderTopColor: "rgba(var(--fg),0.6)",
              }}
            />
          ) : (
            <>
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  background: "rgba(var(--fg),0.06)",
                  border: "1px solid rgba(var(--fg),0.08)",
                }}
              >
                <PlusIcon size={16} color="#fff" />
              </div>
              <p
                className="text-[10px] sm:text-xs tracking-[-0.1px] text-center px-3"
                style={{ color: "rgba(var(--fg),0.25)" }}
              >
                Drop your recap here.
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
