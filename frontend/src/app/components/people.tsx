import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import SearchMap from "./search";
import { PlusIcon } from "./icons";
import Image from "next/image";

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
    avatarUrl: string | null;
  };
}

export default function People({ selectedModal, circles }: selectedModalProp) {
  const [user, setUser] = useState("");
  const [peopleResults, setPeopleResults] = useState<UserProp[]>([]);

  const mockSuggestedUsers: UserProp[] = [
    {
      id: "u1",
      username: "ava_martinez",
      phonenumber: "",
      email: "ava@example.com",
      profile: {
        fullname: "Ava Martinez",
        avatarUrl: "/avatars/ava.jpg",
      },
    },
    {
      id: "u2",
      username: "marcus_lee",
      phonenumber: "",
      email: "marcus@example.com",
      profile: {
        fullname: "Marcus Lee",
        avatarUrl: "/avatars/marcus.jpg",
      },
    },
    {
      id: "u3",
      username: "elijah_brooks",
      phonenumber: "",
      email: "elijah@example.com",
      profile: {
        fullname: "Elijah Brooks",
        avatarUrl: "/avatars/elijah.jpg",
      },
    },
    {
      id: "u4",
      username: "lina_park",
      phonenumber: "",
      email: "lina@example.com",
      profile: {
        fullname: "Lina Park",
        avatarUrl: "/avatars/lina.jpg",
      },
    },
    {
      id: "u5",
      username: "theo_reynolds",
      phonenumber: "",
      email: "theo@example.com",
      profile: {
        fullname: "Theo Reynolds",
        avatarUrl: "/avatars/theo.jpg",
      },
    },
  ];

  const [suggestedUsers, setSuggestedUsers] =
    useState<UserProp[]>(mockSuggestedUsers);

  const [selectedUsers, setSelectedUsers] = useState<UserProp[]>([]);

  const handleSelectionUsers = (user: UserProp) => {
    setSelectedUsers((prev) => {
      //returns true of if it finds one element in the array
      const exist = prev.some((u) => u.id === user.id);

      //if it does exist return the array without the new value
      if (exist) {
        return prev.filter((u) => u.id !== user.id);
      }
      //return array with user added if it doesnt exist
      return [...prev, user];
    });
  };

  console.log("Selected User", selectedUsers);

  return (
    <motion.section layout className="text-center space-y-4">
      <motion.h2
        key="browse-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mb-4 text-lg"
      >
        Who feels right for this?{" "}
      </motion.h2>
      <motion.div
        key="people"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="overflow-hidden text-center rounded-md border border-white/8"
      >
        <SearchMap selectedModal={selectedModal} />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1c1c1c] rounded-md border border-white/8 p-6 overflow-hidden shadow-2xl shadow-black/20"
        >
          {peopleResults.length === 0 && (
            <motion.div key="no-result ">
              {/* Circles */}
              <div className="space-y-4 ">
                <h2 className="text-left text-white/30 text-sm">
                  Inside your circles
                </h2>
                <div className="flex  items-start gap-x-2">
                  {circles.map((circle) => (
                    <>
                      <button
                        key={circle.id}
                        className="cursor-pointer flex flex-col justify-center gap-y-2 hover:scale-105 ease-in-out duration-300 transition-all "
                      >
                        <div className="w-12 h-12 rounded-full border border-dashed relative overflow-hidden">
                          <Image
                            src={circle.image}
                            fill
                            alt={circle.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs">
                          {circle.name.split(" ")[0]}
                        </span>
                      </button>
                    </>
                  ))}
                  <button className="w-12 h-12 cursor-pointer hover:scale-105 ease-in-out duration-300 transition-all border border-dashed rounded-full flex justify-center items-center">
                    <PlusIcon size={20} color="currentColor" />
                  </button>
                </div>
                {/* Suggest AI search */}

                <h2 className="text-left text-white/30 text-sm">
                  Suggested for this vibe{" "}
                </h2>
                <div className="max-h-65 overflow-hidden overflow-y-auto">
                  {suggestedUsers.slice(0, 5).map((suggest, index) => (
                    <motion.button
                      key={suggest.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectionUsers(suggest)}
                      className="w-full px-5 py-4 text-left shrink-0 transition-colors cursor-pointer flex gap-x-5 border-b border-white/5 last:border-b-0"
                    >
                      <div className="w-8 h-8 rounded-md border"></div>
                      <div>
                        <div className="font-medium text-white/90 text-sm mb-1">
                          {suggest.profile.fullname}
                        </div>
                        <div className="text-xs text-white/40">
                          {suggest.username}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {peopleResults.length > 0 && (
            <motion.div key="active-result">
              <div></div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
