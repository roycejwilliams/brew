"use client";
import React from "react";
import { AnimatePresence } from "motion/react";
import EventCard from "./eventCard";
import { openEventCard } from "@/stores/store";
import { ScrollLock } from "../utils/scrollLock";

function ClientUi() {
  const eventCard = openEventCard((state) => state.isEventOpen);

  //Scroll Lock Utility
  ScrollLock(eventCard);
  return <AnimatePresence>{eventCard && <EventCard />}</AnimatePresence>;
}

export default ClientUi;
