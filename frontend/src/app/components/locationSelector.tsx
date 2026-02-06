import React, { useState } from "react";
import { Select, SelectItem } from "@heroui/react";

type LocationIntent = "near" | "area" | "venue";

interface LocationSelectorProps {
  selectedLocation: LocationIntent;
  onLocationChange: (location: LocationIntent) => void;
}

export default function LocationSelector({
  selectedLocation,
  onLocationChange,
}: LocationSelectorProps) {
  const locationOptions = [
    { key: "near", label: "Near you" },
    { key: "area", label: "Choose area…" },
    { key: "venue", label: "Add venue…" },
  ];

  return (
    <Select
      classNames={{
        label: "mb-4",
        trigger:
          "bg-neutral-900/40 border border-neutral-700 rounded-lg cursor-pointer px-4 py-3 hover:bg-neutral-800/50 transition-colors",
        value: "text-sm text-neutral-200",
        popoverContent:
          "bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl",
        listbox: "p-1",
      }}
      items={locationOptions}
      selectedKeys={new Set([selectedLocation])}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0] as LocationIntent;
        onLocationChange(selectedKey);
      }}
      label="Location"
    >
      {(location) => (
        <SelectItem
          classNames={{
            title: "text-sm",
            base: `hover:bg-neutral-700 rounded-sm transition-all duration-300 ease-in-out`,
          }}
          key={location.key}
        >
          {location.label}
        </SelectItem>
      )}
    </Select>
  );
}
