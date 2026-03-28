import { ChevronRight, PlusIcon, X } from "lucide-react";
import { AnimatePresence, motion, Variants } from "motion/react";
import React, { useState } from "react";
import CircleScene from "./CircleScene";
import CircleControls from "./circleControls";
import { PlusCircleIcon } from "./icons";
import SearchMap from "./search";
import Image from "next/image";
import NewCircleModal from "./NewCircleModal";

interface Circle {
  id: string;
  name: string;
  members: string[];
  image: string;
}

interface CircleSceneProp {
  circles: Circle[];
  selectedCircle: Circle | null;
  activeIndex: number;
}

const buttonContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const nextMarker = () => {
    setMarkerIndex((i) => (i + 1) % selectedManageCircle?.members.length!);
  };

  const prevMarker = () => {
    setMarkerIndex(
      (i) =>
        (i - 1 + selectedManageCircle?.members.length!) %
        selectedManageCircle?.members.length!,
    );
  };

  const mockCircles: Circle[] = [
    {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "The Usual Suspects",
      members: ["Jordan Miles", "Ava Chen", "Marcus Webb", "Priya Nair"],
      image: "/EventRecap-5.jpg",
    },
    {
      id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      name: "Bay Nights",
      members: ["Tyler Ross", "Simone Park", "Devon Kale", "Mia Torres"],
      image: "/EventRecap-2.jpg",
    },
    {
      id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
      name: "Studio Crew",
      members: ["Kai Lennox", "Zara Moon", "Felix Osei"],
      image: "/EventRecap-3.jpg",
    },
    {
      id: "d4e5f6a7-b8c9-0123-defa-234567890123",
      name: "Rooftop Regulars",
      members: [
        "Nadia Voss",
        "Chris Endo",
        "Lena Park",
        "Sam Diallo",
        "Omar Reyes",
      ],
      image: "/EventRecap-4.jpg",
    },
  ];

  const [selectedManageCircle, setSelectedManageCircle] =
    useState<Circle | null>(mockCircles[0]);

  const handleSelectedCircle = (circle: Circle) => {
    setSelectedManageCircle((prev) => {
      if (!prev) return circle;
      const exist = prev.id === circle.id;
      if (exist) return prev;
      setMarkerIndex(0);
      return circle;
    });
  };

  const handleSearchCircle = (value: string) => {
    setQuery(value);
  };

  const filteredMembers = selectedManageCircle
    ? query.trim() === ""
      ? selectedManageCircle.members
      : selectedManageCircle.members.filter((m) =>
          m.toLowerCase().includes(query.trim().toLowerCase()),
        )
    : [];

  const mockCircleScene: CircleSceneProp = {
    circles: mockCircles,
    selectedCircle: selectedManageCircle,
    activeIndex: 0,
  };

  return (
    <section className="flex-1 shrink-0 relative">
      {/* ── Modal overlay ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <NewCircleModal setIsModalOpen={setIsModalOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top bar ── */}
      <motion.div
        className="flex justify-between px-8 pb-4 pt-8 items-start z-20 text-sm backdrop-blur-[10px] bg-[#1b1b1b]/5 border-b border-white/5 shadow-sm absolute top-0 w-full"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h1 className="tracking-[0.15em] font-normal uppercase text-[#555]">
          {selectedManageCircle?.name}
        </h1>
        <motion.button
          className="relative flex gap-x-1.5 cursor-pointer items-center px-4 py-2 rounded-lg text-xs text-white/90 overflow-hidden border border-white/10 bg-white/6 backdrop-blur-sm"
          whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
          <PlusIcon size={14} strokeWidth={2} />
          New Circle
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-4 h-full">
        {/* ── Main scene ── */}
        <div className="col-span-3 content-center relative">
          <div className="relative">
            <CircleScene
              circles={mockCircleScene.circles}
              selectedCircle={mockCircleScene.selectedCircle}
              markerIndex={markerIndex}
            />
            <CircleControls nextMarker={nextMarker} prevMarker={prevMarker} />
          </div>

          {/* ── Action buttons ── */}
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
                },
                {
                  icon: <X className="w-5 h-5" />,
                  label: "Remove",
                  color: "rgba(248,113,113,1)",
                  border: "rgba(248,113,113,0.4)",
                  textColor: "text-red-400/60",
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

        {/* ── Sidebar ── */}
        <div className="col-span-1 border-l border-white/4 relative">
          <div className="absolute inset-0 bg-linear-to-r from-white/1 to-transparent pointer-events-none" />

          <div className="relative px-6 pt-32 pb-6 h-full flex flex-col">
            {/* ── Circle list ── */}
            <div>
              <h2 className="uppercase text-[11px] tracking-[0.2em] text-white/25 font-medium mb-4">
                Circle
              </h2>
              <div className="space-y-1">
                <AnimatePresence>
                  {mockCircleScene.circles.map((circle) => {
                    const isActive = selectedManageCircle?.id === circle.id;
                    return (
                      <motion.button
                        onClick={() => handleSelectedCircle(circle)}
                        key={circle.id}
                        className={`
                          w-full flex items-center gap-x-3 px-3 py-2.5 rounded-lg cursor-pointer
                          transition-colors duration-200 group relative
                          ${isActive ? "bg-white/6" : "hover:bg-white/3"}
                        `}
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
                          className={`
                          w-10 h-10 rounded-full overflow-hidden relative shrink-0
                          ring-1 transition-all duration-300
                          ${isActive ? "ring-white/20 shadow-lg shadow-white/3" : "ring-white/6"}
                        `}
                        >
                          <Image
                            src={circle.image}
                            alt={circle.name}
                            fill
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <span
                            className={`
                            text-sm truncate block transition-colors duration-200
                            ${isActive ? "text-white/90" : "text-white/50 group-hover:text-white/70"}
                          `}
                          >
                            {circle.name}
                          </span>
                          <span className="text-[11px] text-white/20">
                            {circle.members.length} members
                          </span>
                        </div>
                        <ChevronRight
                          size={14}
                          className={`
                            shrink-0 transition-all duration-200
                            ${isActive ? "text-white/30 translate-x-0" : "text-transparent group-hover:text-white/20 -translate-x-1 group-hover:translate-x-0"}
                          `}
                        />
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="my-5 h-px bg-linear-to-r from-transparent via-white/6 to-transparent" />

            {/* ── Search ── */}
            <div className="rounded-lg overflow-hidden border border-white/5 bg-white/2">
              <SearchMap
                value={query}
                onChange={handleSearchCircle}
                autoFocus={false}
              />
            </div>

            {/* ── Member list ── */}
            <div className="mt-3 flex-1 overflow-y-auto no-scroll">
              <AnimatePresence mode="popLayout">
                {filteredMembers.map((member, i) => {
                  const memberGlobalIndex =
                    selectedManageCircle?.members.indexOf(member) ?? i;
                  const isActiveMarker = memberGlobalIndex === markerIndex;

                  return (
                    <motion.button
                      onClick={() => setMarkerIndex(memberGlobalIndex)}
                      key={`${selectedManageCircle?.id}-${member}`}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: -8,
                        transition: {
                          duration: 0.15,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }}
                      transition={{
                        delay: 0.15 + i * 0.03,
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full px-3 py-2.5 text-left rounded-lg
                        transition-all duration-200 cursor-pointer
                        flex items-center gap-x-3 group relative
                        ${isActiveMarker ? "bg-white/5" : "hover:bg-white/2"}
                      `}
                    >
                      <div
                        className={`
                        w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0
                        border transition-all duration-200
                        ${
                          isActiveMarker
                            ? "border-white/20 bg-white/8 text-white/80"
                            : "border-white/6 bg-transparent text-white/25 group-hover:text-white/40 group-hover:border-white/10"
                        }
                      `}
                      >
                        {memberGlobalIndex + 1}
                      </div>

                      <span
                        className={`
                        text-sm truncate transition-colors duration-200
                        ${isActiveMarker ? "text-white/90" : "text-white/50 group-hover:text-white/70"}
                      `}
                      >
                        {member}
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
                })}
              </AnimatePresence>

              {filteredMembers.length === 0 && query.trim() !== "" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/20 text-sm text-center py-8"
                >
                  No members match "{query}"
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
