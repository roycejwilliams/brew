"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import SearchMap from "./search";
import Image from "next/image";
import CloseIcon from "./icons/CloseIcon";
import { useGetCirclesWithMembers } from "@/hooks/useCircles";
import { useUserStore } from "@/stores/useUserStore";

type InviteSelection = "people" | "where" | "share";

interface CircleMember {
  id: string;
  username: string;
  phonenumber?: string | null;
  email?: string | null;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
}

interface CircleWithMembers {
  members: (CircleMember | null)[];
}

export interface InviteUserProp {
  id: string;
  username: string;
  phonenumber: string;
  email: string;
  isExternal?: boolean;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  profile: {
    fullname: string;
    avatarUrl: string;
  };
}

interface InvitePeopleProp {
  selectedInvitedUser: InviteUserProp[];
  setSelectedInvitedUser: React.Dispatch<
    React.SetStateAction<InviteUserProp[]>
  >;
  setInviteSelection: (inviteSelection: InviteSelection) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function InvitePeople({
  setInviteSelection,
  selectedInvitedUser,
  setSelectedInvitedUser,
}: InvitePeopleProp) {
  const [inviteQuery, setInviteQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [receipients, setRecipients] = useState<InviteUserProp[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { user } = useUserStore();
  const { data: getAllCircleMembers } = useGetCirclesWithMembers(
    user?.id as string,
  );

  const isEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isPhone = (value: string) =>
    /^[\+]?[\d\s\-\(\)]{7,15}$/.test(value.trim());

  const queryIsEmail = isEmail(inviteQuery);
  const queryIsPhone = isPhone(inviteQuery);
  const queryType = queryIsEmail ? "email" : queryIsPhone ? "phone" : null;
  const isExternalEligible = queryIsEmail || queryIsPhone;

  const getAllMembersInEachCircle = (): InviteUserProp[] => {
    if (!getAllCircleMembers?.data.data) return [];
    const seen = new Set<string>();
    return (
      getAllCircleMembers.data.data
        .flatMap((circle: CircleWithMembers) =>
          circle.members
            .filter((m): m is CircleMember => m !== null)
            .map((member) => ({
              id: member.id,
              username: member.username,
              phonenumber: member.phonenumber ?? "",
              email: member.email ?? "",
              first_name: member.first_name,
              last_name: member.last_name,
              profile_image: member.profile_image,
              profile: {
                fullname: `${member.first_name} ${member.last_name}`,
                avatarUrl: member.profile_image ?? "",
              },
            })),
        )
        .filter((member: InviteUserProp) => {
          if (seen.has(member.username)) return false;
          if (member.id === user?.id) return false;
          seen.add(member.username);
          return true;
        })
    );
  };

  const allMembers = getAllMembersInEachCircle();

  const handleInviteUserSearch = (value: string) => {
    setInviteQuery(value);
    if (value.length >= 2) {
      setIsSearching(true);
      const results = allMembers.filter(
        (m) =>
          m.username?.toLowerCase().includes(value.toLowerCase()) ||
          m.first_name?.toLowerCase().includes(value.toLowerCase()) ||
          m.last_name?.toLowerCase().includes(value.toLowerCase()),
      );
      setRecipients(results);
      setIsSearching(false);
    } else {
      setRecipients([]);
    }
  };

  const handleSelectedInviteUser = (u: InviteUserProp) => {
    if (selectedInvitedUser.some((s) => s.id === u.id)) return;
    setSelectedInvitedUser((prev) => [...prev, u]);
  };

  const handleRemoveInvitedUser = (u: InviteUserProp) => {
    setSelectedInvitedUser(selectedInvitedUser.filter((s) => s.id !== u.id));
  };

  const handleSelectExternal = () => {
    const external: InviteUserProp = {
      id: crypto.randomUUID(),
      username: inviteQuery,
      phonenumber: queryIsPhone ? inviteQuery : "",
      email: queryIsEmail ? inviteQuery : "",
      isExternal: true,
      profile: { fullname: inviteQuery, avatarUrl: "" },
    };
    setSelectedInvitedUser((prev) => [...prev, external]);
    setInviteQuery("");
    setRecipients([]);
  };

  // ── Confirmation screen ──
  if (showConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1 text-center">
          <h2
            className="text-base font-medium tracking-[-0.3px]"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            These people feel right.
          </h2>
          <p
            className="text-sm tracking-[-0.1px]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {selectedInvitedUser.length}{" "}
            {selectedInvitedUser.length === 1 ? "person" : "people"} selected
          </p>
        </div>

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
          <div className="p-3 flex flex-col gap-0.5">
            {selectedInvitedUser.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              >
                <div
                  className="w-9 h-9 rounded-lg relative overflow-hidden shrink-0 flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {!invite.isExternal && invite.profile.avatarUrl ? (
                    <Image
                      src={invite.profile.avatarUrl}
                      alt={invite.profile.fullname}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}
                    >
                      {queryIsEmail ? "✉" : "#"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium tracking-[-0.1px] truncate"
                    style={{ color: "rgba(255,255,255,0.82)" }}
                  >
                    {invite.profile.fullname}
                  </p>
                  <p
                    className="text-[11px] truncate tracking-[-0.1px]"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {invite.isExternal
                      ? `${queryType} · not on Brew yet`
                      : `@${invite.username}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirmation(false)}
            className="flex-1 flex justify-center items-center px-4 py-3 rounded-xl cursor-pointer transition-colors duration-150 text-sm font-medium tracking-[-0.1px]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Go back
          </button>
          <motion.button
            onClick={() => setInviteSelection("where")}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-sm font-medium tracking-[-0.1px]"
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "#0c0c0c",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span>Confirm</span>
            <span style={{ opacity: 0.4 }}>→</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── Main selection screen ──
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0 flex flex-col gap-4"
    >
      {/* Search */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <SearchMap
          placeholder="Invite by username, phone, or email"
          onChange={handleInviteUserSearch}
          value={inviteQuery}
          autoFocus={false}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {/* Default — from your circles */}
        {!isSearching && inviteQuery === "" && (
          <motion.div
            key="suggested"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
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
            <div className="p-4 flex flex-col gap-3">
              <p
                className="text-left text-[9px] tracking-[2px] uppercase font-medium"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                From your circles
              </p>
              <div className="flex flex-col gap-0.5">
                {allMembers.slice(0, 5).map((suggest, index) => {
                  if (selectedInvitedUser.some((u) => u.id === suggest.id))
                    return null;
                  return (
                    <motion.button
                      key={suggest.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.04 + index * 0.04,
                        duration: 0.18,
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectedInviteUser(suggest)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 text-left"
                      style={{ background: "transparent" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        className="w-9 h-9 rounded-lg relative overflow-hidden shrink-0 flex items-center justify-center"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {suggest.profile.avatarUrl ? (
                          <Image
                            src={suggest.profile.avatarUrl}
                            alt={suggest.profile.fullname}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span
                            className="text-xs font-medium"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {suggest.first_name?.[0]}
                            {suggest.last_name?.[0]}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium tracking-[-0.1px] truncate"
                          style={{ color: "rgba(255,255,255,0.82)" }}
                        >
                          {suggest.profile.fullname}
                        </p>
                        <p
                          className="text-[11px] truncate tracking-[-0.1px]"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          @{suggest.username}
                        </p>
                      </div>
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.09)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.3)",
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
            </div>
          </motion.div>
        )}

        {/* Search results */}
        {!isSearching && inviteQuery.length > 0 && receipients.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="p-3 flex flex-col gap-0.5">
              {receipients.slice(0, 5).map((recipient, index) => {
                if (selectedInvitedUser.some((u) => u.id === recipient.id))
                  return null;
                return (
                  <motion.button
                    key={recipient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.04, duration: 0.18 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectedInviteUser(recipient)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 text-left"
                    style={{ background: "transparent" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div
                      className="w-9 h-9 rounded-lg relative overflow-hidden shrink-0 flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {recipient.profile.avatarUrl ? (
                        <Image
                          src={recipient.profile.avatarUrl}
                          alt={recipient.profile.fullname}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span
                          className="text-xs font-medium"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {recipient.first_name?.[0]}
                          {recipient.last_name?.[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium tracking-[-0.1px] truncate"
                        style={{ color: "rgba(255,255,255,0.82)" }}
                      >
                        {recipient.profile.fullname}
                      </p>
                      <p
                        className="text-[11px] truncate tracking-[-0.1px]"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        @{recipient.username}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Empty — external eligible */}
        {!isSearching &&
          inviteQuery.length >= 3 &&
          receipients.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {isExternalEligible ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSelectExternal}
                  className="w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150 text-left"
                  style={{ background: "transparent" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      {queryIsEmail ? (
                        <path
                          d="M2 4h12v8H2V4zm0 0l6 5 6-5"
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <path
                          d="M5 2h6a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1zm3 10h.01"
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium tracking-[-0.1px] truncate"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {inviteQuery}
                    </p>
                    <p
                      className="text-[11px] tracking-[-0.1px] mt-0.5"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      Not on Brew · refer by {queryType}
                    </p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.3)",
                        lineHeight: 1,
                      }}
                    >
                      +
                    </span>
                  </div>
                </motion.button>
              ) : (
                <div className="p-8 text-center flex flex-col gap-1">
                  <p
                    className="text-sm tracking-[-0.1px]"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    No results for &quot;{inviteQuery}&quot;
                  </p>
                  <p
                    className="text-[11px] tracking-[-0.1px]"
                    style={{ color: "rgba(255,255,255,0.18)" }}
                  >
                    Try an email or phone number
                  </p>
                </div>
              )}
            </motion.div>
          )}

        {/* Loading */}
        {isSearching && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl p-8 flex flex-col items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 rounded-full border-2"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                borderTopColor: "rgba(255,255,255,0.5)",
              }}
            />
            <p
              className="text-[11px] tracking-[-0.1px]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Searching...
            </p>
          </motion.div>
        )}

        {/* Selected users */}
        {selectedInvitedUser.length > 0 && (
          <motion.div
            key="selected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-3 flex-wrap justify-center">
              {selectedInvitedUser.map((u) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="flex flex-col items-center gap-1.5 relative"
                >
                  <button
                    onClick={() => handleRemoveInvitedUser(u)}
                    className="w-5 h-5 rounded-full absolute z-20 -right-1.5 -top-1.5 cursor-pointer flex justify-center items-center"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.15)",
                    }}
                  >
                    <CloseIcon size={10} color="#000" />
                  </button>
                  <div
                    className="w-14 h-14 rounded-xl overflow-hidden relative flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {!u.isExternal && u.profile.avatarUrl ? (
                      <Image
                        src={u.profile.avatarUrl}
                        alt={u.profile.fullname}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        {u.email ? (
                          <path
                            d="M2 4h12v8H2V4zm0 0l6 5 6-5"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ) : (
                          <path
                            d="M5 2h6a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1zm3 10h.01"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-[9px] tracking-[-0.1px] max-w-14 truncate"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {u.isExternal
                      ? u.profile.fullname.split("@")[0]
                      : u.profile.fullname.split(" ")[0]}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => setShowConfirmation(true)}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 text-sm font-medium tracking-[-0.1px]"
              style={{
                background: "rgba(255,255,255,0.9)",
                color: "#0c0c0c",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span>
                Continue with {selectedInvitedUser.length}{" "}
                {selectedInvitedUser.length === 1 ? "person" : "people"}
              </span>
              <span style={{ opacity: 0.4 }}>→</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
