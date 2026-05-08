"use client";
import Dashboard from "@/app/components/dashboard";
import { useGetUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import React from "react";

export default function Profile() {
  //useParams is specifically for reading dynamic route segments
  //reads whatever is in the URL segment
  const { profile } = useParams();
  const { data } = useGetUser(profile as string);
  if (!data?.data.data) return null;

  return <Dashboard profile={data?.data.data} />; // dashboard is suppose to be tailored for the user
}
