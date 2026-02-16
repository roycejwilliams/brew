import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import SearchMap from "./search";
import { CloseIcon, PlusIcon } from "./icons";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import useDebounce from "../hooks/useDebounce";

type MomentSelectionProp = "start" | "circle" | "people" | "nearby" | "confirm";

interface Circle {
  id: string;
  name: string;
  members: string[]; // or User[]
  image: string;
}

interface selectedModalProp {
  selectedModal: MomentSelectionProp;
  setSelectedModal: (selectedModal: MomentSelectionProp) => void;
  circles: Circle[];
}

//Purpose is to send this to a specific user
interface UserProp {
  id: string;
  username: string;
  phonenumber: string;
  email: string;
  profile: {
    fullname: string;
    avatarUrl: string | StaticImport;
  };
}

export default function People({
  selectedModal,
  circles,
  setSelectedModal,
}: selectedModalProp) {
  const [userQuery, setUserQuery] = useState("");
  //users returned from an actual search / database query
  //Will need it's own API call
  const [isSearchingUser, setIsSearchingUser] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  //Mock Data
  const mockSuggestedUsers: UserProp[] = [
    {
      id: "u1",
      username: "ava_martinez",
      phonenumber: "",
      email: "ava@example.com",
      profile: {
        fullname: "Ava Martinez",
        avatarUrl: "/profile-1.jpg",
      },
    },
    {
      id: "u2",
      username: "marcus_lee",
      phonenumber: "",
      email: "marcus@example.com",
      profile: {
        fullname: "Marcus Lee",
        avatarUrl: "/profile-2.jpg",
      },
    },
    {
      id: "u3",
      username: "elijah_brooks",
      phonenumber: "",
      email: "elijah@example.com",
      profile: {
        fullname: "Elijah Brooks",
        avatarUrl: "/profile-3.jpg",
      },
    },
    {
      id: "u4",
      username: "lina_park",
      phonenumber: "",
      email: "lina@example.com",
      profile: {
        fullname: "Lina Park",
        avatarUrl: "/profile-4.jpg",
      },
    },
    {
      id: "u5",
      username: "theo_reynolds",
      phonenumber: "",
      email: "theo@example.com",
      profile: {
        fullname: "Theo Reynolds",
        avatarUrl: "/profile-5.jpg",
      },
    },
  ];

  const mockPeopleResults = [
    {
      id: "u1",
      username: "jordan",
      phonenumber: "+13105551234",
      email: "jordan@brew.app",
      profile: {
        fullname: "Jordan Alvarez",
        avatarUrl: "/profile-7.jpg",
      },
    },
    {
      id: "u2",
      username: "maya",
      phonenumber: "+14155559876",
      email: "maya@brew.app",
      profile: {
        fullname: "Maya Chen",
        avatarUrl: "/profile-8.jpg",
      },
    },
    {
      id: "u3",
      username: "andre",
      phonenumber: "+15105554321",
      email: "andre@brew.app",
      profile: {
        fullname: "Andre Williams",
        avatarUrl: "/profile-9.jpg",
      },
    },
    {
      id: "u4",
      username: "sofia",
      phonenumber: "+13235550987",
      email: "sofia@brew.app",
      profile: {
        fullname: "Sofia Martinez",
        avatarUrl: "/profile-10.jpg",
      },
    },
    {
      id: "u5",
      username: "devon",
      phonenumber: "+12135556789",
      email: "devon@brew.app",
      profile: {
        fullname: "Devon Brooks",
        avatarUrl: "/profile-11.jpg",
      },
    },
  ];

  //Holds the results
  const [peopleResults, setPeopleResults] =
    useState<UserProp[]>(mockPeopleResults);

  //fallback users shown when search returns nothing
  //use basic queries in the backend to get suggestions
  //way different call than people search
  const [suggestedUsers, setSuggestedUsers] =
    useState<UserProp[]>(mockSuggestedUsers);

  const [selectedUsers, setSelectedUsers] = useState<UserProp[]>([]);

  //Unless i preserve the index, I can't restore the suggestions
  //back to their natural index.
  // I can use AI to define the order
  //must be attached to my api call
  const handleSelectionUsers = (user: UserProp) => {
    setSelectedUsers((prev) => {
      //if it finds the element in the area then its true
      const exist = prev.some((u) => u.id === user.id);

      //if it already exist, filter the array to contain the id
      //that doesn't equal the user id
      if (exist) {
        return prev.filter((u) => u.id !== user.id);
      }

      //spread array and append the user to it
      return [...prev, user];
    });
  };

  //handles the removal.
  //you start with users selected.
  // it removes the user that does equal the id after the mutated array
  const handleRemoveUser = (user: UserProp) => {
    //filters the array with only the id's of the array's that doesnt equal the target array
    setSelectedUsers((prev) => {
      return prev.filter((u) => u.id !== user.id);
    });
  };

  //Search Database function
  const userSearch = (query: string) => {
    try {
      setIsSearchingUser(true);

      setPeopleResults((prev) => {
        //Query will be lower case no matter what's entered
        const normalizeQuery = query.trim().toLowerCase();

        if (normalizeQuery === "") {
          return mockPeopleResults; // returns original list
        }

        //returns the filter list with names matching what's in the query
        return prev.filter((user: UserProp) =>
          user.profile.fullname.toLowerCase().includes(normalizeQuery),
        );
      });
    } catch (error) {
      console.error("Failed to filter people results", query, error);
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setUserQuery(value);
    userSearch(value);
  };

  const debouneQuery = useDebounce(userQuery, 500);

  useEffect(() => {
    if (debouneQuery.length >= 3) {
      userSearch(debouneQuery);
    }
  }, [debouneQuery]);

  const handleContinue = () => {
    setShowConfirmation(true);
  };

  const handleGoBack = () => {
    setShowConfirmation(false);
  };

  // Confirmation View - ENHANCED
  if (showConfirmation) {
    return (
      <motion.section
        key="confirmation"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1"
        >
          <h2 className="text-lg font-medium text-white/90">Ready to send</h2>
          <p className="text-sm text-white/40">
            {selectedUsers.length}{" "}
            {selectedUsers.length === 1 ? "person" : "people"} selected
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1c1c1c] rounded-lg border border-white/8 overflow-hidden shadow-2xl shadow-black/20"
        >
          <div className="p-5 space-y-1">
            {selectedUsers.map((user, index) => (
              <motion.div
                key={user.id}
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
                    src={user.profile.avatarUrl}
                    alt={user.profile.fullname}
                    fill
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-white/90 text-sm truncate">
                    {user.profile.fullname}
                  </div>
                  <div className="text-xs text-white/40 truncate">
                    @{user.username}
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
            onClick={handleGoBack}
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
              console.log("Proceeding with:", selectedUsers);
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
    <motion.section className="text-center space-y-5">
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
          onChange={handleSearchChange}
          value={userQuery}
          autoFocus={false}
        />
      </motion.div>

      <AnimatePresence mode="popLayout">
        {/* Active Result Selection */}
        {!isSearchingUser && (userQuery === "" || peopleResults.length > 0) && (
          <motion.div
            layout
            key="results-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#1c1c1c] rounded-lg border border-white/8 overflow-hidden shadow-2xl shadow-black/20"
          >
            {/* Show this only when there are no results and the user is not actively searching. */}
            {userQuery === "" && (
              <motion.div
                key="no-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="p-5"
              >
                {/* Circles */}
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
                      {circles.map((circle, index) => (
                        <motion.button
                          key={circle.id}
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
                              src={circle.image}
                              fill
                              alt={circle.name}
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
                            {circle.name.split(" ")[0]}
                          </motion.span>
                        </motion.button>
                      ))}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.1 + circles.length * 0.03,
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

                  {/* Suggested Users */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    className="space-y-3"
                  >
                    <h3 className="text-left text-white/40 text-xs font-medium uppercase tracking-wide">
                      Suggested for this vibe
                    </h3>
                    <div
                      className={`${
                        selectedUsers.length > 0 ? "max-h-40" : "max-h-70"
                      } overflow-hidden overflow-y-auto`}
                    >
                      <div className="space-y-1">
                        <AnimatePresence mode="popLayout">
                          {suggestedUsers.slice(0, 5).map((suggest, index) => (
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
                                layout: {
                                  duration: 0.25,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                              }}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleSelectionUsers(suggest)}
                              className={`w-full p-3 text-left hover:bg-white/4 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-x-4 ${
                                selectedUsers.some((u) => u.id === suggest.id)
                                  ? "hidden"
                                  : "flex"
                              }`}
                            >
                              <motion.div className="w-11 h-11 rounded-md relative overflow-hidden shadow-lg shrink-0 border border-white/8">
                                <Image
                                  src={suggest.profile.avatarUrl}
                                  alt={suggest.profile.fullname}
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
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
                </div>
              </motion.div>
            )}

            {/* Shows the search results */}
            {!isSearchingUser &&
              userQuery.length > 0 &&
              peopleResults.length > 0 && (
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
                      selectedUsers.length > 0 ? "max-h-60" : "max-h-80"
                    } overflow-hidden overflow-y-auto`}
                  >
                    <div className="space-y-1">
                      <AnimatePresence mode="popLayout">
                        {peopleResults.slice(0, 5).map((people, index) => (
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
                            onClick={() => handleSelectionUsers(people)}
                            className={`w-full p-3 text-left hover:bg-white/4 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-x-4 ${
                              selectedUsers.some((u) => u.id === people.id)
                                ? "hidden"
                                : "flex"
                            }`}
                          >
                            <motion.div className="w-11 h-11 rounded-md relative overflow-hidden shadow-lg shrink-0 border border-white/8">
                              <Image
                                src={people.profile.avatarUrl}
                                alt={people.profile.fullname}
                                fill
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white/90 text-sm truncate">
                                {people.profile.fullname}
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
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Selected Users Display */}
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
                {selectedUsers.map((selectedUser, index) => (
                  <motion.div
                    key={selectedUser.id}
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
                      onClick={() => handleRemoveUser(selectedUser)}
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
                        src={selectedUser.profile.avatarUrl}
                        alt={selectedUser.profile.fullname}
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
                      {selectedUser.profile.fullname.split(" ")[0]}
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
                  onClick={handleContinue}
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
        </AnimatePresence>

        {/* Empty State */}
        {!isSearchingUser &&
          userQuery.length >= 3 &&
          peopleResults.length === 0 && (
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
                <div className="text-white/20 text-2xl">👤</div>
                <p className="text-white/40 text-sm">
                  No results for "{userQuery}"
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
