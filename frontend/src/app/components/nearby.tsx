"use client";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";
import styles from "@/app/(app)/pulse/embla.module.css";
import Image from "next/image";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { motion } from "motion/react";
import { useGetNearbyMoments } from "@/hooks/useMoments";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { openEventCard } from "@/stores/store";
import { useRouter } from "next/navigation";

interface NearbyProps {
  filter: "tonight" | "tomorrow" | "week";
  selectedCoordinates?: [number, number] | null;
  activeScope: "here" | "nearby" | "area";
  selectedLocation?: string | null;
  moments?: MomentProp[];
}

export default function Nearby({
  filter,
  selectedCoordinates,
  activeScope,
  moments: momentsProp,
}: NearbyProps) {
  const [emblaRef] = useEmblaCarousel(
    { loop: false, skipSnaps: true, align: "start" },
    [WheelGesturesPlugin()],
  );

  const { coordinates } = useCurrentLocation();
  const openCard = openEventCard((state) => state.openEvent);
  const router = useRouter();

  //gives you active coordinates or falls back to the current
  //doesnt need to be by selected coordinates yet
  const activeCoords = selectedCoordinates ?? coordinates;

  //Scoped radius
  const scopeToRadius: Record<string, number> = {
    here: 1000,
    nearby: 10000,
    area: 50000,
  };

  // Skip internal fetch when parent provides moments directly
  const { data: nearbyData, isLoading } = useGetNearbyMoments({
    lng: !momentsProp ? activeCoords?.[0] : undefined,
    lat: !momentsProp ? activeCoords?.[1] : undefined,
    radius: scopeToRadius[activeScope] ?? 10000,
    filter,
  });

  const moments: MomentProp[] = momentsProp ?? nearbyData?.data?.data ?? [];

  if (!activeCoords && !momentsProp) {
    return (
      <div className="space-y-2">
        <p className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium px-1">
          Nearby
        </p>
        <div
          className="rounded-md px-4 py-5 text-center space-y-1"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-xs text-white/40 tracking-[-0.1px]">
            Allow location access to see nearby moments.
          </p>
        </div>
      </div>
    );
  }

  if (!momentsProp && isLoading) {
    return (
      <div className="space-y-2">
        <p className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium px-1">
          Nearby
        </p>
        <div className="flex gap-2 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="shrink-0 w-40 h-52 rounded-md animate-pulse bg-white/3 border border-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  if (moments.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium px-1">
          Nearby
        </p>
        <div
          className="rounded-md px-4 py-5 text-center space-y-1"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-xs text-white/40 tracking-[-0.1px]">
            Nothing nearby right now.
          </p>
          <p className="text-[11px] text-white/20 tracking-[-0.1px]">
            Expand your search or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium">
          Nearby
        </p>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full tabular-nums"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {moments.length}
        </span>
      </div>

      <div className={styles.embla}>
        <div className={styles.embla__viewport} ref={emblaRef}>
          <div className={styles.embla__container}>
            {moments.map((moment, i) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.06,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => {
                  openCard(moment);
                  router.push(`/moments/${moment.id}`, { scroll: false });
                }}
                className={`${styles.embla__slide} rounded-md overflow-hidden cursor-pointer relative`}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  flex: "0 0 75%",
                  minWidth: 0,
                }}
              >
                {/* Image */}
                <div className="relative w-full h-64">
                  <Image
                    src={moment.image || "/brew.jpg"}
                    alt={moment.moments_name || "moment"}
                    fill
                    sizes="(max-width: 768px) 75vw, 200px"
                    className="object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-linear-to-t bg-center from-black/70 via-transparent to-transparent" />

                  {/* Time badge */}
                  {moment.moment_start && (
                    <span
                      className="absolute top-2 right-2 text-[10px] text-white/70 px-2 py-0.5 rounded-md"
                      style={{
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid rgba(0,0,0,0.3)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {new Date(moment.moment_start).toLocaleTimeString(
                        "en-US",
                        { hour: "numeric", minute: "2-digit", hour12: true },
                      )}
                    </span>
                  )}

                  {/* Name overlaid on image bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-medium text-white/90 leading-snug tracking-[-0.1px] truncate">
                      {moment.moments_name}
                    </p>
                    {moment.location_name && (
                      <p className="text-[11px] text-white/40 tracking-[-0.1px] truncate mt-0.5">
                        {moment.location_name}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
