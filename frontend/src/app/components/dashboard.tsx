"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faCheck,
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
import CreateModal from "./CreateModal";
import {
  getCompletionColor,
  profileCompletion,
} from "@/tools/profileCompletion";
import { supabase } from "@/lib/supabase";

interface DashboardProp {
  profile: UserProp;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, delay: i * 0.06, ease: EASE },
});

const inputClass =
  "w-full px-3 py-2.5 border text-sm rounded-xl bg-black/4 dark:bg-white/4 text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:outline-none focus:bg-black/6 dark:focus:bg-white/6 transition-colors duration-150 tracking-[-0.1px]";

function Dashboard({ profile }: DashboardProp) {
  const [revealEdit, setRevealEdit] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
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
  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUpdateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { data: activeConnection } = useRetriveActiveConnection(
    profile.id as string,
  );

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //photo user select from their device
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);

    // Preview immediately — base64
    //reads files locally, no network involved
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setUpdateForm((prev) => ({
          ...prev,
          profile_image: ev.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);

    // Upload to Supabase storage
    try {
      const ext = file.name.split(".").pop();
      const fileName = `avatars/${profile.id}-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("brew-image")
        //fileName is a labled path
        //file is the actual photo.
        // so basicaly its just giving a fileName to the photo
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      //uses the fileName to get the photo
      const { data: urlData } = supabase.storage
        .from("brew-image")
        .getPublicUrl(fileName);

      // Persist to user record
      updateUserById({
        ...updateForm,
        id: profile.id as string,
        profile_image: urlData.publicUrl,
      });

      setUpdateForm((prev) => ({
        ...prev,
        profile_image: urlData.publicUrl,
      }));
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <section className="min-h-dvh overflow-x-hidden bg-[#f5f5f5] dark:bg-[#0c0c0c] relative flex flex-col">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 900,
          height: 500,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(var(--fg),0.05) 0%, rgba(var(--fg),0.02) 35%, transparent 65%)",
        }}
      />

      <div className="relative max-w-4xl w-full mx-auto px-4 sm:px-6 pt-20 sm:pt-6 pb-6 flex flex-col flex-1">
        {/* Profile header */}
        <div className="flex items-start justify-between gap-4 sm:gap-8">
          {/* Left — avatar + info */}
          <div className="flex gap-4 sm:gap-6 items-start">
            {/* Avatar */}
            <motion.div {...stagger(0)} className="relative shrink-0">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden relative group"
                style={{
                  border: "1px solid rgba(var(--fg),0.08)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                }}
              >
                <Image
                  src={updateForm.profile_image || "/profile_4.png"}
                  fill
                  priority
                  alt="Profile"
                  className="object-cover"
                />

                {/* Upload overlay */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                  style={{ background: "rgba(0,0,0,0.55)" }}
                >
                  {avatarUploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 rounded-full border-2"
                      style={{
                        borderColor: "rgba(var(--fg),0.15)",
                        borderTopColor: "rgba(var(--fg),0.7)",
                      }}
                    />
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(var(--fg),0.85)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              {/* Edit button */}
              <button
                onClick={() => setRevealEdit(true)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150"
                style={{
                  background: "rgba(var(--fg),0.08)",
                  border: "1px solid rgba(var(--fg),0.12)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M7 1L9 3L3.5 8.5L1 9L1.5 6.5L7 1Z"
                    stroke="rgba(var(--fg),0.55)"
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
                  border: `2px solid rgb(var(--bg))`,
                  boxShadow: "0 0 8px rgba(74,222,128,0.4)",
                }}
              />
            </motion.div>

            {/* Info */}
            <div className="flex flex-col gap-2.5 pt-1 min-w-0">
              <motion.div {...stagger(1)}>
                <h1
                  className="text-black dark:text-white font-medium leading-none truncate"
                  style={{ fontSize: 18, letterSpacing: "-0.5px" }}
                >
                  {profile.first_name} {profile.last_name}
                </h1>
                <p
                  className="text-sm mt-0.5 tracking-[-0.1px]"
                  style={{ color: "rgba(var(--fg),0.35)" }}
                >
                  @{profile.username}
                </p>
              </motion.div>

              {/* Location */}
              <motion.div
                {...stagger(2)}
                className="flex items-center gap-1.5 text-xs tracking-[-0.1px]"
                style={{ color: "rgba(var(--fg),0.28)" }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {profile.location}
              </motion.div>

              {/* Bio — desktop */}
              <motion.p
                {...stagger(3)}
                className="text-sm tracking-[-0.1px] leading-relaxed max-w-60 sm:max-w-xs hidden sm:block"
                style={{ color: "rgba(var(--fg),0.4)" }}
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
                    className="transition-colors duration-150 text-sm"
                    style={{ color: "rgba(var(--fg),0.2)" }}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right — stats */}
          <div className="flex flex-col items-end gap-4 pt-1 shrink-0">
            {/* Profile completion */}
            <motion.div
              {...stagger(1)}
              className="flex flex-col items-end gap-1.5"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs tracking-[-0.1px]"
                  style={{ color: "rgba(var(--fg),0.22)" }}
                >
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
                    transition={{ duration: 0.3, ease: EASE }}
                    style={{ color: "rgba(250,204,21,0.9)", fontSize: 10 }}
                  >
                    ✦
                  </motion.span>
                )}
              </div>
              <div
                className="w-20 sm:w-24 rounded-full overflow-hidden"
                style={{ height: 2, background: "rgba(var(--fg),0.07)" }}
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
              className="flex flex-col items-end gap-1.5 cursor-pointer"
            >
              <span
                className="text-xs tracking-[-0.1px]"
                style={{ color: "rgba(var(--fg),0.22)" }}
              >
                Connections
              </span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[0, 1, 2, 3].map((i) => {
                    const conn = activeConnection?.data.data[i];
                    return (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full overflow-hidden relative"
                        style={{
                          background: conn
                            ? `rgba(var(--fg),${0.08 + i * 0.03})`
                            : `rgba(var(--fg),${0.04 + i * 0.02})`,
                          border: `1.5px solid rgb(var(--bg))`,
                          marginLeft: i === 0 ? 0 : -8,
                        }}
                      />
                    );
                  })}
                </div>
                <span
                  className="text-xs font-medium tracking-[-0.2px]"
                  style={{ color: "rgba(var(--fg),0.35)" }}
                >
                  {
                    new Set(
                      activeConnection?.data.data.map(
                        (c: { id: string }) => c.id,
                      ),
                    ).size
                  }
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bio — mobile only */}
        <motion.p
          {...stagger(3)}
          className="text-sm tracking-[-0.1px] leading-relaxed mt-4 sm:hidden"
          style={{ color: "rgba(var(--fg),0.4)" }}
        >
          {profile.description || "Notes about me go here."}
        </motion.p>

        {/* Divider */}
        <div
          className="my-6"
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(var(--fg),0.06), transparent)`,
          }}
        />

        {/* Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3, ease: EASE }}
          className="flex flex-col flex-1"
        >
          <Feed
            completed={profileCompletion(updateForm)}
            userId={profile.id as string}
            onCreateMoment={() => setShowCreateModal(true)}
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
            transition={{ duration: 0.2 }}
            className="w-full h-screen fixed top-0 left-0 z-50 flex justify-center items-start sm:items-center overflow-y-auto"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(20px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md px-5 sm:px-8 py-8 my-8 rounded-2xl"
              style={{
                background: "rgba(var(--bg),0.97)",
                border: "1px solid rgba(var(--fg),0.08)",
                backdropFilter: "blur(24px)",
              }}
            >
              <p
                className="text-[10px] tracking-[4px] uppercase font-medium mb-1"
                style={{ color: "rgba(var(--fg),0.2)" }}
              >
                BR3W
              </p>
              <h2 className="text-xl font-medium tracking-[-0.4px] mb-1" style={{ color: "rgba(var(--fg),0.9)" }}>
                Manage Profile.
              </h2>
              <p
                className="text-xs tracking-[-0.1px] mb-6"
                style={{ color: "rgba(var(--fg),0.3)" }}
              >
                Update your information.
              </p>

              <div
                style={{
                  height: 1,
                  background: "rgba(var(--fg),0.07)",
                  marginBottom: 20,
                }}
              />

              {/* Avatar picker inside modal */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="relative w-16 h-16 rounded-xl overflow-hidden group shrink-0"
                  style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                >
                  <Image
                    src={updateForm.profile_image || "/profile_4.png"}
                    fill
                    alt="Profile"
                    className="object-cover"
                  />
                  <label
                    htmlFor="avatar-upload-modal"
                    className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(0,0,0,0.55)" }}
                  >
                    {avatarUploading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 rounded-full border-2"
                        style={{
                          borderColor: "rgba(var(--fg),0.15)",
                          borderTopColor: "rgba(var(--fg),0.7)",
                        }}
                      />
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(var(--fg),0.85)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    )}
                  </label>
                  <input
                    id="avatar-upload-modal"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
                <div>
                  <p
                    className="text-sm font-medium tracking-[-0.1px]"
                    style={{ color: "rgba(var(--fg),0.7)" }}
                  >
                    {profile.first_name} {profile.last_name}
                  </p>
                  <label
                    htmlFor="avatar-upload-modal"
                    className="text-[11px] tracking-[-0.1px] cursor-pointer transition-colors duration-150"
                    style={{ color: "rgba(var(--fg),0.3)" }}
                  >
                    {avatarUploading ? "Uploading..." : "Change photo"}
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* Name row */}
                <div className="flex gap-2">
                  <input
                    name="first_name"
                    type="text"
                    value={updateForm.first_name}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                    placeholder="First name"
                  />
                  <input
                    name="last_name"
                    type="text"
                    value={updateForm.last_name}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                    placeholder="Last name"
                  />
                </div>

                <input
                  name="email"
                  type="email"
                  value={updateForm.email}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                  placeholder="Email"
                />
                <input
                  name="phone_number"
                  type="text"
                  value={updateForm.phone_number}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                  placeholder="Phone number"
                />

                {/* Location with suggestions */}
                <div className="relative">
                  <input
                    name="location"
                    type="text"
                    value={query || updateForm.location || ""}
                    onChange={(e) => setQuery(e.target.value)}
                    className={inputClass}
                    style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                    placeholder="Location"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loading />
                    </div>
                  )}
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-10"
                      style={{
                        border: "1px solid rgba(var(--fg),0.08)",
                        background: `rgba(var(--bg),0.98)`,
                        backdropFilter: "blur(16px)",
                      }}
                    >
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={suggestion.mapbox_id ?? i}
                          type="button"
                          onClick={() => {
                            setUpdateForm((prev) => ({
                              ...prev,
                              location: suggestion.label,
                            }));
                            setQuery("");
                          }}
                          className="w-full text-left px-3 py-2.5 text-xs tracking-[-0.1px] transition-colors duration-150 cursor-pointer"
                          style={{
                            color: "rgba(var(--fg),0.5)",
                            borderBottom:
                              i < suggestions.length - 1
                                ? "1px solid rgba(var(--fg),0.05)"
                                : "none",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(var(--fg),0.04)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
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
                  style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                  placeholder="Tell us more"
                />

                {/* Social links */}
                {[
                  { name: "instagram", icon: faInstagram },
                  { name: "twitter", icon: faXTwitter },
                  { name: "linkedin", icon: faLinkedin },
                ].map(({ name, icon }) => (
                  <div key={name} className="relative">
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                      style={{ color: "rgba(var(--fg),0.2)" }}
                    >
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
                      style={{ border: "1px solid rgba(var(--fg),0.08)" }}
                      placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  height: 1,
                  background: "rgba(var(--fg),0.07)",
                  margin: "20px 0",
                }}
              />

              <div className="flex flex-col gap-2">
                {/* Save */}
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
                        profile_image: updateForm.profile_image,
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
                  className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer text-sm font-medium tracking-[-0.1px] disabled:opacity-40"
                  style={{
                    border: "1px solid rgba(var(--fg),0.09)",
                    background: "rgba(var(--fg),0.04)",
                    color: "rgba(var(--fg),0.6)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(var(--fg),0.07)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(var(--fg),0.04)")
                  }
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
                    <span
                      style={{ color: "rgba(var(--fg),0.25)", fontSize: 12 }}
                    >
                      →
                    </span>
                  )}
                </button>

                {/* Delete */}
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
                  className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer text-sm font-medium tracking-[-0.1px] disabled:opacity-40"
                  style={{
                    border: "1px solid rgba(239,68,68,0.1)",
                    background: "transparent",
                    color: "rgba(248,113,113,0.4)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(239,68,68,0.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
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
                className="mt-4 w-full text-center text-xs tracking-[-0.1px] transition-colors duration-150 cursor-pointer"
                style={{ color: "rgba(var(--fg),0.2)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(var(--fg),0.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(var(--fg),0.2)")
                }
              >
                Cancel
              </button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Create Moment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateModal onClose={() => setShowCreateModal(false)} />
        )}
      </AnimatePresence>

      {/* Connections Modal */}
      <AnimatePresence>
        {showConnections && (
          <motion.section
            key="connections-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-screen fixed top-0 left-0 z-50 flex justify-center items-start sm:items-center overflow-y-auto"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(20px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md px-5 sm:px-8 py-8 my-8 rounded-2xl"
              style={{
                background: "rgba(var(--bg),0.97)",
                border: "1px solid rgba(var(--fg),0.08)",
                backdropFilter: "blur(24px)",
              }}
            >
              <p
                className="text-[10px] tracking-[4px] uppercase font-medium mb-1"
                style={{ color: "rgba(var(--fg),0.2)" }}
              >
                BR3W
              </p>
              <h2 className="text-xl font-medium tracking-[-0.4px] mb-1" style={{ color: "rgba(var(--fg),0.9)" }}>
                Connections.
              </h2>
              <p
                className="text-xs tracking-[-0.1px] mb-6"
                style={{ color: "rgba(var(--fg),0.3)" }}
              >
                People in your circles.
              </p>

              <div
                style={{
                  height: 1,
                  background: "rgba(var(--fg),0.07)",
                  marginBottom: 20,
                }}
              />

              {activeConnection?.data.data.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {Object.entries(
                    activeConnection?.data.data.reduce(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (acc: any, conn: any) => {
                        if (!acc[conn.id])
                          acc[conn.id] = { ...conn, circles: [] };
                        acc[conn.id].circles.push(conn.circle_name);
                        return acc;
                      },
                      {},
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ).map(([, member]: [string, any]) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{
                        border: "1px solid rgba(var(--fg),0.07)",
                        background: "rgba(var(--fg),0.02)",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-xs font-medium relative"
                        style={{
                          background: "rgba(var(--fg),0.07)",
                          border: "1px solid rgba(var(--fg),0.09)",
                          color: "rgba(var(--fg),0.45)",
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
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium tracking-[-0.1px] truncate"
                          style={{ color: "rgba(var(--fg),0.75)" }}
                        >
                          {member.first_name} {member.last_name}
                        </p>
                        <p
                          className="text-[11px] tracking-[-0.1px]"
                          style={{ color: "rgba(var(--fg),0.3)" }}
                        >
                          @{member.username}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {member.circles.map((circle: string, i: number) => (
                          <span
                            key={i}
                            className="text-[9px] tracking-[1px] uppercase px-2 py-0.5 rounded-full"
                            style={{
                              color: "rgba(var(--fg),0.2)",
                              border: "1px solid rgba(var(--fg),0.07)",
                            }}
                          >
                            {circle}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className="text-sm text-center py-8 tracking-[-0.1px]"
                  style={{ color: "rgba(var(--fg),0.22)" }}
                >
                  No connections yet. Join a circle to connect.
                </p>
              )}

              <button
                onClick={() => setShowConnections(false)}
                className="mt-6 w-full text-center text-xs tracking-[-0.1px] transition-colors duration-150 cursor-pointer"
                style={{ color: "rgba(var(--fg),0.2)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(var(--fg),0.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(var(--fg),0.2)")
                }
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
