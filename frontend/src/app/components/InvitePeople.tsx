import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import SearchMap from "./search";
import Image from "next/image";
import CloseIcon from "./icons/CloseIcon";
import { useGetCirclesWithMembers } from "@/hooks/useCircles";
import { useUserStore } from "@/stores/useUserStore";

type InviteSelection = "people" | "where" | "share";

interface InviteUserProp {
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
    return getAllCircleMembers.data.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .flatMap((circle: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        circle.members
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((member: any) => member != null)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((member: any) => ({
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((member: any) => {
        if (seen.has(member.username)) return false;
        if (member.id === user?.id) return false; // exclude self
        seen.add(member.username);
        return true;
      });
  };

  const allMembers = getAllMembersInEachCircle();
  const suggestedInvites = allMembers;

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

  const handleSelectedInviteUser = (user: InviteUserProp) => {
    if (selectedInvitedUser.some((u) => u.id === user.id)) return;
    setSelectedInvitedUser((prev) => [...prev, user]);
  };

  const handleRemoveInvitedUser = (user: InviteUserProp) => {
    setSelectedInvitedUser(selectedInvitedUser.filter((u) => u.id !== user.id));
  };

  const handleSelectExternal = () => {
    const external: InviteUserProp = {
      id: crypto.randomUUID(),
      username: inviteQuery,
      phonenumber: queryIsPhone ? inviteQuery : "",
      email: queryIsEmail ? inviteQuery : "",
      isExternal: true,
      profile: {
        fullname: inviteQuery,
        avatarUrl: "",
      },
    };
    setSelectedInvitedUser((prev) => [...prev, external]);
    setInviteQuery("");
    setRecipients([]);
  };

  const handleContinue = () => setShowConfirmation(true);
  const handleGoBack = () => setShowConfirmation(false);

  if (showConfirmation) {
    return (
      <motion.section
        key="confirmation"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-6 mx-auto max-w-xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1"
        >
          <h2 className="text-lg font-medium text-white/90">
            These people feel right
          </h2>
          <p className="text-sm text-white/40">
            {selectedInvitedUser.length}{" "}
            {selectedInvitedUser.length === 1 ? "person" : "people"} selected
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1c1c1c] rounded-lg border border-white/8 overflow-hidden shadow-2xl shadow-black/20"
        >
          <div className="p-5 space-y-1">
            {selectedInvitedUser.map((invite, index) => (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2 + index * 0.04,
                  duration: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ x: 2 }}
                className="flex items-center gap-x-4 p-3 rounded-md hover:bg-white/4 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-md overflow-hidden border border-white/8 shadow-lg relative shrink-0 flex items-center justify-center bg-white/5">
                  {!invite.isExternal && invite.profile.avatarUrl ? (
                    <Image
                      src={invite.profile.avatarUrl}
                      alt={invite.profile.fullname}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-white/30 text-xs font-medium">
                      {queryIsEmail ? "✉" : "#"}
                    </span>
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-white/90 text-sm truncate">
                    {invite.profile.fullname}
                  </div>
                  <div className="text-xs text-white/40 truncate">
                    {invite.isExternal ? (
                      <span className="text-white/25">
                        {queryType} · not on Brew yet
                      </span>
                    ) : (
                      `@${invite.username}`
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-x-3 justify-center pt-2"
        >
          <motion.button
            onClick={handleGoBack}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/5 backdrop-blur-2xl text-white/60 border border-white/10 rounded-md hover:bg-white/8 hover:text-white/90 hover:border-white/20 transition-all duration-200"
          >
            Go back
          </motion.button>
          <motion.button
            onClick={() => setInviteSelection("where")}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/90 backdrop-blur-2xl text-black border border-white/20 rounded-md hover:bg-white shadow-lg shadow-white/10 transition-all duration-200"
          >
            Confirm selection
          </motion.button>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      key="people"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="text-center space-y-6 mx-auto max-w-xl"
    >
      <motion.div
        key="invite-search"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden text-center rounded-lg border border-white/8 mx-auto"
      >
        <SearchMap
          placeholder="Invite by username, phone, or email"
          onChange={handleInviteUserSearch}
          value={inviteQuery}
          autoFocus={false}
        />
      </motion.div>

      <AnimatePresence mode="popLayout">
        {!isSearching && (inviteQuery === "" || receipients.length > 0) && (
          <motion.div
            layout
            key="receipients-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#1c1c1c] rounded-lg border border-white/8 overflow-hidden shadow-2xl shadow-black/20"
          >
            {inviteQuery === "" && (
              <motion.div
                key="suggested"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 space-y-3"
              >
                <h3 className="text-left text-white/40 text-xs font-medium uppercase tracking-wide">
                  From your circles
                </h3>
                <div
                  className={`${selectedInvitedUser.length > 0 ? "max-h-55" : "max-h-75"} overflow-y-auto`}
                >
                  <div className="space-y-1">
                    <AnimatePresence mode="popLayout">
                      {suggestedInvites.slice(0, 5).map((suggest, index) => (
                        <motion.button
                          key={suggest.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            x: -8,
                            transition: {
                              duration: 0.2,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          }}
                          transition={{
                            delay: 0.2 + index * 0.04,
                            duration: 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectedInviteUser(suggest)}
                          className={`w-full p-3 text-left hover:bg-white/4 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-x-4 ${selectedInvitedUser.some((u) => u.id === suggest.id) ? "hidden" : "flex"}`}
                        >
                          <div className="w-11 h-11 rounded-md relative overflow-hidden shadow-lg shrink-0 border border-white/8 bg-white/5 flex items-center justify-center">
                            {suggest.profile.avatarUrl ? (
                              <Image
                                src={suggest.profile.avatarUrl}
                                alt={suggest.profile.fullname}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs text-white/40 font-medium">
                                {suggest.first_name?.[0]}
                                {suggest.last_name?.[0]}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white/90 text-sm truncate">
                              {suggest.profile.fullname}
                            </div>
                            <div className="text-xs text-white/40 truncate">
                              @{suggest.username}
                            </div>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0"
                          />
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {!isSearching &&
              inviteQuery.length > 0 &&
              receipients.length > 0 && (
                <motion.div
                  key="active-result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="p-5"
                >
                  <div
                    className={`${selectedInvitedUser.length > 0 ? "max-h-60" : "max-h-80"} overflow-y-auto`}
                  >
                    <div className="space-y-1">
                      <AnimatePresence mode="popLayout">
                        {receipients.slice(0, 5).map((recipient, index) => (
                          <motion.button
                            key={recipient.id}
                            layout
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{
                              opacity: 0,
                              x: -8,
                              transition: {
                                duration: 0.2,
                                ease: [0.16, 1, 0.3, 1],
                              },
                            }}
                            transition={{
                              delay: 0.1 + index * 0.04,
                              duration: 0.25,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSelectedInviteUser(recipient)}
                            className={`w-full p-3 text-left hover:bg-white/4 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-x-4 ${selectedInvitedUser.some((u) => u.id === recipient.id) ? "hidden" : "flex"}`}
                          >
                            <div className="w-11 h-11 rounded-md relative overflow-hidden shadow-lg shrink-0 border border-white/8 bg-white/5 flex items-center justify-center">
                              {recipient.profile.avatarUrl ? (
                                <Image
                                  src={recipient.profile.avatarUrl}
                                  alt={recipient.profile.fullname}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className="text-xs text-white/40 font-medium">
                                  {recipient.first_name?.[0]}
                                  {recipient.last_name?.[0]}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white/90 text-sm truncate">
                                {recipient.profile.fullname}
                              </div>
                              <div className="text-xs text-white/40 truncate">
                                @{recipient.username}
                              </div>
                            </div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ opacity: 1, scale: 1 }}
                              className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0"
                            />
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
          </motion.div>
        )}

        {!isSearching &&
          inviteQuery.length >= 3 &&
          receipients.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#1c1c1c] rounded-lg border border-white/8 overflow-hidden shadow-2xl shadow-black/20"
            >
              {isExternalEligible ? (
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSelectExternal}
                  className="w-full p-5 text-left flex items-center gap-x-4 hover:bg-white/4 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-md shrink-0 flex items-center justify-center border border-white/8 bg-white/5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
                    <div className="font-medium text-white/80 text-sm truncate">
                      {inviteQuery}
                    </div>
                    <div className="text-xs text-white/30 mt-0.5">
                      Not on Brew · refer by {queryType}
                    </div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                </motion.button>
              ) : (
                <div className="p-12 text-center space-y-2">
                  <p className="text-white/40 text-sm">
                    No results for &quot;{inviteQuery}&quot;
                  </p>
                  <p className="text-white/25 text-xs">
                    Try an email or phone number
                  </p>
                </div>
              )}
            </motion.div>
          )}

        <AnimatePresence mode="wait">
          {selectedInvitedUser.length > 0 && (
            <motion.div
              key="user-selection"
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
                layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }}
              className="space-y-4"
            >
              <div className="flex gap-x-3 flex-wrap justify-center">
                {selectedInvitedUser.map((selectedUser, index) => (
                  <motion.div
                    key={selectedUser.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -2 }}
                    className="flex flex-col items-center gap-y-2 relative"
                  >
                    <motion.button
                      onClick={() => handleRemoveInvitedUser(selectedUser)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                          delay: 0.1 + index * 0.05,
                          duration: 0.2,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-5 h-5 rounded-full border border-white/20 absolute z-20 -right-1.5 -top-1.5 cursor-pointer flex justify-center items-center bg-white shadow-lg"
                    >
                      <CloseIcon size={12} color="#000" />
                    </motion.button>
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shadow-xl relative flex items-center justify-center bg-white/5">
                      {!selectedUser.isExternal &&
                      selectedUser.profile.avatarUrl ? (
                        <Image
                          src={selectedUser.profile.avatarUrl}
                          alt={selectedUser.profile.fullname}
                          fill
                          className="object-cover absolute inset-0"
                        />
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          {selectedUser.email ? (
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
                    <span className="text-xs text-white/60 max-w-17.5 truncate">
                      {selectedUser.isExternal
                        ? selectedUser.profile.fullname.split("@")[0]
                        : selectedUser.profile.fullname.split(" ")[0]}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center"
              >
                <motion.button
                  onClick={handleContinue}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/90 backdrop-blur-2xl text-black border border-white/20 rounded-md hover:bg-white shadow-lg shadow-white/10 transition-all duration-200"
                >
                  Continue with {selectedInvitedUser.length}{" "}
                  {selectedInvitedUser.length === 1 ? "person" : "people"}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isSearching && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#1c1c1c] rounded-lg border border-white/8 p-12 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full mx-auto"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="text-xs text-white/40 mt-4"
            >
              Searching...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
