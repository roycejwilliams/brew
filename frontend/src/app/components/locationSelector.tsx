"use client";
import React, { useState, useRef } from "react";
import { useOutsideAlerter } from "../utils/outsideAlert";

type LocationIntent = "near" | "area" | "venue";

interface LocationSelectorProps {
  selectedLocation: LocationIntent;
  onLocationChange: (location: LocationIntent) => void;
}

const locationOptions: { key: LocationIntent; label: string }[] = [
  { key: "near", label: "Near you" },
  { key: "area", label: "Choose area…" },
  { key: "venue", label: "Add venue…" },
];

export default function LocationSelector({
  selectedLocation,
  onLocationChange,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideAlerter(ref, () => setOpen(false));

  const selectedLabel =
    locationOptions.find((o) => o.key === selectedLocation)?.label ??
    "Near you";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm"
        style={{
          background: "rgba(var(--fg),0.04)",
          border: "1px solid rgba(var(--fg),0.1)",
          color: "rgba(var(--fg),0.75)",
        }}
      >
        <div className="flex flex-col items-start gap-0.5">
          <span
            className="text-[9px] uppercase tracking-widest font-medium"
            style={{ color: "rgba(var(--fg),0.3)" }}
          >
            Location
          </span>
          <span className="text-sm" style={{ color: "rgba(var(--fg),0.85)" }}>
            {selectedLabel}
          </span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
          style={{ color: "rgba(var(--fg),0.35)" }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-10"
          style={{
            background: "rgba(var(--bg-elevated),1)",
            border: "1px solid rgba(var(--fg),0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {locationOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                onLocationChange(opt.key);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between last:border-0"
              style={{
                color:
                  selectedLocation === opt.key
                    ? "rgba(var(--fg),0.9)"
                    : "rgba(var(--fg),0.5)",
                borderBottom: "1px solid rgba(var(--fg),0.05)",
                background: "transparent",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(var(--fg),0.04)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "transparent")
              }
            >
              {opt.label}
              {selectedLocation === opt.key && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{ color: "rgba(var(--fg),0.5)" }}
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
