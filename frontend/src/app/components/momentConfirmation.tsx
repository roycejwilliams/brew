import { Variants, motion } from "motion/react";
import React, { useState, DragEvent, ChangeEvent } from "react";
import Asterisk from "./icons/AsterikIcon";
import LocationSelector from "./locationSelector";
import ChooseAreaPanel from "./chooseAreaPanel";

interface MomentConfirmationProps {}

type LocationIntent = "near" | "area" | "venue";

export default function MomentConfirmation({}: MomentConfirmationProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationIntent>("near");

  const [selectedArea, setSelectedArea] = useState<{
    center: [number, number];
    zoom: number;
  } | null>(null);

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
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>): void => {
          if (e.target?.result) {
            setImage(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const buttonVariants: Variants = {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1.06,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const iconVariants: Variants = {
    rest: {
      rotate: 0,
    },
    hover: {
      rotate: 360,
      transition: {
        rotate: { duration: 0.75, ease: "easeOut" },
      },
    },
  };

  const revealVariants: Variants = {
    rest: {
      width: 0,
      opacity: 0,
    },
    hover: {
      width: "auto",
      opacity: 1,
      marginLeft: 2,
      transition: {
        width: { duration: 0.35, ease: "easeOut" },
        opacity: { duration: 0.2, delay: 0.1 },
      },
    },
  };

  const locationChange = (location: LocationIntent) => {
    setSelectedLocation(location);
  };

  return (
    <div className=" text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Upload Area */}
        <div className="flex items-center justify-center">
          <div
            className={`relative w-full max-w-md aspect-7/8 rounded-2xl overflow-hidden transition-all ${
              isDragging ? "ring-4 ring-white/50 scale-105" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!image ? (
              <div className="w-full h-full bg-linear-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-sm border border-white/10 shadow-lg flex items-center justify-center">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-white/60 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-white/80 text-sm">
                    Drop photo here or click
                  </p>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative w-full h-full group">
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Right: Filters */}
        <div className="flex flex-col justify-center gap-4">
          {/* Location */}
          <div>
            <LocationSelector
              selectedLocation={selectedLocation}
              onLocationChange={locationChange}
            />
            <div className="mt-4">
              {selectedLocation === "near" && (
                <div className="mt-3 p-4 bg-neutral-900/60 border border-neutral-700/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-neutral-400">
                          Location
                        </span>
                        <span className="text-sm text-neutral-200">
                          Around Downtown San Francisco
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {selectedLocation === "area" && (
                <ChooseAreaPanel
                  onAreaSelected={(center, zoom) => {
                    setSelectedArea({ center, zoom });
                    setSelectedLocation("near");
                    console.log("Area selected:", center, zoom);
                  }}
                  onCancel={() => {
                    setSelectedLocation("area");
                  }}
                />
              )}{" "}
              {selectedLocation === "venue" && <div></div>}
            </div>
          </div>

          {/* Tone */}
          {/* <div>
            <h3 className="text-lg mb-4 text-neutral-300">Tone</h3>
            <div className="grid grid-cols-3 gap-3">
              <button className="px-6 py-3 border border-neutral-600 rounded-lg hover:bg-neutral-800 transition-colors text-sm">
                Casual
              </button>
              <button className="px-6 py-3 border border-neutral-600 rounded-lg hover:bg-neutral-800 transition-colors text-sm">
                Open-ended
              </button>
              <button className="px-6 py-3 border border-neutral-600 rounded-lg hover:bg-neutral-800 transition-colors text-sm">
                Invite-only
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button className="px-6 py-3 border border-neutral-600 rounded-lg hover:bg-neutral-800 transition-colors text-sm">
                Lowkey
              </button>
              <button className="px-6 py-3 border border-neutral-600 rounded-lg hover:bg-neutral-800 transition-colors text-sm">
                Pull-up
              </button>
            </div>
          </div> */}

          {/* Start Button */}
          {/* <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            className=" p-4 mt-4 w-fit duration-500 bg-linear-to-br from-[#555555] to-black hover:from-[#723630] hover:to-[#19535F] backdrop-blur-lg flex items-center justify-center cursor-pointer border border-[#3D3D3D] hover:border-white/10 rounded-lg text-base"
          >
            <motion.div variants={iconVariants}>
              <Asterisk size={24} color="white" />
            </motion.div>
            <motion.div
              variants={revealVariants}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-white text-sm">Start the moment</span>
            </motion.div>
          </motion.button> */}
        </div>
      </div>
    </div>
  );
}
