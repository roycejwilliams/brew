"use client";
import React, { useRef, useState } from "react";
import { ArrowDropdownCaretSortSelectArrow } from "react-basicons";
import CircleControls from "./circleControls";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function CircleScene() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const markerRadius = 250;
  const windowSize = 24;
  const cadence = Math.round(360 / windowSize); // angular spacing between pins
  const markerOffset = 35; // tweak until it matches Figma
  const markerData = Array.from({ length: 28 });

  const cx = 250;
  const cy = 250;

  //Calculates the markers around the radius
  //Configuring the left and right arrows we are going to have to make it a prop

  //Next Marker

  //gsap configuration
  gsap.registerPlugin(useGSAP);

  const container = useRef(null);

  const rotation = useRef({ value: 0 });

  //Marker Data

  const visibleMarkers = (i: number) => {
    const relativePosition =
      (i - rotation.current.value + markerData.length) % markerData.length;
    const angleDeg = relativePosition * cadence - 90;
    const angleRad = (Math.PI * angleDeg) / 180;

    const x =
      Math.round(
        (cx + Math.cos(angleRad) * (markerRadius + markerOffset)) * 100
      ) / 100;
    const y =
      Math.round(
        (cy + Math.sin(angleRad) * (markerRadius + markerOffset)) * 100
      ) / 100;

    return {
      transform: `translate(${x}px, ${y}px) rotate(${angleDeg + 90}deg) scale(${
        i === activeIndex ? 0.65 : 0.5
      })`,
      opacity: 0,
    };
  };

  useGSAP(
    () => {
      const markers = gsap.utils.toArray<SVGGElement>(".circle-marker");

      console.log(markers.length);

      gsap.to("#outerCircle", {
        rotate: activeIndex * cadence + 360,
        transformOrigin: "50% 50%",
        ease: "power1.inOut",
      });

      gsap.to("#innerCircle", {
        rotate: -activeIndex * cadence + 180,
        transformOrigin: "50% 50%",
        ease: "power1.inOut",
      });

      gsap.to(rotation.current, {
        value: activeIndex,
        duration: 0.6,
        ease: "power1.inOut",
        onUpdate: () => {
          const currentVisible = new Set<number>();

          markers.forEach((marker, i) => {
            const relativePosition =
              (i - rotation.current.value + markers.length) % markers.length;
            const angleDeg = relativePosition * cadence - 90;
            const angleRad = (Math.PI * angleDeg) / 180;
            const isVisible =
              (i - activeIndex + markers.length) % markers.length < windowSize;

            if (isVisible) currentVisible.add(i);

            const x = cx + Math.cos(angleRad) * (markerRadius + markerOffset);
            const y = cy + Math.sin(angleRad) * (markerRadius + markerOffset);

            if (isVisible) {
              gsap.to(marker, {
                x,
                y,
                rotate: angleDeg + 90,
                opacity: i === activeIndex ? 1 : 0.6,
                scale: i === activeIndex ? 0.65 : 0.5,
                duration: 0.6,
                ease: "power1.inOut",
              });
            } else {
              gsap.to(marker, { opacity: 0, duration: 0.6 });
            }
          });
        },
      });
    },
    { scope: container, dependencies: [activeIndex] }
  );

  const nextMarker = () => {
    setActiveIndex((i) => (i + 1) % markerData.length);
  };

  //Previous Marker
  const prevMarker = () => {
    setActiveIndex((i) => (i - 1 + markerData.length) % markerData.length);
  };

  return (
    <>
      <section
        ref={container}
        className="mt-32 mx-auto max-w-4xl flex flex-col justify-center items-center relative"
      >
        <div className=" text-center w-fit ">
          <h2 className="">@firstlast</h2>
          <div className="w-fit mx-auto">
            <ArrowDropdownCaretSortSelectArrow color="currentColor" size={28} />
          </div>
        </div>
        <div className="absolute w-fit h-1/3 flex flex-col justify-between">
          <h2 className="font-light text-sm text-center">Attending</h2>
          <div className="text-center ">
            <h1 className="text-lg ">First Pour</h1>
            <span className="font-light">Sat. Jan 3rd 2025</span>
          </div>
        </div>
        <svg
          width="525"
          height="525"
          viewBox="-43.5 -50 625 650"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full xl:max-w-[540px] max-w-[400px] h-auto ml-2"
          preserveAspectRatio="xMidYMid meet"
        >
          <g filter="url(#filter0_d_652_266)">
            <circle
              id="outerCircle"
              cx={cx}
              cy={cy}
              r={markerRadius}
              stroke="white"
              strokeLinecap="round"
              strokeDasharray="10 10"
            />
          </g>
          <g filter="url(#filter1_d_652_266)">
            <circle
              id="innerCircle"
              cx={cx}
              cy={cy}
              r="212.5"
              stroke="white"
              strokeLinecap="round"
              strokeDasharray="5 10"
            />
          </g>
          <g filter="url(#filter1_d_652_266)">
            <defs>
              <clipPath id="center-clip">
                <circle cx={cx} cy={cy} r={175} />
              </clipPath>
            </defs>

            <image
              href="/ex2.jpg"
              x={cx - 175}
              y={cy - 175}
              width={350}
              height={350}
              clipPath="url(#center-clip)"
              preserveAspectRatio="xMidYMid slice"
            />

            <circle
              cx={cx}
              cy={cy}
              r={175}
              fill="black"
              stroke="#3A3A3A"
              strokeWidth="1"
              opacity="0.5"
            />
          </g>
          <g className="markers">
            {markerData.map((_, i) => (
              <g key={i} className="circle-marker" style={visibleMarkers(i)}>
                {" "}
                <text
                  x={26} // Center of your marker (relative to the group)
                  y={26} // Center of your marker (relative to the group)
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {i}
                </text>
                {/* A place to store things */}
                <defs>
                  {/* creates a clip and give it an id*/}
                  <clipPath id={`clip-${i}`}>
                    {/* id is important to avoid using the same svg id */}
                    {/* so now you created a circle */}
                    <circle cx="24" cy="24" r="24" />
                    {/* cx = means the circle's center is 26 units to the right from the svg's origin  */}
                    {/* cy = means the circle's center is 26 units down from the svg's origin  */}
                    {/* r = the distance from the center to the edge */}
                  </clipPath>
                </defs>
                {/* <image
                  href="/pexels-olya.jpg"
                  x="0"
                  y="0"
                  width="48"
                  height="48"
                  clipPath={`url(#clip-${i})`}
                  preserveAspectRatio="xMidYMid slice" //how it fills the cropping window
                /> */}
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
        </svg>
      </section>
      <CircleControls nextMarker={nextMarker} prevMarker={prevMarker} />
    </>
  );
}
