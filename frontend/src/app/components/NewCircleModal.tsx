import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

interface ModalOpen {
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export default function NewCircleModal({ setIsModalOpen }: ModalOpen) {
  const [members, setMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock search results — replace with real data
  const mockUsers = [
    "Jordan Miles",
    "Ava Chen",
    "Marcus Webb",
    "Priya Nair",
    "Tyler Ross",
    "Simone Park",
    "Devon Kale",
    "Mia Torres",
    "Kai Lennox",
    "Zara Moon",
  ];

  const filteredUsers = searchQuery.trim()
    ? mockUsers.filter(
        (user) =>
          user.toLowerCase().includes(searchQuery.trim().toLowerCase()) &&
          !members.includes(user),
      )
    : [];

  const addMember = (user: string) => {
    setMembers((prev) => [...prev, user]);
    setSearchQuery("");
  };

  const removeMember = (user: string) => {
    setMembers((prev) => prev.filter((m) => m !== user));
  };

  return (
    <motion.div
      className="relative z-10 w-full max-w-md bg-linear-to-b from-white/8 to-white/3 border border-white/15 rounded-md shadow-2xl p-6 flex flex-col gap-5 backdrop-blur-xl"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Gloss highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent rounded-t-md" />
      <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-white/6 to-transparent rounded-t-md pointer-events-none" />

      <div className="flex items-center justify-between">
        <h2 className="text-white text-sm uppercase tracking-widest font-medium">
          New Circle
        </h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-white/30 hover:text-white/60 transition-colors cursor-pointer text-xs uppercase tracking-wide"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-xs uppercase tracking-wide">
            Name
          </label>
          <input
            type="text"
            placeholder="Name your circle"
            className="bg-white/6 border border-white/10 rounded-md px-3 py-2.5 text-white text-xs placeholder:text-xs placeholder:text-white/20 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-xs uppercase tracking-wide">
            Image
          </label>
          <div className="bg-white/4 border border-dashed border-white/10 rounded-md px-3 py-6 text-center cursor-pointer hover:border-white/20 hover:bg-white/6 transition-all">
            <p className="text-white/20 text-xs">
              Drop an image or click to upload
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-xs uppercase tracking-wide">
            Members
          </label>

          {/* Added members */}
          <AnimatePresence>
            {members.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-1.5 mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {members.map((member) => (
                  <motion.button
                    key={member}
                    type="button"
                    onClick={() => removeMember(member)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-white/70 text-xs cursor-pointer hover:bg-white/12 hover:border-white/20 transition-all group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {member}
                    <span className="text-white/25 group-hover:text-white/50 transition-colors">
                      ✕
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people to add..."
              className="w-full bg-white/6 border border-white/10 rounded-md px-3 py-2.5 text-white text-xs placeholder:text-xs placeholder:text-white/20 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
            />

            {/* Search results dropdown */}
            <AnimatePresence>
              {filteredUsers.length > 0 && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-1 bg-[#1c1c1c] border border-white/10 rounded-md overflow-hidden z-20"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {filteredUsers.map((user) => (
                    <motion.button
                      key={user}
                      type="button"
                      onClick={() => addMember(user)}
                      className="w-full text-left px-3 py-2 text-xs text-white/60 hover:bg-white/8 hover:text-white/90 cursor-pointer transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      {user}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.button
        className="relative w-full bg-white text-black text-xs uppercase tracking-widest font-medium py-3 rounded-md overflow-hidden cursor-pointer hover:bg-white/90 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
        Create Circle
      </motion.button>
    </motion.div>
  );
}
