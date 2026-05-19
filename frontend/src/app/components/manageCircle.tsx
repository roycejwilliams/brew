"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import CircleControls from "./circleControls";
import CircleScene from "./CircleScene";
import { PlusCircleIcon } from "./icons";
import SearchMap from "./search";
import Image from "next/image";
import {
  useGetCirclesWithMembers,
  useRemoveMemberBasedOnRole,
} from "@/hooks/useCircles";
import { useUserStore } from "@/stores/useUserStore";
import { ChevronRight, X } from "lucide-react";
import InvitePeople, { InviteUserProp } from "./InvitePeople";
import { useInviteMemberToCircle } from "@/hooks/useInvites";
import useEmblaCarousel from "embla-carousel-react";

export default function ManageCircle() {
  const [markerIndex, setMarkerIndex] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<InviteUserProp[]>([]);
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const { user } = useUserStore();
  const { data: circlesData, isLoading } = useGetCirclesWithMembers(
    user?.id as string,
  );
  const circles: CircleProp[] = circlesData?.data?.data ?? [];

  const [selectedManageCircle, setSelectedManageCircle] =
    useState<CircleProp | null>(null);
  const featured = selectedManageCircle ?? circles[0] ?? null;

  const { mutate: removeMember } = useRemoveMemberBasedOnRole();
  const { mutate: inviteMember } = useInviteMemberToCircle();

  const nextMarker = () =>
    setMarkerIndex((i) => (i + 1) % (featured?.members?.length ?? 1));
  const prevMarker = () =>
    setMarkerIndex(
      (i) =>
        (i - 1 + (featured?.members?.length ?? 1)) %
        (featured?.members?.length ?? 1),
    );

  const handleSelectedCircle = (circle: CircleProp) => {
    setSelectedManageCircle((prev) => {
      if (prev?.id === circle.id) return prev;
      setMarkerIndex(0);
      return circle;
    });
  };

  const handleConfirmAdd = () => {
    if (!featured) return;
    selectedUsers.forEach((u) => {
      inviteMember({
        circle: featured as CircleProp,
        invite_member: { member_id: u.id } as InviteMembersProp,
      });
    });
    setSelectedUsers([]);
    setShowAddMember(false);
  };

  const filteredMembers = featured
    ? query.trim() === ""
      ? (featured.members ?? [])
      : (featured.members ?? []).filter(
          (m: CircleProp["members"][number]) =>
            `${m.first_name} ${m.last_name}`
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            m.username?.toLowerCase().includes(query.toLowerCase()),
        )
    : [];

  return (
    <section className="flex-1 h-full overflow-hidden flex flex-col relative">
      {/* Add member modal */}
      <AnimatePresence>
        {showAddMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(16px)",
              }}
              onClick={() => {
                setShowAddMember(false);
                setSelectedUsers([]);
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 w-full max-w-sm sm:max-w-md px-4"
            >
              <div className="flex flex-col gap-1 mb-5 text-center">
                <h2
                  className="text-base font-medium tracking-[-0.3px]"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Add to {featured?.circle_name}
                </h2>
                <p
                  className="text-sm tracking-[-0.1px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Search your circles or invite someone new.
                </p>
              </div>
              <InvitePeople
                selectedInvitedUser={selectedUsers}
                setSelectedInvitedUser={setSelectedUsers}
                setInviteSelection={handleConfirmAdd}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 shrink-0 relative z-10"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,8,8,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          className="text-[9px] tracking-[3px] uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          {featured?.circle_name ?? "Circles"}
        </p>
        {featured && (
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium tracking-[-0.1px] cursor-pointer transition-all duration-150"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.45)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
            }
          >
            <PlusCircleIcon className="w-3 h-3" />
            <span>Add member</span>
          </button>
        )}
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden">
        {/* Circle selector */}
        <div className="shrink-0 px-4 pt-4 pb-3">
          <p
            className="text-[9px] tracking-[2px] uppercase font-medium mb-3"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Circles
          </p>
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-2">
              {isLoading
                ? [0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex-[0_0_auto] h-10 w-32 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    />
                  ))
                : circles.map((circle) => {
                    const isActive = featured?.id === circle.id;
                    return (
                      <motion.button
                        key={circle.id}
                        onClick={() => handleSelectedCircle(circle)}
                        whileTap={{ scale: 0.97 }}
                        className="flex-[0_0_auto] flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-colors duration-150"
                        style={{
                          background: isActive
                            ? "rgba(255,255,255,0.06)"
                            : "transparent",
                          border: isActive
                            ? "1px solid rgba(255,255,255,0.1)"
                            : "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg overflow-hidden relative shrink-0"
                          style={{
                            border: isActive
                              ? "1px solid rgba(255,255,255,0.15)"
                              : "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          {circle.circle_image ? (
                            <Image
                              src={circle.circle_image}
                              alt={circle.circle_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-[9px] font-medium"
                              style={{
                                color: "rgba(255,255,255,0.3)",
                                background: "rgba(255,255,255,0.05)",
                              }}
                            >
                              {circle.circle_name?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <p
                            className="text-[11px] font-medium tracking-[-0.1px] whitespace-nowrap"
                            style={{
                              color: isActive
                                ? "rgba(255,255,255,0.85)"
                                : "rgba(255,255,255,0.45)",
                            }}
                          >
                            {circle.circle_name}
                          </p>
                          <p
                            className="text-[9px] tracking-[-0.1px]"
                            style={{ color: "rgba(255,255,255,0.2)" }}
                          >
                            {circle.members?.length ?? 0} members
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
            </div>
          </div>
        </div>

        <div
          className="mx-4"
          style={{ height: 1, background: "rgba(255,255,255,0.05)" }}
        />

        {/* Search */}
        <div className="px-4 pt-3 shrink-0">
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <SearchMap
              value={query}
              onChange={(v) => setQuery(v)}
              autoFocus={false}
            />
          </div>
        </div>

        {/* Member list */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24">
          <AnimatePresence>
            {filteredMembers.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-[11px] tracking-[-0.1px]"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {query.trim() !== ""
                  ? `No members match "${query}"`
                  : "No members yet."}
              </motion.p>
            ) : (
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                  }}
                />
                {filteredMembers.map(
                  (member: CircleProp["members"][number], i: number) => (
                    <motion.div
                      key={`mobile-${featured?.id}-${member.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.15 }}
                      className="flex items-center gap-3 px-3 py-2.5"
                      style={{
                        borderBottom:
                          i < filteredMembers.length - 1
                            ? "1px solid rgba(255,255,255,0.05)"
                            : "none",
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-full overflow-hidden relative shrink-0"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {member.profile_image ? (
                          <Image
                            src={member.profile_image}
                            alt={member.username}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-[10px]"
                            style={{
                              color: "rgba(255,255,255,0.3)",
                              background: "rgba(255,255,255,0.05)",
                            }}
                          >
                            {member.first_name?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium tracking-[-0.1px] truncate"
                          style={{ color: "rgba(255,255,255,0.82)" }}
                        >
                          {member.first_name} {member.last_name}
                        </p>
                        <p
                          className="text-[11px] tracking-[-0.1px]"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          @{member.username}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (!featured) return;
                          removeMember({
                            circle: featured as CircleProp,
                            member: {
                              member_id: member.id,
                            } as InviteMembersProp,
                          });
                        }}
                        className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-colors duration-150 shrink-0"
                        style={{
                          background: "rgba(239,68,68,0.05)",
                          border: "1px solid rgba(239,68,68,0.1)",
                          color: "rgba(248,113,113,0.5)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(239,68,68,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(239,68,68,0.05)")
                        }
                      >
                        <X size={11} />
                      </button>
                    </motion.div>
                  ),
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Circle scene */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 relative">
            <CircleScene
              circles={circles}
              selectedCircle={featured}
              markerIndex={markerIndex}
            />
            <CircleControls nextMarker={nextMarker} prevMarker={prevMarker} />
          </div>
        </div>

        {/* Sidebar */}
        <div
          className="w-52 lg:w-64 shrink-0 flex flex-col overflow-hidden relative"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
              pointerEvents: "none",
            }}
          />

          <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
            {/* Circle list */}
            <div className="flex flex-col gap-2">
              <p
                className="text-[9px] tracking-[2px] uppercase font-medium"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Circles
              </p>
              <div className="flex flex-col gap-1">
                {isLoading
                  ? [0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-10 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      />
                    ))
                  : circles.map((circle) => {
                      const isActive = featured?.id === circle.id;
                      return (
                        <motion.button
                          key={circle.id}
                          onClick={() => handleSelectedCircle(circle)}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-colors duration-150 relative"
                          style={{
                            background: isActive
                              ? "rgba(255,255,255,0.06)"
                              : "transparent",
                            border: isActive
                              ? "1px solid rgba(255,255,255,0.1)"
                              : "1px solid transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive)
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.03)";
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive)
                              e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="circle-active-bar"
                              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
                              style={{
                                width: 2,
                                height: 16,
                                background: "rgba(212,165,116,0.7)",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          )}
                          <div
                            className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0"
                            style={{
                              border: isActive
                                ? "1px solid rgba(255,255,255,0.15)"
                                : "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            {circle.circle_image ? (
                              <Image
                                src={circle.circle_image}
                                alt={circle.circle_name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-[10px] font-medium"
                                style={{
                                  color: "rgba(255,255,255,0.3)",
                                  background: "rgba(255,255,255,0.05)",
                                }}
                              >
                                {circle.circle_name?.[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p
                              className="text-xs font-medium tracking-[-0.1px] truncate"
                              style={{
                                color: isActive
                                  ? "rgba(255,255,255,0.85)"
                                  : "rgba(255,255,255,0.45)",
                              }}
                            >
                              {circle.circle_name}
                            </p>
                            <p
                              className="text-[10px] tracking-[-0.1px]"
                              style={{ color: "rgba(255,255,255,0.2)" }}
                            >
                              {circle.members?.length ?? 0} members
                            </p>
                          </div>
                          <ChevronRight
                            size={12}
                            style={{
                              color: isActive
                                ? "rgba(255,255,255,0.25)"
                                : "transparent",
                              flexShrink: 0,
                            }}
                          />
                        </motion.button>
                      );
                    })}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

            {/* Search */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <SearchMap
                value={query}
                onChange={(v) => setQuery(v)}
                autoFocus={false}
              />
            </div>

            {/* Member list — desktop */}
            <div className="flex flex-col gap-0.5">
              <AnimatePresence mode="popLayout">
                {filteredMembers.map(
                  (member: CircleProp["members"][number], i: number) => {
                    const memberGlobalIndex =
                      featured?.members?.indexOf(member) ?? i;
                    const isActiveMarker = memberGlobalIndex === markerIndex;
                    return (
                      <motion.button
                        key={`desktop-${featured?.id}-${member.id}`}
                        onClick={() => setMarkerIndex(memberGlobalIndex)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.15 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors duration-150 text-left relative"
                        style={{
                          background: isActiveMarker
                            ? "rgba(255,255,255,0.05)"
                            : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActiveMarker)
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.03)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActiveMarker)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-full overflow-hidden relative shrink-0"
                          style={{
                            border: isActiveMarker
                              ? "1px solid rgba(255,255,255,0.2)"
                              : "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          {member.profile_image ? (
                            <Image
                              src={member.profile_image}
                              alt={member.username}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-[9px]"
                              style={{
                                color: "rgba(255,255,255,0.3)",
                                background: "rgba(255,255,255,0.05)",
                              }}
                            >
                              {member.first_name?.[0]}
                            </div>
                          )}
                        </div>
                        <span
                          className="text-xs tracking-[-0.1px] truncate flex-1"
                          style={{
                            color: isActiveMarker
                              ? "rgba(255,255,255,0.85)"
                              : "rgba(255,255,255,0.4)",
                          }}
                        >
                          {member.first_name} {member.last_name}
                        </span>
                        {isActiveMarker && (
                          <motion.div
                            layoutId="member-active-dot"
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: "rgba(212,165,116,0.7)" }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </motion.button>
                    );
                  },
                )}
              </AnimatePresence>
              {filteredMembers.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 text-[11px] tracking-[-0.1px]"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  {query.trim() !== ""
                    ? `No members match "${query}"`
                    : "No members yet."}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
