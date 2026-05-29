"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import CircleScene from "./CircleScene";
import CircleSignal from "./CircleSignal";
import CircleControls from "./circleControls";
import SelectAction from "./selectAction";
import { useGetCirclesWithMembers } from "@/hooks/useCircles";
import { useUserStore } from "@/stores/useUserStore";

interface CircleSelection {
  activeIndex: number;
  setActiveCircle: React.Dispatch<React.SetStateAction<number>>;
  selectedCircle: CircleProp | null;
  setSelectedCircleProp: (selectedCircle: CircleProp | null) => void;
  setSelectedModal: (selectedModal: "confirm") => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onInvite?: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Circle({
  activeIndex,
  selectedCircle,
  setActiveCircle,
  setSelectedCircleProp,
  setSelectedModal,
  setForm,
  onInvite,
}: CircleSelection) {
  const { user } = useUserStore();
  const { data: getAllCircles } = useGetCirclesWithMembers(user?.id as string);

  const circles = getAllCircles?.data.data ?? [];

  const nextSignal = () => {
    setActiveCircle((i) => (i + 1) % circles.length);
  };

  const prevSignal = () => {
    setActiveCircle((i) => (i - 1 + circles.length) % circles.length);
  };

  const activeCircle = circles[activeIndex];

  if (circles.length === 0) {
    return (
      <motion.section
        key="no-circles"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="text-center flex flex-col items-center justify-center gap-5 px-6 py-16"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: `rgba(var(--fg),0.04)`,
            border: `1px solid rgba(var(--fg),0.08)`,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={`rgba(var(--fg),0.25)`}
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
        </div>
        <div className="flex flex-col gap-1.5 max-w-xs">
          <p
            className="text-sm font-medium tracking-[-0.2px]"
            style={{ color: `rgba(var(--fg),0.65)` }}
          >
            No circles yet
          </p>
          <p
            className="text-xs tracking-[-0.1px] leading-relaxed"
            style={{ color: `rgba(var(--fg),0.3)` }}
          >
            Create a circle first, or skip ahead and invite people directly.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onInvite?.()}
          className="text-xs tracking-[-0.1px] px-5 py-2.5 rounded-lg cursor-pointer transition-colors"
          style={{
            background: "rgba(var(--fg),0.06)",
            border: "1px solid rgba(var(--fg),0.1)",
            color: "rgba(var(--fg),0.5)",
          }}
        >
          Invite people →
        </motion.button>
      </motion.section>
    );
  }


  return (
    <AnimatePresence mode="sync">
      <motion.section key="circle" className="text-center space-y-5 relative">
        {/* Header */}
        <motion.div
          key={selectedCircle ? "selected-header" : "browse-header"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="mb-6 flex flex-col gap-1"
        >
          {selectedCircle ? (
            <>
              <h2
                className="text-base font-medium tracking-[-0.3px]"
                style={{ color: `rgba(var(--fg),0.85)` }}
              >
                Inviting your circle
              </h2>
              <p
                className="text-sm tracking-[-0.1px]"
                style={{ color: `rgba(var(--fg),0.3)` }}
              >
                Sending to{" "}
                <span
                  style={{ color: `rgba(var(--fg),0.65)`, fontWeight: 500 }}
                >
                  {selectedCircle.circle_name}
                </span>
              </p>
            </>
          ) : (
            <>
              <h2
                className="text-base font-medium tracking-[-0.3px]"
                style={{ color: `rgba(var(--fg),0.85)` }}
              >
                Share with your circle
              </h2>
              <p
                className="text-sm tracking-[-0.1px]"
                style={{ color: `rgba(var(--fg),0.3)` }}
              >
                Invite people you already trust
              </p>
            </>
          )}
        </motion.div>

        {/* Circle scene — always shown */}
        <CircleScene
          circles={circles}
          circleIndex={activeIndex}
          markerIndex={activeIndex}
          selectedCircle={selectedCircle}
        />

        <AnimatePresence mode="wait">
          {selectedCircle === null && (
            <>
              {/* Desktop — full signal list */}
              <div className="hidden sm:block">
                <CircleSignal circles={circles} activeIndex={activeIndex} />
              </div>

              {/* Mobile — active circle pill */}
              <motion.div
                key="mobile-signal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="sm:hidden flex items-center justify-center"
              >
                {activeCircle && (
                  <div
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-full"
                    style={{
                      background: `rgba(var(--fg),0.05)`,
                      border: `1px solid rgba(var(--fg),0.09)`,
                    }}
                  >
                    {/* Active dot */}
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "rgba(212,165,116,0.8)" }}
                    />
                    <span
                      className="text-xs font-medium tracking-[-0.1px]"
                      style={{ color: `rgba(var(--fg),0.75)` }}
                    >
                      {activeCircle.circle_name}
                    </span>
                    <span
                      className="text-[10px] tracking-[-0.1px]"
                      style={{ color: `rgba(var(--fg),0.3)` }}
                    >
                      {activeCircle.members?.length ?? 0} members
                    </span>
                  </div>
                )}
              </motion.div>

              <CircleControls nextMarker={nextSignal} prevMarker={prevSignal} />
            </>
          )}
        </AnimatePresence>

        {/* Select action — persistent */}
        <SelectAction
          selectedCircle={selectedCircle}
          onSelect={() => {
            const circle = circles[activeIndex];
            setSelectedCircleProp(circle);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setForm((prev: any) => ({ ...prev, circle_id: circle?.id }));
          }}
          onContinue={() => setSelectedModal("confirm")}
        />
      </motion.section>
    </AnimatePresence>
  );
}
