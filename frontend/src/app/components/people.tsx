"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import SearchMap from "./search";
import { CloseIcon, PlusIcon } from "./icons";
import Image from "next/image";
import {
  useGetAllCirclesOwnedByUser,
  useGetCirclesWithMembers,
} from "@/hooks/useCircles";
import { useUserStore } from "@/stores/useUserStore";

type MomentSelectionProp = "start" | "circle" | "people" | "nearby" | "confirm";

interface selectedModalProp {
  selectedModal: MomentSelectionProp;
  setSelectedModal: (selectedModal: MomentSelectionProp) => void;
  selectedUsers: UserProp[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<UserProp[]>>;
  onInvite?: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function People({
  selectedModal,
  setSelectedModal,
  selectedUsers,
  setSelectedUsers,
  onInvite,
}: selectedModalProp) {
  const [userQuery, setUserQuery] = useState("");
  const [isSearchingUser] = useState<boolean>(false);
  const [activeCircleFilter, setActiveCircleFilter] = useState<string | null>(
    null,
  );

  const { user } = useUserStore();
  const { data: getAllCircleMembers } = useGetCirclesWithMembers(
    user?.id as string,
  );
  const { data: circlesOwnedByUser } = useGetAllCirclesOwnedByUser(
    user?.id as string,
  );

  const getAllMembersInEachCircle = () => {
    if (!getAllCircleMembers?.data.data) return [];
    const seen = new Set<string>();
    return getAllCircleMembers.data.data
      .flatMap((circle: CircleProp) =>
        circle.members
          .filter(
            (member: CircleProp["members"][number] | null) => member != null,
          )
          .map((member: CircleProp["members"][number]) => ({
            id: member.id,
            username: member.username,
            first_name: member.first_name,
            last_name: member.last_name,
            profile_image: member.profile_image,
          })),
      )
      .filter((member: CircleProp["members"][number]) => {
        if (seen.has(member.username)) return false;
        if (member.id === user?.id) return false;
        seen.add(member.username);
        return true;
      });
  };

  const allMembers: UserProp[] = getAllMembersInEachCircle();

  const filteredMembers = allMembers.filter(
    (m) =>
      m.username?.toLowerCase().includes(userQuery.toLowerCase()) ||
      m.first_name?.toLowerCase().includes(userQuery.toLowerCase()) ||
      m.last_name?.toLowerCase().includes(userQuery.toLowerCase()),
  );

  const filterMembersByCircle = (circle_id: string) => {
    if (!circle_id) return [];
    const findMembers =
      getAllCircleMembers?.data?.data.find(
        (circle: CircleProp) => circle.id === circle_id,
      ) ?? {};
    return (
      findMembers?.members?.map((member: CircleProp["members"][number]) => ({
        id: member.id,
        username: member.username,
        first_name: member.first_name,
        last_name: member.last_name,
        profile_image: member.profile_image,
      })) ?? []
    );
  };

  const displayedMembers = activeCircleFilter
    ? (filterMembersByCircle(activeCircleFilter) as UserProp[])
    : filteredMembers;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        layout
        className="w-full mx-auto max-w-sm sm:max-w-md px-4 sm:px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(var(--fg),0.08)" }}
          >
            <SearchMap
              selectedModal={selectedModal}
              onChange={(e) => setUserQuery(e)}
              value={userQuery}
              autoFocus={false}
            />
          </div>

          {/* Empty state — no members in any circle */}
          {!isSearchingUser && userQuery === "" && allMembers.length === 0 && (
            <motion.div
              key="no-people"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="rounded-xl px-6 py-10 text-center flex flex-col items-center gap-5"
              style={{
                background: "rgba(var(--fg),0.02)",
                border: "1px solid rgba(var(--fg),0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(var(--fg),0.05)",
                  border: "1px solid rgba(var(--fg),0.08)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" style={{ color: "rgba(var(--fg),0.35)" }} />
                  <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "rgba(var(--fg),0.35)" }} />
                  <path d="M16 11h6m-3-3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "rgba(var(--fg),0.35)" }} />
                </svg>
              </div>
              <div className="space-y-1">
                <p
                  className="text-sm font-medium tracking-[-0.1px]"
                  style={{ color: "rgba(var(--fg),0.55)" }}
                >
                  No one in your circles yet
                </p>
                <p
                  className="text-[11px] leading-relaxed tracking-[-0.1px] max-w-[220px] mx-auto"
                  style={{ color: "rgba(var(--fg),0.25)" }}
                >
                  Search by username above to invite someone, or skip ahead to the details.
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
            </motion.div>
          )}

          {/* Circles filter + default member list */}
          {!isSearchingUser &&
            userQuery === "" &&
            circlesOwnedByUser?.data?.data.length > 0 && (
              <motion.div
                key="browse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(var(--fg),0.02)",
                  border: "1px solid rgba(var(--fg),0.07)",
                }}
              >
                {/* Top shimmer */}
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(var(--fg),0.06), transparent)",
                  }}
                />

                <div className="p-4 flex flex-col gap-4">
                  {/* Circle filters */}
                  <div className="flex flex-col gap-3">
                    <p
                      className="text-left text-[9px] tracking-[2px] uppercase font-medium"
                      style={{ color: "rgba(var(--fg),0.2)" }}
                    >
                      Your circles
                    </p>
                    <div className="flex items-start gap-3 flex-wrap">
                      {(
                        (circlesOwnedByUser?.data?.data as CircleProp[]) ?? []
                      ).map((circle, index) => (
                        <motion.button
                          key={circle.id}
                          onClick={() =>
                            setActiveCircleFilter(
                              activeCircleFilter === circle.id
                                ? null
                                : (circle.id as string),
                            )
                          }
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.05 + index * 0.04,
                            duration: 0.2,
                            ease: EASE,
                          }}
                          whileTap={{ scale: 0.96 }}
                          className="flex flex-col items-center gap-1.5 cursor-pointer"
                        >
                          <div
                            className="w-12 h-12 rounded-xl relative overflow-hidden transition-all duration-200"
                            style={{
                              border:
                                activeCircleFilter === circle.id
                                  ? "1px solid rgba(var(--fg),0.25)"
                                  : "1px solid rgba(var(--fg),0.08)",
                              opacity:
                                activeCircleFilter &&
                                activeCircleFilter !== circle.id
                                  ? 0.45
                                  : 1,
                            }}
                          >
                            <Image
                              src={
                                circle.circle_image ?? "/fallback-circle.jpg"
                              }
                              fill
                              alt={circle.circle_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span
                            className="text-[9px] tracking-[-0.1px] max-w-12 truncate"
                            style={{ color: "rgba(var(--fg),0.45)" }}
                          >
                            {circle.circle_name}
                          </span>
                        </motion.button>
                      ))}

                      {/* Add circle */}
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        className="w-12 h-12 cursor-pointer rounded-xl flex justify-center items-center transition-colors duration-200"
                        style={{
                          background: "rgba(var(--fg),0.03)",
                          border: "1px solid rgba(var(--fg),0.07)",
                        }}
                      >
                        <PlusIcon size={16} color="#fff" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    style={{ height: 1, background: "rgba(var(--fg),0.05)" }}
                  />

                  {/* Member list */}
                  {displayedMembers.length > 0 && (
                    <div className="flex flex-col gap-0.5">
                      <p
                        className="text-left text-[9px] tracking-[2px] uppercase font-medium mb-2"
                        style={{ color: "rgba(var(--fg),0.2)" }}
                      >
                        {activeCircleFilter ? "Circle members" : "All members"}
                      </p>
                      {displayedMembers.slice(0, 5).map((person, index) => {
                        const isSelected = selectedUsers.some(
                          (u) => u.id === person.id,
                        );
                        if (isSelected) return null;
                        return (
                          <motion.button
                            key={person.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              delay: 0.05 + index * 0.04,
                              duration: 0.18,
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              setSelectedUsers((prev) => [...prev, person])
                            }
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150"
                            style={{ background: "transparent" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                "rgba(var(--fg),0.04)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <div
                              className="w-9 h-9 rounded-lg relative overflow-hidden shrink-0"
                              style={{
                                border: "1px solid rgba(var(--fg),0.08)",
                              }}
                            >
                              <Image
                                src={person.profile_image ?? "/fallback.jpg"}
                                alt={person.username}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p
                                className="text-sm font-medium tracking-[-0.1px] truncate"
                                style={{ color: "rgba(var(--fg),0.82)" }}
                              >
                                {person.first_name} {person.last_name}
                              </p>
                              <p
                                className="text-[11px] truncate tracking-[-0.1px]"
                                style={{ color: "rgba(var(--fg),0.3)" }}
                              >
                                @{person.username}
                              </p>
                            </div>
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                              style={{
                                background: "rgba(var(--fg),0.05)",
                                border: "1px solid rgba(var(--fg),0.09)",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "rgba(var(--fg),0.3)",
                                  lineHeight: 1,
                                }}
                              >
                                +
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          {/* Search results */}
          {userQuery.length > 0 && displayedMembers.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(var(--fg),0.02)",
                border: "1px solid rgba(var(--fg),0.07)",
              }}
            >
              <div className="p-3 flex flex-col gap-0.5">
                {displayedMembers.slice(0, 5).map((person, index) => {
                  if (selectedUsers.some((u) => u.id === person.id))
                    return null;
                  return (
                    <motion.button
                      key={person.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.04, duration: 0.18 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setSelectedUsers((prev) => [...prev, person])
                      }
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150"
                      style={{ background: "transparent" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(var(--fg),0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        className="w-9 h-9 rounded-lg relative overflow-hidden shrink-0"
                        style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                      >
                        <Image
                          src={person.profile_image ?? "/fallback.jpg"}
                          alt={person.username}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p
                          className="text-sm font-medium tracking-[-0.1px] truncate"
                          style={{ color: "rgba(var(--fg),0.82)" }}
                        >
                          {person.first_name} {person.last_name}
                        </p>
                        <p
                          className="text-[11px] truncate tracking-[-0.1px]"
                          style={{ color: "rgba(var(--fg),0.3)" }}
                        >
                          @{person.username}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!isSearchingUser &&
            userQuery.length >= 3 &&
            filteredMembers.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="rounded-xl p-8 text-center"
                style={{
                  background: "rgba(var(--fg),0.02)",
                  border: "1px solid rgba(var(--fg),0.07)",
                }}
              >
                <p
                  className="text-sm tracking-[-0.1px]"
                  style={{ color: "rgba(var(--fg),0.3)" }}
                >
                  No results for &quot;{userQuery}&quot;
                </p>
                <p
                  className="text-[11px] mt-1 tracking-[-0.1px]"
                  style={{ color: "rgba(var(--fg),0.18)" }}
                >
                  Try a different name
                </p>
              </motion.div>
            )}

          {/* Loading */}
          {isSearchingUser && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl p-8 flex flex-col items-center gap-3"
              style={{
                background: "rgba(var(--fg),0.02)",
                border: "1px solid rgba(var(--fg),0.07)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 rounded-full border-2"
                style={{
                  borderColor: "rgba(var(--fg),0.08)",
                  borderTopColor: "rgba(var(--fg),0.5)",
                }}
              />
              <p
                className="text-[11px] tracking-[-0.1px]"
                style={{ color: "rgba(var(--fg),0.3)" }}
              >
                Searching...
              </p>
            </motion.div>
          )}

          {/* Selected users */}
          {selectedUsers.length > 0 && (
            <motion.div
              key="selected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-4"
            >
              {/* Selected avatars */}
              <div className="flex gap-3 flex-wrap justify-center">
                {selectedUsers.map((u) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="flex flex-col items-center gap-1.5 relative"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() =>
                        setSelectedUsers((prev) =>
                          prev.filter((p) => p.id !== u.id),
                        )
                      }
                      className="w-5 h-5 rounded-full absolute z-20 -right-1.5 -top-1.5 cursor-pointer flex justify-center items-center"
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.15)",
                      }}
                    >
                      <CloseIcon size={10} color="#000" />
                    </button>
                    <div
                      className="w-14 h-14 rounded-xl overflow-hidden relative"
                      style={{ border: "1px solid rgba(var(--fg),0.1)" }}
                    >
                      <Image
                        src={u.profile_image ?? "/fallback.jpg"}
                        alt={u.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span
                      className="text-[9px] tracking-[-0.1px] max-w-14 truncate"
                      style={{ color: "rgba(var(--fg),0.45)" }}
                    >
                      {u.first_name}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Continue button */}
              <motion.button
                onClick={() => setSelectedModal("confirm")}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-sm font-medium tracking-[-0.1px]"
                style={{
                  background: "rgba(var(--fg),0.9)",
                  color: "rgb(var(--bg))",
                  border: "1px solid rgba(var(--fg),0.2)",
                }}
              >
                <span>
                  Continue with {selectedUsers.length}{" "}
                  {selectedUsers.length === 1 ? "person" : "people"}
                </span>
                <span style={{ opacity: 0.5 }}>→</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
