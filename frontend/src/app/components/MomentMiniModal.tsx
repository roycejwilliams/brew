"use client";
import { useEffect, useRef } from "react";
import { useMiniModal, openEventCard } from "@/stores/store";
import { useUserStore } from "@/stores/useUserStore";
import {
  useGetMomentAttendeesWithDetails,
  useKnockOnMoment,
} from "@/hooks/useMoments";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, X } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const CARD_W = 280;
const MARGIN = 12;

type Attendee = {
  attendee_id: string;
  profile_image?: string;
  username: string;
  first_name?: string;
  last_name?: string;
  checked_in: boolean;
  status: string;
};

export default function MomentMiniModal() {
  const { isMiniOpen, miniMoment, position, closeMini } = useMiniModal();
  const { user } = useUserStore();
  const openCard = openEventCard((state) => state.openEvent);
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const { mutate: knock, isPending: isKnocking, isSuccess: hasKnocked, variables: knockVariables } = useKnockOnMoment();

  const { data: attendeeData } = useGetMomentAttendeesWithDetails(
    miniMoment?.id ?? "",
  );

  const seen = new Set<string>();
  const attendees: Attendee[] = (attendeeData?.data?.data ?? []).filter(
    (a: Attendee) => {
      if (seen.has(a.attendee_id)) return false;
      seen.add(a.attendee_id);
      return true;
    },
  );
  const accepted = attendees.filter((a) => a.status === "attending");

  const isHost = !!user?.id && user.id === miniMoment?.creator_id;
  const userRecord = !isHost ? attendees.find((a) => a.attendee_id === user?.id) : undefined;
  const isAttending = !isHost && userRecord?.status === "attending";
  const hasPendingKnock = !isHost && (userRecord?.status === "pending" || (hasKnocked && knockVariables?.moment_id === miniMoment?.id));
  const wasDeclined = !isHost && userRecord?.status === "rejected";
  const isDiscoverer = !isHost && !userRecord && !hasKnocked;

  const cap = miniMoment?.cap_attendance ?? 0;
  const spotsRemaining = cap > 0 ? Math.max(0, cap - accepted.length) : null;
  const isLastSpot = spotsRemaining === 1;
  const isScarce = spotsRemaining !== null && spotsRemaining <= 3 && spotsRemaining > 0;
  const isFull = spotsRemaining === 0;

  // Card placement — above anchor point, clamped to viewport
  const cardPos = (() => {
    if (!position) return { left: MARGIN, above: true };
    const vw = typeof window !== "undefined" ? window.innerWidth : 800;
    const vh = typeof window !== "undefined" ? window.innerHeight : 600;
    const left = Math.max(MARGIN, Math.min(vw - CARD_W - MARGIN, position.x - CARD_W / 2));
    const above = position.y > vh * 0.45;
    return { left, above };
  })();

  // Outside-click closes
  useEffect(() => {
    if (!isMiniOpen) return;
    const handle = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        closeMini();
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handle), 50);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handle);
    };
  }, [isMiniOpen, closeMini]);

  const handleViewMoment = () => {
    if (!miniMoment) return;
    closeMini();
    openCard(miniMoment);
    router.push(`/moments/${miniMoment.id}`, { scroll: false });
  };

  const handleKnock = () => {
    if (!miniMoment?.id || !user?.id) return;
    knock({ moment_id: miniMoment.id, requester_id: user.id });
  };

  const anchorY = position?.y ?? 0;
  const topVal = cardPos.above ? undefined : anchorY + 52;
  const bottomVal = cardPos.above
    ? typeof window !== "undefined"
      ? window.innerHeight - anchorY + 8
      : undefined
    : undefined;

  return (
    <AnimatePresence>
      {isMiniOpen && miniMoment && (
        <motion.div
          ref={cardRef}
          key="mini-card"
          className="fixed z-50"
          style={{
            width: CARD_W,
            left: cardPos.left,
            ...(topVal !== undefined ? { top: topVal } : {}),
            ...(bottomVal !== undefined ? { bottom: bottomVal } : {}),
            background: "rgba(var(--bg), 0.97)",
            border: "1px solid rgba(var(--fg), 0.1)",
            borderRadius: 8,
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(var(--fg),0.06)",
          }}
          initial={{ opacity: 0, scale: 0.92, y: cardPos.above ? 6 : -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: cardPos.above ? 6 : -6 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          {/* Hero image */}
          <div
            className="relative w-full h-24 overflow-hidden"
            style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          >
            {miniMoment.image ? (
              <Image
                src={miniMoment.image}
                alt={miniMoment.moments_name}
                fill
                className="object-cover brightness-75"
              />
            ) : (
              <div className="w-full h-full" style={{ background: "rgba(var(--fg),0.05)" }} />
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, transparent 30%, rgba(var(--bg),0.85) 100%)" }}
            />
            {miniMoment.moment_start && (
              <span
                className="absolute bottom-2 left-2.5 text-[10px] px-1.5 py-0.5 rounded-md"
                style={{
                  background: "rgba(var(--bg),0.8)",
                  border: "1px solid rgba(var(--fg),0.1)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(var(--fg),0.55)",
                }}
              >
                {new Date(miniMoment.moment_start).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            )}
            <button
              onClick={closeMini}
              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                background: "rgba(var(--bg),0.75)",
                border: "1px solid rgba(var(--fg),0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <X size={10} style={{ color: "rgba(var(--fg),0.55)" }} />
            </button>
          </div>

          {/* Body */}
          <div className="px-3 pt-2.5 pb-3 space-y-2.5">
            {/* Title + location */}
            <div>
              <h3
                className="text-sm font-semibold leading-snug tracking-[-0.2px] truncate"
                style={{ color: "rgba(var(--fg),0.9)" }}
              >
                {miniMoment.moments_name}
              </h3>
              {miniMoment.location_name && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={9} style={{ color: "rgba(var(--fg),0.3)", flexShrink: 0 }} />
                  <p className="text-[10px] truncate tracking-[-0.1px]" style={{ color: "rgba(var(--fg),0.4)" }}>
                    {miniMoment.location_name}
                  </p>
                </div>
              )}
            </div>

            {/* Vibe tags */}
            {miniMoment.vibes?.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {miniMoment.vibes.slice(0, 4).map((vibe) => (
                  <span
                    key={vibe}
                    className="text-[9px] px-1.5 py-0.5 rounded-full tracking-wide"
                    style={{
                      background: "rgba(var(--fg),0.05)",
                      border: "1px solid rgba(var(--fg),0.09)",
                      color: "rgba(var(--fg),0.5)",
                    }}
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            )}

            {/* Who's going */}
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                {accepted.slice(0, 4).map((a) => (
                  <div
                    key={a.attendee_id}
                    className="w-4 h-4 rounded-full relative overflow-hidden shrink-0"
                    style={{ border: "1.5px solid rgba(var(--bg),1)", background: "rgba(var(--fg),0.1)" }}
                  >
                    {a.profile_image && (
                      <Image src={a.profile_image} alt={a.username} fill className="object-cover" />
                    )}
                  </div>
                ))}
                {accepted.length > 4 && (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] shrink-0"
                    style={{
                      border: "1.5px solid rgba(var(--bg),1)",
                      background: "rgba(var(--fg),0.08)",
                      color: "rgba(var(--fg),0.45)",
                    }}
                  >
                    +{accepted.length - 4}
                  </div>
                )}
              </div>
              <span className="text-[10px]" style={{ color: "rgba(var(--fg),0.35)" }}>
                {accepted.length > 0 ? `${accepted.length} going` : "No one yet"}
              </span>
            </div>

            {/* Scarcity indicator */}
            {spotsRemaining !== null && (
              <div
                className="flex items-center gap-2 px-2.5 py-2 rounded-md"
                style={{
                  background: isLastSpot
                    ? "rgba(239,68,68,0.08)"
                    : isScarce
                    ? "rgba(234,179,8,0.07)"
                    : isFull
                    ? "rgba(var(--fg),0.04)"
                    : "rgba(var(--fg),0.03)",
                  border: `1px solid ${
                    isLastSpot
                      ? "rgba(239,68,68,0.18)"
                      : isScarce
                      ? "rgba(234,179,8,0.15)"
                      : "rgba(var(--fg),0.07)"
                  }`,
                }}
              >
                {/* Pulsing dot for urgency */}
                <span className="relative flex shrink-0" style={{ width: 8, height: 8 }}>
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full ${isLastSpot ? "animate-ping" : ""}`}
                    style={{
                      background: isLastSpot
                        ? "rgba(239,68,68,0.5)"
                        : isScarce
                        ? "rgba(234,179,8,0.4)"
                        : "transparent",
                    }}
                  />
                  <span
                    className="relative inline-flex rounded-full w-2 h-2"
                    style={{
                      background: isLastSpot
                        ? "rgba(239,68,68,0.9)"
                        : isScarce
                        ? "rgba(234,179,8,0.8)"
                        : isFull
                        ? "rgba(var(--fg),0.2)"
                        : "rgba(var(--fg),0.2)",
                    }}
                  />
                </span>

                <p
                  className="text-[10px] font-medium tracking-[-0.1px]"
                  style={{
                    color: isLastSpot
                      ? "rgba(239,68,68,0.85)"
                      : isScarce
                      ? "rgba(234,179,8,0.85)"
                      : isFull
                      ? "rgba(var(--fg),0.35)"
                      : "rgba(var(--fg),0.4)",
                  }}
                >
                  {isFull
                    ? "No spots remaining"
                    : isLastSpot
                    ? "Last spot — act now"
                    : `${spotsRemaining} of ${cap} spots left`}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="w-full h-px" style={{ background: "rgba(var(--fg),0.06)" }} />

            {/* Role-based actions */}
            <div className="flex flex-col gap-1.5">
              {isHost && (
                <button
                  onClick={handleViewMoment}
                  className="w-full py-2 rounded-md text-[11px] font-medium tracking-[-0.1px] transition-opacity duration-150 active:opacity-60 cursor-pointer"
                  style={{
                    background: "rgba(var(--fg),0.07)",
                    color: "rgba(var(--fg),0.75)",
                    border: "1px solid rgba(var(--fg),0.1)",
                  }}
                >
                  Manage Moment
                </button>
              )}

              {isAttending && (
                <>
                  <button
                    onClick={handleViewMoment}
                    className="w-full py-2 rounded-md text-[11px] font-semibold tracking-[-0.1px] transition-opacity duration-150 active:opacity-60 cursor-pointer"
                    style={{ background: "rgba(var(--fg),0.9)", color: "rgba(var(--bg),1)" }}
                  >
                    Check In
                  </button>
                  <button
                    onClick={handleViewMoment}
                    className="w-full py-2 rounded-md text-[11px] font-medium tracking-[-0.1px] transition-opacity duration-150 active:opacity-60 cursor-pointer"
                    style={{
                      background: "rgba(var(--fg),0.04)",
                      color: "rgba(var(--fg),0.45)",
                      border: "1px solid rgba(var(--fg),0.07)",
                    }}
                  >
                    View Moment
                  </button>
                </>
              )}

              {hasPendingKnock && (
                <>
                  <div
                    className="w-full py-2 rounded-md text-[11px] text-center tracking-[-0.1px]"
                    style={{
                      background: "rgba(var(--fg),0.04)",
                      color: "rgba(var(--fg),0.35)",
                      border: "1px solid rgba(var(--fg),0.07)",
                    }}
                  >
                    Knock sent · waiting on host
                  </div>
                  <button
                    onClick={handleViewMoment}
                    className="w-full py-2 rounded-md text-[11px] font-medium tracking-[-0.1px] transition-opacity duration-150 active:opacity-60 cursor-pointer"
                    style={{
                      background: "rgba(var(--fg),0.04)",
                      color: "rgba(var(--fg),0.45)",
                      border: "1px solid rgba(var(--fg),0.07)",
                    }}
                  >
                    View Moment
                  </button>
                </>
              )}

              {wasDeclined && (
                <>
                  <div
                    className="w-full py-2 rounded-md text-[11px] text-center tracking-[-0.1px]"
                    style={{
                      background: "rgba(var(--fg),0.03)",
                      color: "rgba(var(--fg),0.25)",
                      border: "1px solid rgba(var(--fg),0.06)",
                    }}
                  >
                    Not this time
                  </div>
                  <button
                    onClick={handleViewMoment}
                    className="w-full py-2 rounded-md text-[11px] font-medium tracking-[-0.1px] transition-opacity duration-150 active:opacity-60 cursor-pointer"
                    style={{
                      background: "rgba(var(--fg),0.04)",
                      color: "rgba(var(--fg),0.45)",
                      border: "1px solid rgba(var(--fg),0.07)",
                    }}
                  >
                    View Moment
                  </button>
                </>
              )}

              {isDiscoverer && (
                <>
                  <button
                    onClick={handleKnock}
                    disabled={isKnocking || isFull}
                    className="w-full py-2 rounded-md text-[11px] font-semibold tracking-[-0.1px] transition-opacity duration-150 active:opacity-60 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "rgba(var(--fg),0.9)", color: "rgba(var(--bg),1)" }}
                  >
                    {isKnocking ? "Sending…" : isFull ? "No Spots" : "The Knock"}
                  </button>
                  <button
                    onClick={handleViewMoment}
                    className="w-full py-2 rounded-md text-[11px] font-medium tracking-[-0.1px] transition-opacity duration-150 active:opacity-60 cursor-pointer"
                    style={{
                      background: "rgba(var(--fg),0.04)",
                      color: "rgba(var(--fg),0.45)",
                      border: "1px solid rgba(var(--fg),0.07)",
                    }}
                  >
                    View Moment
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
