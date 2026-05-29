"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useState, DragEvent, ChangeEvent } from "react";

interface ImageProp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onFileSelect: (file: File | null) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ImageDrop({ onFileSelect }: ImageProp) {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      onFileSelect(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>): void => {
          if (e.target?.result) setImage(e.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        if (e.target?.result) setImage(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setImage(null);
    onFileSelect(null);
  };

  return (
    <div className="flex items-center justify-center rounded-2xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={`relative w-full max-w-md aspect-7/8 transition-all ${
          isDragging ? "ring-2 ring-white/30 scale-[1.02]" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(var(--fg),0.02)",
                border: isDragging
                  ? "1px solid rgba(var(--fg),0.2)"
                  : "1px dashed rgba(var(--fg),0.1)",
              }}
            >
              {/* Top shimmer */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    `linear-gradient(90deg, transparent, rgba(var(--fg),0.06), transparent)`,
                  pointerEvents: "none",
                }}
              />

              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-4 px-6 text-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(var(--fg),0.05)",
                    border: "1px solid rgba(var(--fg),0.09)",
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="rgba(var(--fg),0.5)"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <p
                    className="text-sm font-medium tracking-[-0.1px]"
                    style={{ color: "rgba(var(--fg),0.6)" }}
                  >
                    Drop a photo here
                  </p>
                  <p
                    className="text-[11px] tracking-[-0.1px]"
                    style={{ color: "rgba(var(--fg),0.25)" }}
                  >
                    or tap to choose from your library
                  </p>
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </motion.div>
          ) : (
            <motion.div
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(var(--fg),0.08)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />

              {/* Gradient scrim */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
                }}
              />

              {/* Remove button — always visible on mobile, hover on desktop */}
              <button
                onClick={handleRemove}
                className="absolute top-3 right-3 flex items-center gap-1.5 cursor-pointer transition-all duration-150 sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                style={{
                  background: "rgba(0,0,0,0.65)",
                  border: "1px solid rgba(var(--fg),0.12)",
                  borderRadius: 8,
                  padding: "5px 10px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 2l8 8M10 2l-8 8"
                    stroke="rgba(var(--fg),0.8)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  className="text-[10px] font-medium tracking-[-0.1px]"
                  style={{ color: "rgba(var(--fg),0.75)" }}
                >
                  Remove
                </span>
              </button>

              {/* Replace label */}
              <label
                htmlFor="file-replace"
                className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150"
                style={{
                  background: "rgba(0,0,0,0.65)",
                  border: "1px solid rgba(var(--fg),0.1)",
                  borderRadius: 8,
                  padding: "7px 12px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(var(--fg),0.6)"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span
                  className="text-[10px] font-medium tracking-[-0.1px]"
                  style={{ color: "rgba(var(--fg),0.6)" }}
                >
                  Replace photo
                </span>
              </label>
              <input
                id="file-replace"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
