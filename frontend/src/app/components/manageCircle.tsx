import { AnimatePresence, motion, Variants } from "motion/react";
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
import InvitePeople from "./InvitePeople";
import { useInviteMemberToCircle } from "@/hooks/useInvites";

const buttonContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function ManageCircle() {
  const [markerIndex, setMarkerIndex] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

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

  const nextMarker = () => {
    setMarkerIndex((i) => (i + 1) % (featured?.members?.length ?? 1));
  };

  const prevMarker = () => {
    setMarkerIndex(
      (i) =>
        (i - 1 + (featured?.members?.length ?? 1)) %
        (featured?.members?.length ?? 1),
    );
  };

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
    <section className="flex-1 shrink-0 relative">
      {/* Add member modal */}
      <AnimatePresence>
        {showAddMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowAddMember(false);
                setSelectedUsers([]);
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md px-4"
            >
              <div className="mb-5 text-center space-y-1">
                <h2 className="text-white/90 text-lg font-medium tracking-[-0.2px]">
                  Add to {featured?.circle_name}
                </h2>
                <p className="text-white/30 text-sm tracking-[-0.1px]">
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

      {/* Top bar */}
      <motion.div
        className="flex justify-between px-8 pb-4 pt-8 items-start z-20 text-sm backdrop-blur-[10px] bg-[#1b1b1b]/5 border-b border-white/5 shadow-sm absolute top-0 w-full"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h1 className="tracking-[0.15em] font-normal uppercase text-[#555]">
          {featured?.circle_name ?? "Circles"}
        </h1>
      </motion.div>

      <div className="grid grid-cols-4 h-full">
        {/* Main scene */}
        <div className="col-span-3 content-center relative">
          <div className="relative">
            <CircleScene
              circles={circles}
              selectedCircle={featured}
              markerIndex={markerIndex}
            />
            <CircleControls nextMarker={nextMarker} prevMarker={prevMarker} />
          </div>

          {/* Action buttons */}
          <motion.div
            className="mx-auto w-fit mt-12 flex flex-col items-center"
            variants={buttonContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex gap-x-6">
              {[
                {
                  icon: <PlusCircleIcon className="w-5 h-5" />,
                  label: "Add",
                  color: "rgba(255,255,255,1)",
                  border: "rgba(255,255,255,0.4)",
                  textColor: "text-white/60",
                  onClick: () => setShowAddMember(true),
                },
                {
                  icon: <X className="w-5 h-5" />,
                  label: "Remove",
                  color: "rgba(248,113,113,1)",
                  border: "rgba(248,113,113,0.4)",
                  textColor: "text-red-400/60",
                  onClick: () => {
                    const member = featured?.members?.[markerIndex];
                    if (!member || !featured) return;
                    removeMember({
                      circle: featured as CircleProp,
                      member: { member_id: member.id } as InviteMembersProp,
                    });
                  },
                },
              ].map((btn) => (
                <motion.div
                  key={btn.label}
                  className="flex flex-col justify-center space-y-2"
                  variants={buttonVariants}
                  onMouseEnter={() => setHoveredButton(btn.label)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <motion.button
                    onClick={btn.onClick}
                    className={`w-12 h-12 mx-auto flex justify-center items-center border border-white/10 shadow-lg rounded-full cursor-pointer bg-white/15 ${btn.textColor}`}
                    whileHover={{
                      scale: 1.1,
                      borderColor: btn.border,
                      color: btn.color,
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {btn.icon}
                  </motion.button>
                  <motion.span
                    className="text-xs mx-auto text-white/60"
                    initial={{ opacity: 0, y: 4 }}
                    animate={
                      hoveredButton === btn.label
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 4 }
                    }
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {btn.label}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 border-l border-white/4 relative">
          <div className="absolute inset-0 bg-linear-to-r from-white/1 to-transparent pointer-events-none" />
          <div className="relative px-6 pt-32 pb-6 h-full flex flex-col">
            {/* Circle list */}
            <div>
              <h2 className="uppercase text-[11px] tracking-[0.2em] text-white/25 font-medium mb-4">
                Circles
              </h2>
              <div className="space-y-1">
                {isLoading ? (
                  [0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-12 rounded-lg bg-white/3 border border-white/5"
                    />
                  ))
                ) : (
                  <AnimatePresence>
                    {circles.map((circle) => {
                      const isActive = featured?.id === circle.id;
                      return (
                        <motion.button
                          onClick={() => handleSelectedCircle(circle)}
                          key={circle.id}
                          className={`w-full flex items-center gap-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 group relative ${
                            isActive ? "bg-white/6" : "hover:bg-white/3"
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="circle-active-indicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-white/40"
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}
                          <div
                            className={`w-10 h-10 rounded-full overflow-hidden relative shrink-0 ring-1 transition-all duration-300 ${isActive ? "ring-white/20" : "ring-white/6"}`}
                          >
                            {circle.circle_image ? (
                              <Image
                                src={circle.circle_image}
                                alt={circle.circle_name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-xs">
                                {circle.circle_name?.[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <span
                              className={`text-sm truncate block transition-colors duration-200 ${isActive ? "text-white/90" : "text-white/50 group-hover:text-white/70"}`}
                            >
                              {circle.circle_name}
                            </span>
                            <span className="text-[11px] text-white/20">
                              {circle.members?.length ?? 0} members
                            </span>
                          </div>
                          <ChevronRight
                            size={14}
                            className={`shrink-0 transition-all duration-200 ${isActive ? "text-white/30" : "text-transparent group-hover:text-white/20"}`}
                          />
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-linear-to-r from-transparent via-white/6 to-transparent" />

            {/* Search */}
            <div className="rounded-lg overflow-hidden border border-white/5 bg-white/2">
              <SearchMap
                value={query}
                onChange={(v) => setQuery(v)}
                autoFocus={false}
              />
            </div>

            {/* Member list */}
            <div className="mt-3 flex-1 overflow-y-auto no-scroll">
              <AnimatePresence mode="popLayout">
                {filteredMembers.map(
                  (member: CircleProp["members"][number], i: number) => {
                    const memberGlobalIndex =
                      featured?.members?.indexOf(member) ?? i;
                    const isActiveMarker = memberGlobalIndex === markerIndex;

                    return (
                      <motion.button
                        onClick={() => setMarkerIndex(memberGlobalIndex)}
                        key={`${featured?.id}-${member.id}`}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: -8,
                          transition: { duration: 0.15 },
                        }}
                        transition={{
                          delay: 0.15 + i * 0.03,
                          duration: 0.25,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-3 py-2.5 text-left rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-x-3 group relative ${
                          isActiveMarker ? "bg-white/5" : "hover:bg-white/2"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full overflow-hidden relative shrink-0 border transition-all duration-200 ${isActiveMarker ? "border-white/20" : "border-white/6"}`}
                        >
                          {member.profile_image ? (
                            <Image
                              src={member.profile_image}
                              alt={member.username}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-[10px]">
                              {member.first_name?.[0]}
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-sm truncate transition-colors duration-200 ${isActiveMarker ? "text-white/90" : "text-white/50 group-hover:text-white/70"}`}
                        >
                          {member.first_name} {member.last_name}
                        </span>
                        {isActiveMarker && (
                          <motion.div
                            layoutId="member-active-dot"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50 shrink-0"
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

              {filteredMembers.length === 0 && query.trim() !== "" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/20 text-sm text-center py-8"
                >
                  No members match &quot;{query}&quot;
                </motion.p>
              )}

              {filteredMembers.length === 0 &&
                query.trim() === "" &&
                !isLoading && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/20 text-sm text-center py-8"
                  >
                    No members yet.
                  </motion.p>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
