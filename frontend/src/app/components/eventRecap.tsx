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

      addPhoto({
        moment_id: eventCard.id,
        image_url: urlData.publicUrl,
      });
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
    <section className="flex flex-col gap-10">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-8">
        <div className="flex flex-col gap-2 max-w-sm">
          <p className="text-white/20 text-[10px] tracking-widest uppercase font-medium">
            Recap
          </p>
          <h2
            className="text-white font-semibold tracking-[-0.5px] leading-tight"
            style={{ fontSize: 28 }}
          >
            {hasPhotos ? "Join the recap" : "Be the first to share"}
          </h2>
          <p className="text-white/35 text-sm tracking-[-0.1px] leading-relaxed">
            {hasPhotos
              ? "Add your moments from the night and help shape the story."
              : "Upload your photos from the night — it starts with you."}
          </p>
        </div>

        {/* Density toggles */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
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
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  transition={{ duration: 0.25, ease: EASE }}
                />
              )}
              <div className="relative z-10 pointer-events-none">
                <Icon
                  color={
                    density === key
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.25)"
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
        className={`w-full grid ${gridCols[density]}`}
        animate={{ gap: gridGap[density] }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ willChange: "transform" }}
      >
        <AnimatePresence>
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              layout="position"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, delay: i * 0.03, ease: EASE }}
              whileHover="hover"
              className="relative overflow-hidden group flex flex-col gap-1.5"
            >
              <div className="aspect-square relative overflow-hidden rounded-sm">
                <Image
                  src={photo.image_url}
                  fill
                  alt=""
                  className="object-cover"
                  style={{ transition: "transform 0.5s ease" }}
                />
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  variants={{ hover: { opacity: 1 } }}
                  transition={{ duration: 0.2 }}
                  style={{ background: "rgba(0,0,0,0.25)" }}
                />

                {/* Delete button — only for uploader */}
                {photo.uploader_id === user?.id && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    variants={{ hover: { opacity: 1 } }}
                    transition={{ duration: 0.2 }}
                    onClick={() =>
                      deletePhoto({
                        moment_id: eventCard?.id as string,
                        photo_id: photo.id,
                      })
                    }
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer z-10"
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="text-white/60 text-xs leading-none">
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
                <span className="text-white/30 text-[10px] tracking-[-0.1px] truncate">
                  {photo.username}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Upload card */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer rounded-sm"
          style={{
            border: "1px dashed rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.02)",
            opacity: uploading ? 0.5 : 1,
          }}
        >
          {uploading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
          ) : (
            <>
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <PlusIcon size={18} color="#fff" />
              </div>
              <p className="text-white/25 text-xs tracking-[-0.1px] text-center px-4">
                Drop your recap here.
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
