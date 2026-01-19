"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PlusIcon } from "./icons";
import GridSpacious from "./icons/gridSpacious";
import GridDefault from "./icons/gridDefault";
import GridDense from "./icons/gridDense";
import { motion } from "motion/react";

type GridDensity = "spacious" | "default" | "dense";

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

  const gridCols = {
    spacious: "grid-cols-2",
    default: "grid-cols-3",
    dense: "grid-cols-4",
  };

  return (
    <section className="py-24 ">
      <div className="mb-16  flex justify-between items-center">
        {" "}
        <div className="flex flex-col gap-y-4 max-w-sm">
          <h2 className="text-4xl ">
            {eventPhotos.length === 0
              ? "Be the first to share your recap"
              : "Join the recap"}{" "}
          </h2>
          <p className="text-white/75">
            {eventPhotos.length === 0
              ? "Upload your photos and videos from the night — it starts with you."
              : "Add your moments from the night and help shape the story."}{" "}
          </p>
        </div>
        <div className="flex gap-x-4">
          <GridSpacious
            color="#fff"
            size={24}
            changeGrid={() => setDensity("dense")}
            active={density === "dense"}
          />
          <GridDefault
            color="#fff"
            size={24}
            changeGrid={() => setDensity("default")}
            active={density === "default"}
          />
          <GridDense
            color="#fff"
            size={24}
            changeGrid={() => setDensity("spacious")}
            active={density === "spacious"}
          />
        </div>
      </div>
      <motion.div
        style={{ willChange: "transform" }}
        className={`w-full grid gap-8 ${gridCols[density]}`}
      >
        {eventPhotos.length > 0 &&
          eventPhotos.map((photo) => (
            <motion.div
              key={photo}
              layout="position"
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1], // easeOutCubic
              }}
              className="relative overflow-hidden "
            >
              <div className="aspect-3/4 w-full h-full overflow-hidden ">
                <Image
                  src={photo}
                  fill
                  alt=""
                  className="object-contain transition-transform duration-500 ease-out  hover:scale-[1.03] "
                />
              </div>
            </motion.div>
          ))}
        <div className=" flex justify-center items-center">
          <button className="flex flex-col gap-4 aspect-3/4 group hover:-translate-y-2 ease-in-out duration-300 transition-all items-center justify-center border-white/10 border w-full h-full p-8 backdrop-blur-xl rounded-sm cursor-pointer">
            <h2 className="text-sm group-hover:scale-105 duration-300 ease-in-out transition-all">
              Drop your recap here.
            </h2>
            <div className="group-hover:scale-105 duration-300 ease-in-out transition-all">
              <PlusIcon size={40} color="currentColor" />
            </div>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
