"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
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
  circleIndex?: number; // controls circle index
  markerIndex?: number; // controls marker index
}

type MarkerGeometry = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  visible: boolean;
};

export default function CircleScene({
  circleIndex,
  selectedCircle,
  markerIndex,
}: CircleSceneProp) {
  const markerRadius = 250;
  const windowSize = selectedCircle?.members.length!;
  const cadence = Math.round(360 / windowSize); // angular spacing between pins
  const markerOffset = 25; // tweak until it matches Figma

  const cx = 250;
  const cy = 250;

  //gsap configuration
  gsap.registerPlugin(useGSAP);

  const container = useRef<HTMLElement>(null);
  const rotation = useRef({ value: 0 });
  const prevIndexRef = useRef(markerIndex);

  const getMarkerGeometry = (
    i: number,
    rotationValue: number,
    activeIndex: number,
  ): MarkerGeometry => {
    //Place the markers in their relative positions
    const relativePosition =
      (i - rotationValue + selectedCircle?.members.length!) %
      selectedCircle?.members.length!;

    //Calculations for degree
    const angleDeg = relativePosition * cadence - 90;

    //Calculations for radians
    const angleRad = (Math.PI * angleDeg) / 180;

    //creates the position
    const x = cx + Math.cos(angleRad) * (markerRadius + markerOffset) - 24;
    const y = cy + Math.sin(angleRad) * (markerRadius + markerOffset) - 24;

    const visible =
      (i - rotationValue + selectedCircle?.members.length!) %
        selectedCircle?.members.length! <
      windowSize!;

    return {
      x,
      y,
      rotate: angleDeg + 90,
      scale: i === activeIndex ? 0.8 : 0.5,
      visible,
    };
  };

  //Don't need to be debugged - only paints the picture beforehand.
  useLayoutEffect(() => {
    if (!container.current || !selectedCircle) return;

    // Reset rotation state for the new circle
    rotation.current.value = 0;
    prevIndexRef.current = markerIndex ?? 0;

    // Kill any in-flight tweens so they don't fight the reset
    gsap.killTweensOf(rotation.current);

    const markers = gsap.utils.toArray<SVGGElement>(".circle-marker");

    markers.forEach((marker, i) => {
      const g = getMarkerGeometry(i, 0, markerIndex ?? 0);

      gsap.set(marker, {
        transformOrigin: "24px 24px",
        x: g.x,
        y: g.y,
        rotate: g.rotate,
        scale: g.scale,
        opacity: g.visible ? (i === (markerIndex ?? 0) ? 1 : 0.6) : 0,
      });
    });
  }, [selectedCircle?.id]); // fires when you switch circles

  //GSAP - FIXED: Removed inline style conflicts, proper DOM selection
  useGSAP(
    () => {
      if (!container.current) return;

      const markers = gsap.utils.toArray<SVGGElement>(".circle-marker");

      const prev = prevIndexRef.current; //holds the last marker index value
      const next = markerIndex; //holds the next marker value
      let target = next; //the point at which we want to go

      console.log("prev:", prev, "next:", next, "target:", target);

      const halfLength = selectedCircle?.members.length! / 2;
      // shortest path between prev and next accounting for wrap
      let diff = (next ?? 0) - (prev ?? 0);

      // normalize diff to always take the shortest path
      if (diff > halfLength) diff -= selectedCircle?.members.length!;
      if (diff < -halfLength) diff += selectedCircle?.members.length!;

      // offset from current interpolated value instead of jumping to absolute index

      target = rotation.current.value + diff;

      //this is what keeps the old value referenced
      prevIndexRef.current = next;

      gsap.killTweensOf(["#outerCircle", "#innerCircle", rotation.current]);

      gsap.to("#outerCircle", {
        rotate: markerIndex ?? 0 * cadence + 360,
        transformOrigin: "50% 50%",
        duration: 0.6,
        ease: "power1.inOut",
      });

      gsap.to("#innerCircle", {
        rotate: -(markerIndex ?? 0) * cadence + 180,
        transformOrigin: "50% 50%",
        duration: 0.6,
        ease: "power1.inOut",
      });

      gsap.to(rotation.current, {
        value: target,
        duration: 0.6,
        ease: "power1.inOut",
        onUpdate: () => {
          markers.forEach((marker, i) => {
            if (!marker) return;

            //marker get repositioned each time
            const g = getMarkerGeometry(
              i,
              rotation.current.value,
              markerIndex ?? 0,
            );

            if (g.visible) {
              gsap.set(marker, {
                x: g.x,
                y: g.y,
                rotate: g.rotate,
              });
              gsap.to(marker, {
                scale: g.scale,
                opacity: i === markerIndex ? 1.5 : 0.6,
                duration: 0.5,
                ease: "back.out(1.7)",
                overwrite: "auto",
              });
            } else {
              gsap.to(marker, {
                scale: 0.3,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                overwrite: "auto",
              });
            }
          });
        },
      });
    },
    {
      scope: container,
      dependencies: [markerIndex],
    },
  );

  return (
    <motion.section
      key="circle-scene"
      ref={container}
      className="mx-auto max-w-md relative flex shrink-0 justify-center items-center"
    >
      {selectedCircle && (
        <div className="absolute w-fit font-medium z-10 mx-auto pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={circleIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-center my-auto text-[#ececec]/75"
            >
              <h1 className="text-lg">{selectedCircle?.name}</h1>
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
            strokeOpacity={0.9}
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray="10 10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
            strokeOpacity={0.75}
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray="5 10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
          />
        </g>
        <g filter="url(#filter1_d_652_266)">
          <defs>
            <clipPath id="center-clip">
              <circle cx={cx} cy={cy} r={175} />
            </clipPath>
          </defs>

          <motion.image
            key={selectedCircle?.id}
            href={selectedCircle?.image}
            x={cx - 175}
            y={cy - 175}
            width={350}
            height={350}
            clipPath="url(#center-clip)"
            preserveAspectRatio="xMidYMid slice"
            className="brightness-75"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />

          <motion.circle
            cx={cx}
            cy={cy}
            r={175}
            fill="none"
            stroke="#3A3A3A"
            strokeWidth="1"
            strokeOpacity={0.3}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />
        </g>
        <g className="markers">
          {selectedCircle?.members.map((_, i) => (
            <g
              key={i}
              className="circle-marker"
              // REMOVED: inline styles that conflict with GSAP
            >
              <circle cx="24" cy="24" r="24" fill="#1c1c1c" opacity={0.8} />
              <text
                x={24}
                y={24}
                fill="white"
                fontSize="14"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={0.9}
              >
                {i + 1}
              </text>
              <path
                d="M24 48V76
       M48 24
       C48 37.2548 37.2548 48 24 48
       C10.7452 48 0 37.2548 0 24
       C0 10.7452 10.7452 0 24 0
       C37.2548 0 48 10.7452 48 24Z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeOpacity={0.6}
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
  );
}
