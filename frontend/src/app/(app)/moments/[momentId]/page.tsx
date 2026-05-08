"use client";
import EventCard from "@/app/components/eventCard";
import { useGetMomentById } from "@/hooks/useMoments";
import { openEventCard } from "@/stores/store";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

export default function Moment() {
  const { momentId } = useParams();
  const openEvent = openEventCard((state) => state.openEvent);
  const moment = openEventCard((state) => state.moment);

  const { data } = useGetMomentById(momentId as string);

  useEffect(() => {
    if (data?.data.data) {
      openEvent(data.data.data);
    }
  }, [data]);

  if (!moment) return null;

  return <EventCard />;
}
