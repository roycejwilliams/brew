"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PlusIcon } from "./icons";
import GridSpacious from "./icons/gridSpacious";
import GridDefault from "./icons/gridDefault";
import GridDense from "./icons/gridDense";
import { motion } from "motion/react";

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

export default function EventRecap() {
  const eventPhotos = [
    "/EventRecap-1.jpg",
    "/EventRecap-3.jpg",
    "/EventRecap-2.jpg",
    "/EventRecap-4.jpg",
    "/EventRecap-5.jpg",
    "/EventRecap-6.jpg",
    "/EventRecap-7.jpg",
    "/EventRecap-8.jpg",
    "/EventRecap-9.jpg",
    "/EventRecap-10.jpg",
  ];

  const [density, setDensity] = useState<GridDensity>("dense");
  const hasPhotos = eventPhotos.length > 0;

  return (
    <section className="flex flex-col gap-10">
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
              : "Upload your photos and videos from the night — it starts with you."}
          </p>
        </div>

        {/* Density toggles — div wrapper to avoid button-in-button */}
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
            // key on the outermost element — no fragment wrapper
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
              {/* Render icon inside a div so it never nests buttons */}
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
        className={`w-full grid ${gridCols[density]} space-x-4 space-y-4`}
        animate={{ gap: gridGap[density] }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ willChange: "transform" }}
      >
        {hasPhotos &&
          eventPhotos.map((photo, i) => (
            <motion.div
              key={photo}
              layout="position"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.03, ease: EASE }}
              whileHover="hover"
              className="relative overflow-hidden group"
            >
              <div className="aspect-square  relative overflow-hidden">
                <Image
                  src={photo}
                  fill
                  alt=""
                  className="object-contain mx-auto"
                  style={{
                    transition: "transform 0.5s ease",
                  }}
                />
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  variants={{ hover: { opacity: 1 } }}
                  transition={{ duration: 0.2 }}
                  style={{ background: "rgba(0,0,0,0.25)" }}
                />
              </div>
            </motion.div>
          ))}

        {/* Upload card */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer"
          style={{
            border: "1px dashed rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
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
        </motion.div>
      </motion.div>
    </section>
  );
}
