"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import NeedsAttention from "./needsAttention";
import Confirmation from "./confirmation";
import Nearby from "./nearby";
import ScopeLocator from "./scopeLocator";
import { ToggleState } from "../utils/toggleState";
import {
  AnimatePresence,
  motion,
  useMotionValue,
} from "motion/react";
import { PinIcon, BellIcon } from "./icons";
import { useUserStore } from "@/stores/useUserStore";
import { useGetCityName } from "@/hooks/useGetLocationName";
import {
  useInviteUserMomentView,
  useInviteUserCircleView,
} from "@/hooks/useInvites";

type ScopeType = "here" | "nearby" | "area";
type TimeFilter = "tonight" | "tomorrow" | "week";

interface OpenModal {
  openModal: (type: "notifications") => void;
  id: string;
  userCoordinates?: [number, number] | null;
  setSelectedCoordinates: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
  selectedCoordinates?: [number, number] | null;
  isMobile?: boolean;
  eventsOpen?: boolean;
  setEventsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

// Peek = how much sheet is visible in collapsed state (px from bottom)
const PEEK_HEIGHT = 260;

export default function Events({
  openModal,
  id,
  userCoordinates,
  setSelectedCoordinates,
  selectedCoordinates,
  isMobile = false,
  eventsOpen = false,
  setEventsOpen,
}: OpenModal) {
  const [openScope, setOpenScope] = useState<boolean>(false);
  const openScopeLocator = () => ToggleState(setOpenScope);
  const { user } = useUserStore();

  const { cityName } = useGetCityName(userCoordinates ?? null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [filter, setFilter] = useState<TimeFilter>("tonight");
  const [isFullHeight, setIsFullHeight] = useState(false);

  const { data: momentInvitesData } = useInviteUserMomentView(id);
  const { data: circleInvitesData } = useInviteUserCircleView(
    user?.id as string,
  );
  const [activeScope, setActiveScope] = useState<ScopeType>("nearby");

  const pendingCount =
    (momentInvitesData?.data?.data ?? []).filter(
      (i: { status: string }) => i.status === "pending",
    ).length +
    (circleInvitesData?.data?.data ?? []).filter(
      (i: { status: string }) => i.status === "pending",
    ).length;

  const timeLabel = {
    tonight: "Tonight",
    tomorrow: "Tomorrow",
    week: "This Week",
  }[filter];

  // --- Drag logic for mobile sheet ---
  const dragY = useMotionValue(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  function onDragEnd(
    _: unknown,
    info: { offset: { y: number }; velocity: { y: number } },
  ) {
    const { offset, velocity } = info;

    if (isFullHeight) {
      // Dragging down from full height
      if (offset.y > 80 || velocity.y > 400) {
        // Snap to peek
        setIsFullHeight(false);
        dragY.set(0);
      } else {
        dragY.set(0);
      }
    } else {
      // Dragging up from peek
      if (offset.y < -80 || velocity.y < -400) {
        // Snap to full
        setIsFullHeight(true);
        dragY.set(0);
      } else if (offset.y > 80 || velocity.y > 400) {
        // Drag down past peek — close sheet
        setEventsOpen?.(false);
        setIsFullHeight(false);
        dragY.set(0);
      } else {
        dragY.set(0);
      }
    }
  }

  // Shared panel content
  const panelContent = (
    <>
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-white/3 to-transparent pointer-events-none z-10" />

      {/* Header */}
      <div className="relative z-10 px-5 pt-6 pb-4 flex items-start justify-between border-b border-white/5">
        <div className="space-y-0.5">
          <p className="text-[10px] tracking-[3px] uppercase text-white/20 font-medium">
            BR3W
          </p>
          <h2 className="text-base font-medium tracking-[-0.2px] text-white/90">
            Pulse
          </h2>
          <p className="text-xs text-white/30 tracking-[-0.1px]">
            Here&apos;s what&apos;s next
          </p>
        </div>

        <motion.button
          onClick={() => openModal("notifications")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex items-center justify-center w-8 h-8 rounded-md cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <BellIcon size={15} color="#fff" />
          {pendingCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#98473E]/60" />
          )}
        </motion.button>
      </div>

      {/* Location strip */}
      <div className="relative z-10 px-5 py-3 border-b border-white/5">
        <motion.div
          className="flex items-center justify-between px-3 py-2 rounded-md"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <PinIcon size={12} color="#fff" className="shrink-0" />
            <p className="text-[11px] text-white/50 tracking-[-0.1px] truncate">
              {selectedLocation ?? cityName ?? "Locating..."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <div className="w-px h-3 bg-white/10" />
            <span className="text-xs text-white/30 tracking-[-0.1px] whitespace-nowrap">
              {timeLabel}
            </span>
            <motion.button
              onClick={openScopeLocator}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer shrink-0"
              style={{
                background: openScope
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <PinIcon size={11} color="#fff" />
            </motion.button>
          </div>
        </motion.div>
        <AnimatePresence mode="popLayout">
          {openScope && (
            <ScopeLocator
              onClose={openScopeLocator}
              activeScope={activeScope}
              setActiveScope={setActiveScope}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              userCoordinates={userCoordinates}
              setSelectedCoordinates={setSelectedCoordinates}
              filter={filter}
              setFilter={setFilter}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
        <NeedsAttention />
        <Confirmation />
        <Nearby
          filter={filter}
          selectedCoordinates={selectedCoordinates}
          activeScope={activeScope}
          selectedLocation={selectedLocation}
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
    </>
  );

  // ---- MOBILE LAYOUT ----
  if (isMobile) {
    return (
      <AnimatePresence>
        {eventsOpen && (
          <motion.div
            ref={sheetRef}
            key="mobile-sheet"
            drag="y"
            dragConstraints={{ top: 0, bottom: PEEK_HEIGHT }}
            dragElastic={{ top: 0.05, bottom: 0.2 }}
            onDragEnd={onDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: isFullHeight ? 0 : `calc(100% - ${PEEK_HEIGHT}px)` }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl overflow-hidden"
            style={{
              y: dragY,
              background: "rgba(8,8,8,0.95)",
              backdropFilter: "blur(24px)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              // account for mobile nav bar height
              paddingBottom: "72px",
              height: "100dvh",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0 touch-none">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.15)" }}
              />
            </div>

            {panelContent}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ---- DESKTOP LAYOUT ----
  return (
    <section className=" right-0 h-full flex z-20">
      {/* Main panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-80 h-full flex flex-col border-l border-white/6 text-white overflow-hidden"
        style={{ background: "rgba(8,8,8,0.85)", backdropFilter: "blur(24px)" }}
      >
        {panelContent}
      </motion.div>

      {/* Profile column */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="w-14 h-full flex flex-col items-center pt-6 gap-4"
        style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}
      >
        <Link href={`/profile/${user?.id}`}>
          <motion.div
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-9 h-9 rounded-md overflow-hidden relative border cursor-pointer"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Image
              src={user?.profile_image || "/profile_4.png"}
              alt="profile"
              fill
              className="object-cover"
            />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
