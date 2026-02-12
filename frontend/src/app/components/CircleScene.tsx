"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CalendarDate } from "@internationalized/date";
import { AnimatePresence, motion } from "motion/react";

interface Circle {
  id: string;
  name: string;
  members: string[]; // or User[]
  image: string;
}

interface CircleSceneProp {
  circles: Circle[];
  selectedCircle: Circle | null;
  activeIndex: number;
}

type MarkerGeometry = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  visible: boolean;
};

export default function CircleScene({
  circles,
  activeIndex,
  selectedCircle,
}: CircleSceneProp) {
  const circle = circles[activeIndex];
  const [markerIndex, setMarkerIndex] = useState<number>(0);
  const markerRadius = 250;
  const windowSize = 24;
  const cadence = Math.round(360 / windowSize); // angular spacing between pins
  const markerOffset = 50; // tweak until it matches Figma
  const markerData = Array.from({ length: 28 });

  const cx = 250;
  const cy = 250;

  //Calculates the markers around the radius
  //Configuring the left and right arrows we are going to have to make it a prop

  //gsap configuration
  gsap.registerPlugin(useGSAP);

  const container = useRef(null);

  const rotation = useRef({ value: 0 });

  const getMarkerGeometry = (
    i: number,
    rotationValue: number,
    activeIndex: number,
  ): MarkerGeometry => {
    const relativePosition =
      (i - rotationValue + markerData.length) % markerData.length;

    const angleDeg = relativePosition * cadence - 90;
    const angleRad = (Math.PI * angleDeg) / 180;

    const x = cx + Math.cos(angleRad) * (markerRadius + markerOffset);
    const y = cy + Math.sin(angleRad) * (markerRadius + markerOffset);

    const visible =
      (i - activeIndex + markerData.length) % markerData.length < windowSize;

    return {
      x,
      y,
      rotate: angleDeg + 90,
      scale: i === activeIndex ? 0.65 : 0.5,
      visible,
    };
  };

  //Visible Markers only for the first 24
  const visibleMarkers = (i: number) => {
    const g = getMarkerGeometry(i, rotation.current.value, markerIndex);

    return {
      transform: `translate(${g.x}px, ${g.y}px) rotate(${g.rotate}deg) scale(${
        g.scale
      })`,
      opacity: g.visible ? 1 : 0,
    };
  };

  //GSAP
  useGSAP(
    () => {
      const markers = gsap.utils.toArray<SVGGElement>(".circle-marker");

      gsap.to("#outerCircle", {
        rotate: markerIndex * cadence + 360,
        transformOrigin: "50% 50%",
        ease: "power1.inOut",
      }); //Outer Circle Rotation

      gsap.to("#innerCircle", {
        rotate: -markerIndex * cadence + 180,
        transformOrigin: "50% 50%",
        ease: "power1.inOut",
      }); // Inner Circle Rotation

      gsap.to(rotation.current, {
        value: markerIndex,
        duration: 0.6,
        ease: "power1.inOut",
        onUpdate: () => {
          markers.forEach((marker, i) => {
            const g = getMarkerGeometry(i, rotation.current.value, markerIndex);

            if (g.visible) {
              gsap.to(marker, {
                x: g.x,
                y: g.y,
                rotate: g.rotate,
                scale: g.scale,
                opacity: i === markerIndex ? 1 : 0.6,
                duration: 0.6,
                ease: "power1.inOut",
              });
            } else {
              gsap.to(marker, {
                opacity: 0,
                duration: 0.6,
                ease: "power1.inOut",
              });
            }
          });
        },
      });
    },
    { scope: container, dependencies: [markerIndex] },
  );

  //NEXT MARKER
  const nextMarker = () => {
    setMarkerIndex((i) => (i + 1) % markerData.length);
  };

  //PREV MARKER
  //Previous Marker
  const prevMarker = () => {
    setMarkerIndex((i) => (i - 1 + markerData.length) % markerData.length);
  };

  return (
    <>
      <motion.section
        ref={container}
        className=" mx-auto max-w-4xl relative flex shrink-0 justify-center  items-center"
      >
        {!selectedCircle && (
          <div className="absolute w-fit font-medium z-10 mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-center my-auto  text-[#ececec]/75"
              >
                <h1 className="text-lg">{circle.name}</h1>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <motion.svg
          width="625"
          height="625"
          viewBox="-50 -50 602.5 602.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full xl:max-w-150 max-w-100 h-auto"
          preserveAspectRatio="xMidYMid meet"
          initial={{ opacity: 0, rotate: -5 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <g filter="url(#filter0_d_652_266)">
            <motion.circle
              id="outerCircle"
              cx={cx}
              cy={cy}
              r={markerRadius}
              stroke="white"
              strokeLinecap="round"
              strokeDasharray="10 10"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
            />
          </g>
          <g filter="url(#filter1_d_652_266)">
            <motion.circle
              id="innerCircle"
              cx={cx}
              cy={cy}
              r="212.5"
              stroke="white"
              strokeLinecap="round"
              strokeDasharray="5 10"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
            />
          </g>
          <g filter="url(#filter1_d_652_266)">
            <defs>
              <clipPath id="center-clip">
                <circle cx={cx} cy={cy} r={175} />
              </clipPath>
            </defs>

            <AnimatePresence mode="wait">
              <motion.image
                key={circle.image}
                href={circle.image}
                x={cx - 175}
                y={cy - 175}
                width={350}
                height={350}
                clipPath="url(#center-clip)"
                preserveAspectRatio="xMidYMid slice"
                className="brightness-110"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            </AnimatePresence>

            <motion.circle
              cx={cx}
              cy={cy}
              r={175}
              fill="black"
              stroke="#3A3A3A"
              strokeWidth="1"
              opacity="0.15"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </g>
          <g className="markers">
            {markerData.map((_, i) => (
              <g key={i} className="circle-marker" style={visibleMarkers(i)}>
                <text
                  x={26}
                  y={26}
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {i}
                </text>
                <defs>
                  <clipPath id={`clip-${i}`}>
                    <circle cx="24" cy="24" r="24" />
                  </clipPath>
                </defs>
                <path
                  d="M26 58V96.5
       M51 26
       C51 39.8071 39.8071 51 26 51
       C12.1929 51 1 39.8071 1 26
       C1 12.1929 12.1929 1 26 1
       C39.8071 1 51 12.1929 51 26Z"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
          <defs>
            <filter
              id="filter0_d_652_266"
              x="0"
              y="0"
              width="509"
              height="509"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_652_266"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_652_266"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_d_652_266"
              x="37"
              y="37"
              width="434"
              height="434"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_652_266"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_652_266"
                result="shape"
              />
            </filter>
          </defs>
        </motion.svg>
      </motion.section>
    </>
  );
}
