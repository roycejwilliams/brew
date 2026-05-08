"use client";
import Loading from "@/app/components/loading";
import {
  useGetAllApplications,
  useUpdateApplicationStatus,
} from "@/hooks/useApplications";
import { useUserStore } from "@/stores/useUserStore";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export default function AdminPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const getInitials = (first: string, last: string) =>
    `${first[0]}${last[0]}`.toUpperCase();

  const { isPending, data } = useGetAllApplications();
  const { mutate: updateApp } = useUpdateApplicationStatus();

  const allApps: ApplicationProp[] = data?.data.data || [];

  const { user } = useUserStore();
  console.log(user);

  if (isPending) {
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loading />
      </section>
    );
  }

  console.log(user?.role);

  if (user?.role !== "admin") {
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6 text-center max-w-sm"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15v-4m0-4h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] tracking-[4px] uppercase text-white/20">
              br3w
            </p>
            <h1 className="text-xl font-light tracking-tight text-white/80">
              Access restricted.
            </h1>
            <p className="text-sm text-white/30 leading-relaxed">
              This area is for BR3W administrators only. If you think this is a
              mistake, reach out.
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white px-10 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8"
        >
          <p className="text-xs tracking-[4px] uppercase text-white/20 mb-1.5">
            br3w
          </p>
          <h1 className="text-3xl font-light tracking-tight mb-2">
            Applications
          </h1>
          <p className="text-sm text-white/35">
            Review and manage access requests
          </p>
        </motion.div>

        <div className="border-t border-white/8 mb-8" />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-3 gap-3 mb-12"
        >
          {[
            {
              label: "Pending",
              value: allApps.filter((a) => a.status === "pending").length,
              sub: "awaiting review",
            },
            {
              label: "Approved",
              value: allApps.filter((a) => a.status === "accepted").length,
              sub: "accepted user",
            },
            {
              label: "Rejected",
              value: allApps.filter((a) => a.status === "rejected").length,
              sub: "rejected user",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-white/8 rounded-lg p-5"
            >
              <p className="text-xs tracking-[2px] uppercase text-white/25 mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-light tracking-tight">
                {stat.value}
                {stat.sub && (
                  <span className="text-xs text-white/25 font-normal ml-2 tracking-normal">
                    {stat.sub}
                  </span>
                )}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Table Header */}
        <div className="grid grid-cols-[2.5fr_2fr_0.8fr_1.2fr] gap-3 px-3 pb-3 border-b border-white/8 mb-1">
          {["Applicant", "Contact", "Status", "Actions"].map((h) => (
            <p
              key={h}
              className="text-[10px] tracking-[3px] uppercase text-white/20"
            >
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        {allApps.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.15 + i * 0.05,
              ease: "easeOut",
            }}
          >
            <div
              onClick={() => setSelected(selected === app.id! ? null : app.id!)}
              className="grid grid-cols-[2.5fr_2fr_0.8fr_1.2fr] gap-3 items-center py-4 px-3 border-b border-white/6 cursor-pointer hover:bg-white/2 transition-all rounded-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center text-xs font-medium text-white/50 shrink-0">
                  {getInitials(app.first_name!, app.last_name!)}
                </div>
                <div>
                  <p className="text-sm text-white/85">
                    {app.first_name} {app.last_name}
                  </p>
                  <p className="text-[11px] text-white/25 mt-0.5">
                    {app.created_at}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-white/50">{app.email}</p>
                <p className="text-[11px] text-white/25 mt-0.5">
                  {app.phone_number}
                </p>
              </div>
              <div>
                <span
                  className={`text-[10px] tracking-[1px] uppercase border px-2.5 py-1 rounded-full ${
                    app.status === "pending"
                      ? "border-amber-400/25 text-amber-400/60"
                      : app.status === "accepted"
                        ? "border-green-400/25 text-green-400/60"
                        : "border-red-400/25 text-red-400/60"
                  }`}
                >
                  {app.status}
                </span>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => updateApp({ id: app.id!, status: "accepted" })}
                  className="text-[11px] tracking-wide px-3.5 py-1.5 border border-white/12 rounded-md text-white/45 hover:text-white/90 hover:border-white/30 transition-all cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateApp({ id: app.id!, status: "rejected" })}
                  className="text-[11px] tracking-wide px-3.5 py-1.5 border border-red-500/20 rounded-md text-red-400/45 hover:text-red-400/90 hover:border-red-500/40 transition-all cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Expanded Detail */}
            <AnimatePresence>
              {selected === app.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-6 px-3 py-5 border-b border-white/6">
                    <div>
                      <p className="text-[10px] tracking-[3px] uppercase text-white/20 mb-1.5">
                        Reason
                      </p>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {app.reason}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[3px] uppercase text-white/20 mb-1.5">
                        Work
                      </p>
                      <a
                        href={app.work_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-white/50 hover:text-white/85 underline underline-offset-3 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {app.work_link.replace("https://", "")}
                      </a>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[3px] uppercase text-white/20 mb-1.5">
                        Referred by
                      </p>
                      <p className="text-sm text-white/50">
                        Direct application
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
