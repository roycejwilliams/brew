"use client";
import React, { useState, useRef } from "react";
import NeedsAttention from "./needsAttention";
import Confirmation from "./confirmation";
import Nearby from "./nearby";
import ScopeLocator from "./scopeLocator";
import { ToggleState } from "../utils/toggleState";
import { AnimatePresence, motion, useMotionValue, PanInfo } from "motion/react";
import { PinIcon, BellIcon } from "./icons";
import SunIcon from "./icons/SunIcon";
import MoonIcon from "./icons/MoonIcon";
import { useTheme } from "@/providers/ThemeProvider";
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
  setSelectedZoom?: React.Dispatch<React.SetStateAction<number>>;
  selectedCoordinates?: [number, number] | null;
  isMobile?: boolean;
  eventsOpen?: boolean;
  setEventsOpen?: (open: boolean) => void;
  filter: TimeFilter;
  setFilter: React.Dispatch<React.SetStateAction<TimeFilter>>;
  activeScope: ScopeType;
  setActiveScope: React.Dispatch<React.SetStateAction<ScopeType>>;
  nearbyMoments?: MomentProp[];
}

const PEEK_HEIGHT = 260;

export default function Events({
  openModal,
  id,
  userCoordinates,
  setSelectedCoordinates,
  setSelectedZoom,
  selectedCoordinates,
  isMobile = false,
  eventsOpen = false,
  setEventsOpen,
  filter,
  setFilter,
  activeScope,
  setActiveScope,
  nearbyMoments,
}: OpenModal) {
  const { theme, toggleTheme } = useTheme();
  const [openScope, setOpenScope] = useState<boolean>(false);
  const openScopeLocator = () => {
    if (!openScope && isMobile) setIsFullHeight(true);
    ToggleState(setOpenScope);
  };
  const { user } = useUserStore();

  const { cityName } = useGetCityName(userCoordinates ?? null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isFullHeight, setIsFullHeight] = useState(false);

  const { data: momentInvitesData } = useInviteUserMomentView(id);
  const { data: circleInvitesData } = useInviteUserCircleView(
    user?.id as string,
  );

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

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragY = useMotionValue(0);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;

    if (isFullHeight) {
      if (offset.y > 80 || velocity.y > 400) {
        setIsFullHeight(false);
      }
    } else {
      if (offset.y < -80 || velocity.y < -400) {
        setIsFullHeight(true);
      } else if (offset.y > 80 || velocity.y > 400) {
        setEventsOpen?.(false);
        setIsFullHeight(false);
      }
    }
    dragY.set(0);
  }

  const panelContent = (
    <>
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-white/3 to-transparent pointer-events-none z-10" />

      {/* Header */}
      <div
        className="relative z-10 px-5 pb-4 flex items-start justify-between border-b border-white/5"
        style={{
          paddingTop: isFullHeight
            ? "calc(env(safe-area-inset-top, 0px) + 1.5rem)"
            : "1.5rem",
        }}
      >
        <div className="space-y-0.5">
          <h2 className="text-base font-medium tracking-[-0.2px] text-black/90 dark:text-white/90">
            Pulse
          </h2>
          <p className="text-xs text-black/30 dark:text-white/30 tracking-[-0.1px]">
            Here&apos;s what&apos;s next
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer"
            style={{
              background: "rgba(var(--fg),0.06)",
              border: "1px solid rgba(var(--fg),0.08)",
            }}
          >
            {theme === "dark"
              ? <SunIcon size={15} color="currentColor" />
              : <MoonIcon size={15} color="currentColor" />
            }
          </motion.button>

          <motion.button
            onClick={() => openModal("notifications")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="relative flex items-center justify-center w-8 h-8 rounded-md cursor-pointer"
            style={{
              background: "rgba(var(--fg),0.06)",
              border: "1px solid rgba(var(--fg),0.08)",
            }}
          >
            <BellIcon size={15} color="currentColor" />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#98473E]/60" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Location strip */}
      <div className="relative z-10 px-5 py-3 border-b border-white/5">
        <motion.div
          className="flex items-center justify-between px-3 py-2 rounded-md"
          style={{
            border: "1px solid rgba(var(--fg),0.07)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <PinIcon size={12} color="currentColor" className="shrink-0" />
            <p className="text-[11px] text-black/50 dark:text-white/50 tracking-[-0.1px] truncate">
              {selectedLocation ?? cityName ?? "Locating..."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <div className="w-px h-3 bg-white/10" />
            <span className="text-xs text-black/30 dark:text-white/30 tracking-[-0.1px] whitespace-nowrap">
              {timeLabel}
            </span>
            <motion.button
              onClick={openScopeLocator}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer shrink-0"
              style={{
                background: openScope
                  ? "rgba(var(--fg),0.12)"
                  : "rgba(var(--fg),0.06)",
                border: "1px solid rgba(var(--fg),0.08)",
              }}
            >
              <PinIcon size={11} color="currentColor" />
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
              setSelectedZoom={setSelectedZoom}
              filter={filter}
              setFilter={setFilter}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-4 py-4 space-y-3">
        <NeedsAttention />
        <Confirmation />
        <Nearby
          filter={filter}
          selectedCoordinates={selectedCoordinates}
          activeScope={activeScope}
          selectedLocation={selectedLocation}
          moments={nearbyMoments}
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t dark:from-black/60 from-white/60  to-transparent pointer-events-none" />
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
            initial={{ y: "100%" }}
            animate={{ y: isFullHeight ? 0 : `calc(100% - ${PEEK_HEIGHT}px)` }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className={`fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-hidden ${isFullHeight ? "" : "rounded-t-2xl"}`}
            style={{
              backdropFilter: "blur(24px)",
              borderTop: isFullHeight
                ? "none"
                : "1px solid rgba(var(--fg),0.08)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4.5rem)",
              height: "100dvh",
            }}
          >
            {/* Drag handle — only draggable area */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.2 }}
              onDragEnd={handleDragEnd}
              className="flex justify-center pt-3 pb-3 shrink-0 cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: "rgba(var(--fg),0.15)" }}
              />
            </motion.div>

            {panelContent}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ---- DESKTOP LAYOUT ----
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-80 h-full flex flex-col shrink-0 border-r border-white/6 bg-linear-to-b from-white to-white/20 dark:from-black/20 dark:to-black text-black dark:text-white overflow-hidden z-20"
      style={{ backdropFilter: "blur(24px)" }}
    >
      {panelContent}
    </motion.div>
  );
}
