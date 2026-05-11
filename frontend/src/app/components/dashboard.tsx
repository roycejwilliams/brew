"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faCheck,
  faMapPin,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import Feed from "./feed";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  useDeleteUserById,
  useRetriveActiveConnection,
  useUpdateUserById,
} from "@/hooks/useUser";
import { useLocationSearch } from "@/hooks/useReverseGeolocateSearch";
import Loading from "./loading";
import {
  getCompletionColor,
  profileCompletion,
} from "@/tools/profileCompletion";

interface DashboardProp {
  profile: UserProp;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07, ease: EASE },
});

function Dashboard({ profile }: DashboardProp) {
  const [revealEdit, setRevealEdit] = useState<boolean>(false);
  const { mutate: updateUserById, isPending } = useUpdateUserById();
  const { mutate: deleteUserById, isPending: isDeleting } = useDeleteUserById();

  const [updateForm, setUpdateForm] = useState<UserProp>(profile);
  const [updateStatus, setUpdateStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [query, setQuery] = useState("");
  const { suggestions, isSearching } = useLocationSearch(query);
  const [showConnections, setShowConnections] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUpdateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-white/10 text-sm rounded-md bg-white/5 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all";

  const { data: activeConnection } = useRetriveActiveConnection(
    profile.id as string,
  );

  return (
    <section className="min-h-screen bg-[#111111] relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 900,
          height: 500,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 35%, transparent 65%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto p-4 mt-4  pb-20">
        {/* Profile header */}
        <div className="flex items-start justify-between gap-8">
          {/* Left — avatar + info */}
          <div className="flex gap-6 items-start">
            {/* Avatar */}
            <motion.div {...stagger(0)} className="relative shrink-0">
              <div
                className="w-24 h-24 rounded-xl overflow-hidden relative"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src={profile.profile_image || "/profile_4.png"}
                  fill
                  priority
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Edit */}
              <button
                onClick={() => setRevealEdit(true)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M7 1L9 3L3.5 8.5L1 9L1.5 6.5L7 1Z"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {/* Online dot */}
              <div
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full"
                style={{
                  background: "#4ade80",
                  border: "2px solid #111111",
                  boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                }}
              />
            </motion.div>

            {/* Info */}
            <div className="flex flex-col gap-3 pt-1">
              <motion.div {...stagger(1)}>
                <h1
                  className="text-white font-semibold leading-none"
                  style={{ fontSize: 22, letterSpacing: "-0.5px" }}
                >
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-white/40 text-sm mt-0.5 tracking-[-0.1px]">
                  @{profile.username}
                </p>
              </motion.div>

              {/* Location */}
              <motion.div
                {...stagger(2)}
                className="flex items-center gap-1.5 text-white/30 text-xs tracking-[-0.1px]"
              >
                <FontAwesomeIcon icon={faMapPin} className="text-[16px]" />
                {profile.location}
              </motion.div>

              {/* Bio */}
              <motion.p
                {...stagger(3)}
                className="text-white/50 text-sm tracking-[-0.1px] leading-relaxed max-w-xs"
              >
                {profile.description || "Notes about me go here."}
              </motion.p>

              {/* Socials */}
              <motion.div {...stagger(4)} className="flex items-center gap-3">
                {[
                  { icon: faInstagram, href: profile.instagram || "" },
                  { icon: faXTwitter, href: profile.twitter || "" },
                  { icon: faLinkedin, href: profile.linkedin || "" },
                ].map(({ icon, href }, i) => (
                  <Link
                    key={i}
                    href={href}
                    target="_blank"
                    className="text-white/25 hover:text-white/70 transition-colors duration-200 text-base"
                  >
                    <FontAwesomeIcon icon={icon} />
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right — connections + completion */}
          <div className="flex flex-col items-end gap-4 pt-1 shrink-0">
            {/* Profile completion */}
            <motion.div
              {...stagger(1)}
              className="flex flex-col items-end gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-white/25 text-xs tracking-[-0.1px]">
                  Profile
                </span>
                <span
                  className="text-xs font-medium tracking-[-0.2px] transition-colors duration-500"
                  style={{
                    color: getCompletionColor(profileCompletion(updateForm)),
                  }}
                >
                  {profileCompletion(updateForm)}%
                </span>
                {profileCompletion(updateForm) === 100 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xs"
                    style={{ color: "rgba(250,204,21,0.9)" }}
                  >
                    ✦
                  </motion.span>
                )}
              </div>
              <div
                className="w-28 h-0.75 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <motion.div
                  className="h-full rounded-full transition-colors duration-500"
                  style={{
                    background: getCompletionColor(
                      profileCompletion(updateForm),
                    ),
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion(updateForm)}%` }}
                  transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                />
              </div>
            </motion.div>

            {/* Active connections */}
            <motion.div
              {...stagger(2)}
              onClick={() => setShowConnections(true)}
              className="flex flex-col items-end gap-2 cursor-pointer"
            >
              <span className="text-white/25 text-xs tracking-[-0.1px]">
                Active connections
              </span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[0, 1, 2, 3].map((i) => {
                    const conn = activeConnection?.data.data[i];
                    return (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full overflow-hidden relative"
                        style={{
                          background: conn
                            ? `rgba(255,255,255,${0.08 + i * 0.03})`
                            : `rgba(255,255,255,${0.05 + i * 0.03})`,
                          border: "1.5px solid #111111",
                          marginLeft: i === 0 ? 0 : -10,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        }}
                      />
                    );
                  })}
                </div>
                <span className="text-white/40 text-sm font-medium tracking-[-0.2px]">
                  {
                    new Set(
                      activeConnection?.data.data.map(
                        (c: { id: string; [key: string]: unknown }) => c.id,
                      ),
                    ).size
                  }{" "}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45, ease: EASE }}
        >
          <Feed
            completed={profileCompletion(updateForm)}
            userId={profile.id as string}
          />
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {revealEdit && (
          <motion.section
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-screen absolute top-0 left-0 bg-black/70 backdrop-blur-2xl z-50 flex justify-center items-center"
          >
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md px-8 py-8"
            >
              <p className="text-xs tracking-[4px] uppercase text-white/20 mb-1">
                BR3W
              </p>
              <h2 className="text-xl font-light tracking-tight mb-1">
                Manage Profile.
              </h2>
              <p className="text-xs text-white/30 mb-6">
                Update your information.
              </p>

              <div className="border-t border-white/8 mb-6" />

              <div className="flex gap-x-2">
                <input
                  name="first_name"
                  type="text"
                  value={updateForm.first_name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="First name"
                />
                <input
                  name="last_name"
                  type="text"
                  value={updateForm.last_name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Last name"
                />
              </div>

              <div className="flex flex-col gap-y-2 mt-2">
                <input
                  name="email"
                  type="email"
                  value={updateForm.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Email"
                />
                <input
                  name="phone_number"
                  type="text"
                  value={updateForm.phone_number}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Phone number"
                />
                <div className="relative">
                  <input
                    name="location"
                    type="text"
                    value={query || updateForm.location || ""}
                    onChange={(e) => setQuery(e.target.value)}
                    className={inputClass}
                    placeholder="Location"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loading />
                    </div>
                  )}
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-1 border border-white/10 rounded-md bg-[#111] overflow-hidden z-10"
                    >
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setUpdateForm((prev) => ({
                              ...prev,
                              location: suggestion.label,
                            }));
                          }}
                          className="w-full text-left px-3 py-2.5 text-xs text-white/50 hover:bg-white/5 hover:text-white/80 transition-all border-b border-white/5 last:border-none cursor-pointer"
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
                <textarea
                  name="description"
                  value={updateForm.description || ""}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us more"
                />
                {[
                  {
                    name: "instagram",
                    icon: faInstagram,
                    placeholder: "",
                  },
                  {
                    name: "twitter",
                    icon: faXTwitter,
                    placeholder: "",
                  },
                  {
                    name: "linkedin",
                    icon: faLinkedin,
                    placeholder: "",
                  },
                ].map(({ name, icon, placeholder }) => (
                  <div key={name} className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs">
                      <FontAwesomeIcon icon={icon} />
                    </div>
                    <input
                      name={name}
                      type="text"
                      value={
                        (updateForm as unknown as Record<string, string>)[
                          name
                        ] || ""
                      }
                      onChange={handleChange}
                      className={`${inputClass} pl-8`}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="border-t border-white/8 my-5" />

              <div className="flex flex-col gap-y-2">
                <button
                  type="button"
                  onClick={() => {
                    updateUserById(
                      {
                        id: updateForm.id as string,
                        first_name: updateForm.first_name,
                        last_name: updateForm.last_name,
                        email: updateForm.email,
                        description: updateForm.description,
                        username: updateForm.username,
                        location: updateForm.location,
                        instagram: updateForm.instagram,
                        twitter: updateForm.twitter,
                        linkedin: updateForm.linkedin,
                      },
                      {
                        onSuccess: () => {
                          setUpdateStatus("success");
                          setTimeout(() => setRevealEdit(false), 1000);
                        },
                        onError: () => setUpdateStatus("error"),
                      },
                    );
                  }}
                  disabled={isPending}
                  className="w-full flex justify-between items-center px-4 py-2.5 border border-white/10 rounded-md hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer text-sm text-white/50 hover:text-white group disabled:opacity-40"
                >
                  <span>Save changes</span>
                  {isPending && (
                    <FontAwesomeIcon
                      icon={faArrowRotateRight}
                      size="xs"
                      className="animate-spin"
                    />
                  )}
                  {!isPending && updateStatus === "success" && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      size="xs"
                      className="text-green-400/70"
                    />
                  )}
                  {!isPending && updateStatus === "error" && (
                    <FontAwesomeIcon
                      icon={faXmark}
                      size="xs"
                      className="text-red-400/70"
                    />
                  )}
                  {!isPending && updateStatus === "idle" && (
                    <FontAwesomeIcon
                      icon={faArrowRotateRight}
                      size="xs"
                      className="group-hover:rotate-180 transition-transform duration-300"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    deleteUserById(
                      { id: profile.id || "" },
                      {
                        onSuccess: () => setDeleteStatus("success"),
                        onError: () => setDeleteStatus("error"),
                      },
                    )
                  }
                  disabled={isDeleting}
                  className="w-full flex justify-between items-center px-4 py-2.5 border border-red-500/10 rounded-md hover:bg-red-500/5 hover:border-red-500/20 transition-all cursor-pointer text-sm text-red-400/40 hover:text-red-400/70 group disabled:opacity-40"
                >
                  <span>Delete account</span>
                  {isDeleting && (
                    <FontAwesomeIcon
                      icon={faArrowRotateRight}
                      size="xs"
                      className="animate-spin"
                    />
                  )}
                  {!isDeleting && deleteStatus === "success" && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      size="xs"
                      className="text-green-400/70"
                    />
                  )}
                  {!isDeleting && deleteStatus === "error" && (
                    <FontAwesomeIcon
                      icon={faXmark}
                      size="xs"
                      className="text-red-400/70"
                    />
                  )}
                  {!isDeleting && deleteStatus === "idle" && (
                    <FontAwesomeIcon icon={faTrash} size="xs" />
                  )}
                </button>
              </div>

              <button
                onClick={() => setRevealEdit(false)}
                className="mt-4 w-full text-center text-xs text-white/20 hover:text-white/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Active Connection Modal */}
      <AnimatePresence>
        {showConnections && (
          <motion.section
            key="connections-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-screen absolute top-0 left-0 bg-black/70 backdrop-blur-2xl z-50 flex justify-center items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md px-8 py-8"
            >
              <p className="text-xs tracking-[4px] uppercase text-white/20 mb-1">
                br3w
              </p>
              <h2 className="text-xl font-light tracking-tight mb-1">
                Connections.
              </h2>
              <p className="text-xs text-white/30 mb-6">
                People in your circles.
              </p>

              <div className="border-t border-white/8 mb-6" />

              {activeConnection?.data.data.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {Object.entries(
                    activeConnection?.data.data.reduce(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (acc: any, conn: any) => {
                        if (!acc[conn.id]) {
                          acc[conn.id] = { ...conn, circles: [] };
                        }
                        acc[conn.id].circles.push(conn.circle_name);
                        return acc;
                      },
                      {},
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ).map(([, member]: [string, any]) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 px-3 py-2.5 border border-white/8 rounded-md bg-white/3 hover:bg-white/5 transition-all"
                    >
                      <div
                        className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-xs text-white/50 font-medium"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {member.profile_image ? (
                          <Image
                            src={member.profile_image}
                            alt={member.username}
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          `${member.first_name[0]}${member.last_name[0]}`
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/70">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-xs text-white/30">
                          @{member.username}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {member.circles.map((circle: string, i: number) => (
                          <span
                            key={i}
                            className="text-[9px] tracking-[1px] uppercase text-white/20 border border-white/8 px-2 py-0.5 rounded-full"
                          >
                            {circle}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/25 text-center py-8">
                  No connections yet. Join a circle to connect.
                </p>
              )}

              <button
                onClick={() => setShowConnections(false)}
                className="mt-6 w-full text-center text-xs text-white/20 hover:text-white/40 transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Dashboard;
