import { AnimatePresence, motion } from "motion/react";
import React, {
  ChangeEvent,
  InputEvent,
  InputEventHandler,
  useEffect,
  useState,
} from "react";
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

export default function People({ selectedModal, circles }: selectedModalProp) {
  const [userQuery, setUserQuery] = useState("");
  const [allPeople, setAllPeople] = useState<UserProp[]>();
  //users returned from an actual search / database query
  //Will need it's own API call
  const [isSearchingUser, setIsSearchingUser] = useState<boolean>(false);

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
      setPeopleResults((prev) => {
        //Query will be lower case no matter what's entered
        const normalizeQuery = query.trim().toLowerCase();

        if (normalizeQuery === "") {
          return mockPeopleResults; // returns original list
        }

        //returns the filter list with the query params
        return prev.filter((user: UserProp) =>
          user.profile.fullname.toLowerCase().includes(normalizeQuery),
        );
      });
    } catch (error) {
      console.error("Failed to filter people results", query, error);
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

  return (
    <motion.section className="text-center space-y-4">
      <motion.h2
        key="browse-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 text-lg"
      >
        Who feels right for this?{" "}
      </motion.h2>
      <motion.div
        key="people"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden text-center rounded-md border border-white/8"
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
            transition={{ duration: 0.3 }}
            className="bg-[#1c1c1c] rounded-md border border-white/8 p-6 overflow-hidden shadow-2xl shadow-black/20"
          >
            {/* Show this only when there are no results and the user is not actively searching. */}
            {userQuery === "" && (
              <motion.div
                key="no-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Circles */}
                <div className="space-y-4 ">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05, duration: 0.2 }}
                    className="text-left text-white/30 text-sm"
                  >
                    Inside your circles
                  </motion.h2>
                  <div className="flex items-start gap-x-2">
                    {circles.map((circle, index) => (
                      <motion.button
                        key={circle.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.1 + index * 0.03,
                          duration: 0.25,
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer flex flex-col justify-center gap-y-2"
                      >
                        <motion.div
                          className="w-12 h-12 rounded-full border border-dashed relative overflow-hidden"
                          whileHover={{
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            transition: { duration: 0.2 },
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
                          className="text-xs"
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
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -2,
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-12 h-12 cursor-pointer border border-dashed rounded-full flex justify-center items-center"
                    >
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PlusIcon size={20} color="currentColor" />
                      </motion.div>
                    </motion.button>
                  </div>
                  {/* Suggest AI search */}

                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    className="text-left text-white/30 text-sm"
                  >
                    Suggested for this vibe
                  </motion.h2>
                  <div
                    className={`${selectedUsers.length > 0 ? "max-h-55" : "max-h-75"} overflow-hidden overflow-y-auto`}
                  >
                    <AnimatePresence mode="popLayout">
                      {suggestedUsers.slice(0, 5).map((suggest, index) => (
                        <motion.button
                          key={suggest.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                          transition={{
                            delay: 0.2 + index * 0.04,
                            duration: 0.25,
                            layout: { duration: 0.25 },
                          }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectionUsers(suggest)}
                          className={`w-full px-2 py-4 text-left shrink-0 hover:bg-white/4 ease-in-out duration-300 transition-colors cursor-pointer flex gap-x-5 border-b border-white/5 last:border-b-0 ${
                            selectedUsers.some((u) => u.id === suggest.id)
                              ? "hidden"
                              : "block"
                          }`}
                        >
                          <motion.div className="w-10 h-10 rounded-sm relative overflow-hidden shadow-xl">
                            <Image
                              src={suggest.profile.avatarUrl}
                              alt={suggest.profile.fullname}
                              fill
                              className="w-full h-full object-cover "
                            />
                          </motion.div>
                          <div>
                            <div className="font-medium text-white/90 text-sm mb-1">
                              {suggest.profile.fullname}
                            </div>
                            <div className="text-xs text-white/40">
                              @{suggest.username}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
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
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`${selectedUsers.length > 0 ? "max-h-55" : "max-h-75"} overflow-hidden overflow-y-auto`}
                  >
                    <AnimatePresence mode="popLayout">
                      {peopleResults.slice(0, 5).map((people, index) => (
                        <motion.button
                          key={people.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                          transition={{
                            delay: 0.2 + index * 0.04,
                            duration: 0.25,
                            layout: { duration: 0.25 },
                          }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectionUsers(people)}
                          className={`w-full px-2 py-4 text-left shrink-0 hover:bg-white/4 ease-in-out duration-300 transition-colors cursor-pointer flex gap-x-5 border-b border-white/5 last:border-b-0 ${
                            selectedUsers.some((u) => u.id === people.id)
                              ? "hidden"
                              : "block"
                          }`}
                        >
                          <motion.div className="w-10 h-10 rounded-sm relative overflow-hidden shadow-xl">
                            <Image
                              src={people.profile.avatarUrl}
                              alt={people.profile.fullname}
                              fill
                              className="w-full h-full object-cover "
                            />
                          </motion.div>
                          <div>
                            <div className="font-medium text-white/90 text-sm mb-1">
                              {people.profile.fullname}
                            </div>
                            <div className="text-xs text-white/40">
                              @{people.username}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>{" "}
                </motion.div>
              )}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* WHen selected user array is over 0 it shows the section */}
          {selectedUsers.length > 0 && (
            <motion.div
              key="user-selection"
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.25,
                layout: { duration: 0.3 },
              }}
              className="flex gap-x-4"
            >
              {selectedUsers.map((selectedUser, index) => (
                <motion.div
                  key={selectedUser.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
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
                      },
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-4 h-4 rounded-full border absolute z-20 -right-2 -top-2 cursor-pointer flex justify-center items-center bg-white"
                  >
                    <CloseIcon size={14} color="#000" />
                  </motion.button>
                  <motion.div className="w-14 h-14 rounded-md overflow-hidden border border-white/8 shadow-xl relative ">
                    <Image
                      src={selectedUser.profile.avatarUrl}
                      alt={selectedUser.profile.fullname}
                      fill
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
          {selectedUsers.length > 0 && (
            <div className=" w-fit ">
              <motion.button
                key="continue"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-sm cursor-pointer px-5 py-3.5 bg-[#636363]/20 backdrop-blur-2xl 
                            text-white/90 border border-white/50 rounded-md 
                            transition-colors duration-150"
              >
                Continue
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        {!isSearchingUser &&
          userQuery.length >= 3 &&
          peopleResults.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center py-12 text-white/30 text-xs"
            >
              No name found matching "{userQuery}"
            </motion.div>
          )}

        {/* Shows the loading state */}
        {isSearchingUser && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full mx-auto"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="text-xs text-white/30 mt-3"
            >
              Searching...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
