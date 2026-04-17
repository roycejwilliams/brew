"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const mockApplications = [
  {
    id: "1",
    first_name: "Jordan",
    last_name: "Miles",
    email: "jordan@miles.com",
    phone_number: "555-000-1234",
    work_link: "https://jordanmiles.com",
    reason:
      "I want to build intentional communities and connect with like-minded people.",
    status: "pending",
    created_at: "Apr 14, 2026",
  },
  {
    id: "2",
    first_name: "Amara",
    last_name: "Chen",
    email: "amara@chen.com",
    phone_number: "555-000-5678",
    work_link: "https://amarachen.com",
    reason: "Been looking for something like this for years.",
    status: "pending",
    created_at: "Apr 13, 2026",
  },
  {
    id: "3",
    first_name: "Marcus",
    last_name: "Webb",
    email: "marcus@webb.io",
    phone_number: "555-000-9012",
    work_link: "https://marcuswebb.io",
    reason: "Community is everything to me.",
    status: "pending",
    created_at: "Apr 12, 2026",
  },
];

export default function AdminPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const getInitials = (first: string, last: string) =>
    `${first[0]}${last[0]}`.toUpperCase();

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
            { label: "Pending", value: 12, sub: "awaiting review" },
            { label: "Approved", value: 48, sub: null },
            { label: "Rejected", value: 7, sub: null },
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
        {mockApplications.map((app, i) => (
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
              onClick={() => setSelected(selected === app.id ? null : app.id)}
              className="grid grid-cols-[2.5fr_2fr_0.8fr_1.2fr] gap-3 items-center py-4 px-3 border-b border-white/6 cursor-pointer hover:bg-white/2 transition-all rounded-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center text-xs font-medium text-white/50 shrink-0">
                  {getInitials(app.first_name, app.last_name)}
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
                <span className="text-[10px] tracking-[1px] uppercase border border-amber-400/25 text-amber-400/60 px-2.5 py-1 rounded-full">
                  {app.status}
                </span>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button className="text-[11px] tracking-wide px-3.5 py-1.5 border border-white/12 rounded-md text-white/45 hover:text-white/90 hover:border-white/30 transition-all cursor-pointer">
                  Approve
                </button>
                <button className="text-[11px] tracking-wide px-3.5 py-1.5 border border-red-500/20 rounded-md text-red-400/45 hover:text-red-400/90 hover:border-red-500/40 transition-all cursor-pointer">
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
