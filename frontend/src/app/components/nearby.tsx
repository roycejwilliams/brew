"use client";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";
import { usePrevNextButtons } from "./CarouselArrowButtons";
import styles from "@/app/(app)/pulse/embla.module.css";
import Image from "next/image";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

export default function Nearby() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, skipSnaps: true },
    [WheelGesturesPlugin()],
  );
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const nearbyEvents = [
    {
      image: "/EventRecap-1.jpg",
      event: "DJ Set at The Standard Rooftop",
      eventSpace: "The Standard, Downtown LA",
      people: ["Open Crowd"],
      date: "9:00 PM",
    },
    {
      image: "/EventRecap-2.jpg",
      event: "Late Night Tacos on Sunset",
      eventSpace: "El Flamin’ Taco Truck",
      people: ["Local Spot"],
      date: "10:30 PM",
    },
    {
      image: "/EventRecap-3.jpg",
      event: "Pop-Up Art Show in Arts District",
      eventSpace: "Warehouse Gallery · Arts District",
      people: ["Creatives"],
      date: "8:00 PM",
    },
    {
      image: "/EventRecap-4.jpg",
      event: "Pickup Soccer at Pan Pacific Park",
      eventSpace: "Pan Pacific Park Fields",
      people: ["Anyone Welcome"],
      date: "7:30 PM",
    },
  ];
  return (
    <>
      <div className="flex justify-between ">
        <h2 className="text-sm uppercase">Nearby Tonight</h2>
        <span className="text-xs"></span>
      </div>
      {/* Nearby Tonight Carousel */}
      <div className={styles.embla}>
        <div className={styles.embla__viewport} ref={emblaRef}>
          <div className={styles.embla__container}>
            {nearbyEvents.map((nearby, i) => (
              <div
                key={i}
                className={`${styles.embla__slide} gap-x-4 rounded-md w-[65%] cursor-pointer hover:-translate-y-4  bg-[#2b2b2b]/50 overflow-hidden duration-200 ease-in-out transition duration-300 relative shadow-xl border border-white/10`}
              >
                <div className="w-full h-37.5 pb-2  relative ">
                  <Image
                    src={nearby.image}
                    alt={nearby.event}
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full flex  flex-col justify-between px-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm w-[65%]">
                      {nearby.event}
                    </span>
                    <span className="font-medium text-xs text-white/50 ">
                      {nearby.date}
                    </span>
                  </div>
                  <div className=" text-sm  my-2">
                    <p className="text-sm">{nearby.eventSpace}</p>
                    <span className="text-white/50 text-sm mt-4">
                      {nearby.people.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
