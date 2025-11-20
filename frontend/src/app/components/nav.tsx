"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faDiagramProject,
  faLocationDot,
  faPlusCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();

  return (
    <div
      className="w-1/10 flex sticky left-0 top-0 h-screen flex-col justify-around items-center bg-linear-to-b
 from-[#19535F]/40 via-black to-[#98473E]/30  backdrop-blur-3xl shadow z-999"
    >
      <Link href="/discover" className=" text-4xl font-normal">
        brew
      </Link>
      <ul className="flex flex-col justify-between text-center text-sm gap-y-12 ">
        <Link
          href="/discover"
          className={` hover:text-white ease-in-out duration-300 flex flex-col items-center ${
            path === "/discover" ? "text-white" : "text-white/50"
          }`}
        >
          <FontAwesomeIcon
            icon={faLocationDot}
            className="w-4 h-4 mx-auto mb-4 "
          />
          <span>Discover</span>
        </Link>
        <Link
          href="/profile"
          className={` hover:text-white ease-in-out duration-300 flex flex-col items-center ${
            path === "/profile" ? "text-white" : "text-white/50"
          }`}
        >
          <FontAwesomeIcon icon={faUser} className="w-4 h-4 mx-auto mb-4 " />
          <span>Profile</span>
        </Link>
        <Link
          href="/circle"
          className={` hover:text-white ease-in-out duration-300 flex flex-col items-center ${
            path === "/circle" ? "text-white" : "text-white/50"
          }`}
        >
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="w-4 h-4 mx-auto mb-4 "
          />
          <span>Circle</span>
        </Link>{" "}
        <Link
          href="/events"
          className={` hover:text-white ease-in-out duration-300 flex flex-col items-center ${
            path === "/event" ? "text-white" : "text-white/50"
          }`}
        >
          <FontAwesomeIcon
            icon={faDiagramProject}
            className="w-4 h-4 mx-auto mb-4 "
          />
          <span>Events</span>
        </Link>{" "}
      </ul>
      <button className="flex flex-col text-white/75 hover:text-white ease-in-out duration-300 items-center cursor-pointer">
        <div>
          <FontAwesomeIcon icon={faPlusCircle} className="w-8 h-8" />
        </div>
        <span className="mt-4 text-sm">Create Event</span>
      </button>
    </div>
  );
}
