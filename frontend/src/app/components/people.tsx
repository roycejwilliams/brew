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
}

export default function People({
  selectedModal,
  setSelectedModal,
  selectedUsers,
  setSelectedUsers,
}: selectedModalProp) {
  const [userQuery, setUserQuery] = useState("");
  //users returned from an actual search / database query
  //Will need it's own API call
  const [isSearchingUser, _setIsSearchingUser] = useState<boolean>(false);
  const [showConfirmation, _setShowConfirmation] = useState(false);

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

    //makes sure all values are unique
    const seen = new Set<string>();

    return (
      getAllCircleMembers.data.data
        //takes all the member array from each circle
        //pass callback function, waits for instructions
        //on what to pull from each circle
        .flatMap((circle: CircleProp) =>
          circle.members
            //filters out info that doesnt equal null
            .filter((member: CircleProp["members"][number] | null) => member != null)
            //get these values for each member
            .map((member: CircleProp["members"][number]) => ({
              id: member.id,
              username: member.username,
              first_name: member.first_name,
              last_name: member.last_name,
              profile_image: member.profile_image,
            })),
        )
        //filter expect boolean from callback
        .filter((member: CircleProp["members"][number]) => {
          //remove this user
          if (seen.has(member.username)) return false;
          if (member.id === user?.id) return false; // exclude self

          //add to set
          seen.add(member.username);
          //keep this user
          return true;
        })
    );
  };

  const allMembers: UserProp[] = getAllMembersInEachCircle();

  const filteredMembers = allMembers.filter(
    (m) =>
      m.username?.toLowerCase().includes(userQuery.toLowerCase()) ||
      m.first_name?.toLowerCase().includes(userQuery.toLowerCase()) ||
      m.last_name?.toLowerCase().includes(userQuery.toLowerCase()),
  );

  const filterMembersByCircle = (circle_id: string) => {
    if (!circle_id) return "";

    const findMembers =
      getAllCircleMembers?.data?.data.find(
        (circle: CircleProp) => circle.id === circle_id,
      ) ?? {};

    return (
      findMembers?.members.map((member: CircleProp["members"][number]) => ({
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

  // Confirmation View - ENHANCED
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
          <h2 className="text-lg font-medium text-white/90">Ready to send</h2>
          <p className="text-sm text-white/40">k</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1c1c1c] rounded-lg border border-white/8 overflow-hidden shadow-2xl shadow-black/20"
        >
          <div className="p-5 space-y-1">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2 + index * 0.04,
                  duration: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ x: 2 }}
                className="flex items-center gap-x-4 p-3 rounded-md hover:bg-white/4 transition-all duration-200 group"
              >
                <motion.div
                  className="w-12 h-12 rounded-md overflow-hidden border border-white/8 shadow-lg relative shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={member.profile_image ?? "/fallback.jpg"}
                    alt={member.username}
                    fill
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-white/90 text-sm truncate">
                    {member.first_name} {member.last_name}
                  </div>
                  <div className="text-xs text-white/40 truncate">
                    @{member.username}
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0"
                />
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
            // onClick={handleGoBack}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/5 backdrop-blur-2xl 
                      text-white/60 border border-white/10 rounded-md 
                      hover:bg-white/8 hover:text-white/90 hover:border-white/20
                      transition-all duration-200"
          >
            Go back
          </motion.button>
          <motion.button
            onClick={() => {
              // console.log("Proceeding with:", selectedUsers);
              setSelectedModal("confirm");
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/90 backdrop-blur-2xl 
                      text-black border border-white/20 rounded-md 
                      hover:bg-white shadow-lg shadow-white/10
                      transition-all duration-200"
          >
            Confirm selection
          </motion.button>
        </motion.div>
      </motion.section>
    );
  }

  // Main Selection View - ENHANCED
  return (
    <motion.section className="text-center space-y-5 mx-auto max-w-xl">
      <motion.div
        key="browse-header"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-1"
      >
        <h2 className="text-lg font-medium text-white/90">
          Who feels right for this?
        </h2>
        <p className="text-sm text-white/40">
          Search or select from your circles
        </p>
      </motion.div>

      <motion.div
        key="people"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden text-center rounded-lg border border-white/8"
      >
        <SearchMap
          selectedModal={selectedModal}
          onChange={(e) => setUserQuery(e)}
          value={userQuery}
          autoFocus={false}
        />
      </motion.div>

      <AnimatePresence mode="popLayout">
        {/* Active Result Selection */}
        {!isSearchingUser && (userQuery === "" || null) && (
          <motion.div
            layout
            key="results-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#1c1c1c] rounded-lg border border-white/8 overflow-hidden shadow-2xl shadow-black/20"
          >
            {userQuery === "" && (
              <motion.div
                key="no-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="p-5"
              >
                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05, duration: 0.2 }}
                    className="space-y-3"
                  >
                    <h3 className="text-left text-white/40 text-xs font-medium uppercase tracking-wide">
                      Inside your circles
                    </h3>
                    <div className="flex items-start gap-x-3">
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
                            delay: 0.1 + index * 0.03,
                            duration: 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer flex flex-col justify-center items-center gap-y-2"
                        >
                          <motion.div
                            className="w-14 h-14 rounded-full border border-white/10 relative overflow-hidden shadow-lg"
                            whileHover={{
                              borderColor: "rgba(255, 255, 255, 0.25)",
                              transition: {
                                duration: 0.2,
                                ease: [0.16, 1, 0.3, 1],
                              },
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
                          </motion.div>
                          <motion.span
                            className="text-xs text-white/70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              delay: 0.2 + index * 0.03,
                              duration: 0.2,
                            }}
                          >
                            {circle.circle_name}
                          </motion.span>
                        </motion.button>
                      ))}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay:
                            0.1 + circlesOwnedByUser?.data?.data.length * 0.03,
                          duration: 0.25,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={{
                          scale: 1.05,
                          y: -2,
                          borderColor: "rgba(255, 255, 255, 0.25)",
                          transition: {
                            duration: 0.2,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="w-14 h-14 cursor-pointer border border-white/10 rounded-full flex justify-center items-center hover:bg-white/5 transition-colors duration-200"
                      >
                        <motion.div
                          whileHover={{ rotate: 90 }}
                          transition={{
                            duration: 0.2,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <PlusIcon size={18} color="currentColor" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Shows the search results */}
        {displayedMembers.length > 0 && (
          <motion.div
            key="active-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="p-5"
          >
            <div
              className={`${
                displayedMembers.length > 0 ? "max-h-60" : "max-h-80"
              } overflow-hidden overflow-y-auto`}
            >
              <div className="space-y-1">
                {displayedMembers.slice(0, 5).map((people, index) => (
                  <motion.button
                    key={people.id}
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
                      layout: {
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() =>
                      setSelectedUsers((prev) => [...prev, people])
                    }
                    className={`w-full p-3 text-left hover:bg-white/4 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-x-4 ${
                      selectedUsers.some((u) => u.id === people.id)
                        ? "hidden"
                        : "flex"
                    }`}
                  >
                    <motion.div className="w-11 h-11 rounded-md relative overflow-hidden shadow-lg shrink-0 border border-white/8">
                      <Image
                        src={people.profile_image ?? "/fallback.jpg"}
                        alt={people.username}
                        fill
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white/90 text-sm truncate">
                        {people.first_name} {people.last_name}
                      </div>
                      <div className="text-xs text-white/40 truncate">
                        @{people.username}
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {selectedUsers.length > 0 && (
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
              {selectedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -2 }}
                  className="flex flex-col items-center gap-y-2 relative"
                >
                  <motion.button
                    onClick={() =>
                      setSelectedUsers(() =>
                        selectedUsers.filter((prev) => prev.id !== user.id),
                      )
                    }
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
                  <motion.div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shadow-xl relative">
                    <Image
                      src={user.profile_image ?? "/fallback.jpg"}
                      alt={user.username}
                      fill
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 0.15 + index * 0.05,
                        duration: 0.2,
                      },
                    }}
                    className="text-xs text-white/60 max-w-17.5 truncate"
                  >
                    {user.first_name} {user.last_name}
                  </motion.span>
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
                onClick={() => setSelectedModal("confirm")}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm font-medium cursor-pointer px-6 py-3.5 bg-white/90 backdrop-blur-2xl 
                            text-black border border-white/20 rounded-md 
                            hover:bg-white shadow-lg shadow-white/10
                            transition-all duration-200"
              >
                Continue with {selectedUsers.length}{" "}
                {selectedUsers.length === 1 ? "person" : "people"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isSearchingUser &&
          userQuery.length >= 3 &&
          filteredMembers.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#1c1c1c] rounded-lg border border-white/8 p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="space-y-2"
              >
                <p className="text-white/40 text-sm">
                  No results for &quot;{userQuery}&quot;
                </p>
                <p className="text-white/30 text-xs">
                  Try searching for a different name
                </p>
              </motion.div>
            </motion.div>
          )}

        {/* Loading State */}
        {isSearchingUser && (
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
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
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
