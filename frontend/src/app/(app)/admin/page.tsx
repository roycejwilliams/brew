"use client";
import Loading from "@/app/components/loading";
import {
  useGetAllApplications,
  useUpdateApplicationStatus,
} from "@/hooks/useApplications";
import { useUserStore } from "@/stores/useUserStore";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number, base = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: base + i * 0.06, ease: EASE },
});

export default function AdminPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const getInitials = (first: string, last: string) =>
    `${first[0]}${last[0]}`.toUpperCase();

  const { isPending, data } = useGetAllApplications();
  const { mutate: updateApp } = useUpdateApplicationStatus();
  const allApps: ApplicationProp[] = data?.data.data || [];
  const { user } = useUserStore();

  if (isPending) {
    return (
      <section className="min-h-dvh bg-[#f5f5f5] dark:bg-[#0c0c0c] text-black dark:text-white flex items-center justify-center">
        <Loading />
      </section>
    );
  }

  if (user?.role !== "admin") {
    return (
      <section className="min-h-dvh overflow-hidden bg-[#f5f5f5] dark:bg-[#0c0c0c] text-black dark:text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col items-center gap-6 text-center max-w-sm"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              border: `1px solid rgba(var(--fg),0.07)`,
              background: `rgba(var(--fg),0.03)`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15v-4m0-4h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                stroke={`rgba(var(--fg),0.2)`}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[4px] uppercase text-black/20 dark:text-white/20 font-medium">
              br3w
            </p>
            <h1 className="text-lg font-medium tracking-[-0.3px] text-black/80 dark:text-white/80">
              Access restricted.
            </h1>
            <p className="text-sm text-black/30 dark:text-white/30 leading-relaxed tracking-[-0.1px]">
              This area is for BR3W administrators only. If you think this is a
              mistake, reach out.
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  const stats = [
    {
      label: "Pending",
      value: allApps.filter((a) => a.status === "pending").length,
      sub: "awaiting review",
      color: "rgba(251,191,36,0.7)",
    },
    {
      label: "Approved",
      value: allApps.filter((a) => a.status === "accepted").length,
      sub: "accepted",
      color: "rgba(74,222,128,0.7)",
    },
    {
      label: "Rejected",
      value: allApps.filter((a) => a.status === "rejected").length,
      sub: "rejected",
      color: "rgba(248,113,113,0.7)",
    },
  ];

  return (
    <section className="min-h-dvh bg-[#f5f5f5] dark:bg-[#0c0c0c] text-black dark:text-white px-4 sm:px-8 lg:px-12 py-10 pb-24">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 700,
          height: 400,
          background: `radial-gradient(ellipse at 50% 0%, rgba(var(--fg),0.04) 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div {...stagger(0)} className="mb-8">
          <p className="text-[10px] tracking-[4px] uppercase text-black/20 dark:text-white/20 font-medium mb-1.5">
            br3w
          </p>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.6px] mb-1.5">
            Applications
          </h1>
          <p className="text-sm text-black/30 dark:text-white/30 tracking-[-0.1px]">
            Review and manage access requests
          </p>
        </motion.div>

        <div
          className="mb-8"
          style={{ height: 1, background: `rgba(var(--fg),0.06)` }}
        />

        {/* Stats */}
        <motion.div {...stagger(1)} className="grid grid-cols-3 gap-3 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 sm:p-5 flex flex-col gap-2"
              style={{
                background: `rgba(var(--fg),0.02)`,
                border: `1px solid rgba(var(--fg),0.06)`,
              }}
            >
              <p className="text-[10px] tracking-[2px] uppercase text-black/20 dark:text-white/20 font-medium">
                {stat.label}
              </p>
              <div className="flex items-end gap-2 flex-wrap">
                <span
                  className="text-2xl sm:text-3xl font-medium tracking-[-0.5px]"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <span className="text-[10px] text-black/20 dark:text-white/20 tracking-[-0.1px] mb-1 hidden sm:block">
                  {stat.sub}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Desktop table header */}
        <div
          className="hidden md:grid grid-cols-[2.5fr_2fr_0.8fr_1.2fr] gap-3 px-3 pb-3 mb-1"
          style={{ borderBottom: `1px solid rgba(var(--fg),0.06)` }}
        >
          {["Applicant", "Contact", "Status", "Actions"].map((h) => (
            <p
              key={h}
              className="text-[10px] tracking-[3px] uppercase text-black/20 dark:text-white/20 font-medium"
            >
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-0">
          {allApps.map((app, i) => (
            <motion.div key={app.id} {...stagger(i, 0.15)}>
              {/* Desktop row */}
              <div
                onClick={() =>
                  setSelected(selected === app.id! ? null : app.id!)
                }
                className="hidden md:grid grid-cols-[2.5fr_2fr_0.8fr_1.2fr] gap-3 items-center py-4 px-3 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all rounded-sm"
                style={{ borderBottom: `1px solid rgba(var(--fg),0.05)` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium text-black/40 dark:text-white/40 shrink-0"
                    style={{
                      background: `rgba(var(--fg),0.05)`,
                      border: `1px solid rgba(var(--fg),0.08)`,
                    }}
                  >
                    {getInitials(app.first_name!, app.last_name!)}
                  </div>
                  <div>
                    <p className="text-sm text-black/80 dark:text-white/80 tracking-[-0.1px]">
                      {app.first_name} {app.last_name}
                    </p>
                    <p className="text-[11px] text-black/25 dark:text-white/25 mt-0.5 tracking-[-0.1px]">
                      {app.created_at}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-black/45 dark:text-white/45 tracking-[-0.1px]">
                    {app.email}
                  </p>
                  <p className="text-[11px] text-black/25 dark:text-white/25 mt-0.5">
                    {app.phone_number}
                  </p>
                </div>
                <div>
                  <StatusBadge status={app.status!} />
                </div>
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionButtons app={app} updateApp={updateApp} />
                </div>
              </div>

              {/* Mobile card */}
              <div
                className="md:hidden flex flex-col gap-3 py-4"
                style={{ borderBottom: `1px solid rgba(var(--fg),0.05)` }}
              >
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() =>
                    setSelected(selected === app.id! ? null : app.id!)
                  }
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium text-black/40 dark:text-white/40 shrink-0"
                    style={{
                      background: `rgba(var(--fg),0.05)`,
                      border: `1px solid rgba(var(--fg),0.08)`,
                    }}
                  >
                    {getInitials(app.first_name!, app.last_name!)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-black/80 dark:text-white/80 tracking-[-0.1px]">
                      {app.first_name} {app.last_name}
                    </p>
                    <p className="text-[11px] text-black/30 dark:text-white/30 mt-0.5 truncate">
                      {app.email}
                    </p>
                  </div>
                  <StatusBadge status={app.status!} />
                </div>
                <div className="flex gap-2 pl-13">
                  <ActionButtons app={app} updateApp={updateApp} />
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {selected === app.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div
                      className="grid grid-cols-1 sm:grid-cols-3 gap-5 px-3 py-5"
                      style={{
                        borderBottom: `1px solid rgba(var(--fg),0.05)`,
                        background: `rgba(var(--fg),0.015)`,
                      }}
                    >
                      <div>
                        <p className="text-[10px] tracking-[3px] uppercase text-black/20 dark:text-white/20 font-medium mb-2">
                          Reason
                        </p>
                        <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed tracking-[-0.1px]">
                          {app.reason}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[3px] uppercase text-black/20 dark:text-white/20 font-medium mb-2">
                          Work
                        </p>
                        <a
                          href={app.work_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-black/45 dark:text-white/45 hover:text-black/80 dark:hover:text-white/80 underline underline-offset-2 transition-colors tracking-[-0.1px] break-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {app.work_link?.replace("https://", "")}
                        </a>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[3px] uppercase text-black/20 dark:text-white/20 font-medium mb-2">
                          Referred by
                        </p>
                        <p className="text-sm text-black/45 dark:text-white/45 tracking-[-0.1px]">
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

        {allApps.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `rgba(var(--fg),0.03)`,
                border: `1px solid rgba(var(--fg),0.06)`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: `rgba(var(--fg),0.2)` }}
              />
            </div>
            <p className="text-sm text-black/25 dark:text-white/25 tracking-[-0.1px]">
              No applications yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "border-amber-400/20 text-amber-400/55",
    accepted: "border-green-400/20 text-green-400/55",
    rejected: "border-red-400/20 text-red-400/55",
  };
  return (
    <span
      className={`text-[10px] tracking-[1px] uppercase border px-2.5 py-1 rounded-full font-medium ${styles[status] ?? "border-black/10 dark:border-white/10 text-black/30 dark:text-white/30"}`}
    >
      {status}
    </span>
  );
}

function ActionButtons({
  app,
  updateApp,
}: {
  app: ApplicationProp;
  updateApp: (args: { id: string; status: string }) => void;
}) {
  return (
    <>
      <button
        onClick={() => updateApp({ id: app.id!, status: "accepted" })}
        className="flex-1 md:flex-none text-[11px] tracking-[-0.1px] px-3.5 py-1.5 rounded-md text-black/40 dark:text-white/40 hover:text-black/85 dark:hover:text-white/85 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
        style={{ border: `1px solid rgba(var(--fg),0.09)` }}
      >
        Approve
      </button>
      <button
        onClick={() => updateApp({ id: app.id!, status: "rejected" })}
        className="flex-1 md:flex-none text-[11px] tracking-[-0.1px] px-3.5 py-1.5 rounded-md text-red-400/40 hover:text-red-400/80 hover:bg-red-500/5 transition-all cursor-pointer"
        style={{ border: "1px solid rgba(239,68,68,0.12)" }}
      >
        Reject
      </button>
    </>
  );
}
