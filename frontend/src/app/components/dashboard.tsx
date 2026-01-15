"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import Feed from "./feed";
import Image from "next/image";

interface DashboardProp {
  userId: string;
}

function Dashboard({ userId }: DashboardProp) {
  return (
    <section className=" h-auto bg-linear-to-b py-8 from-[#2b2b2b] to-black ">
      {/* Profile */}
      <div className="flex justify-between px-24">
        {/* UserName */}
        <div className="w-full h-1/4  flex gap-x-4 ml-40">
          <div className="w-32 h-32 border border-white/20 rounded-md relative overflow-hidden">
            <Image
              src="/profile_1.png"
              fill
              priority
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col text-white/75">
            {/* Username/Name */}
            <div>
              <h1 className="text-xl ">@username</h1>
              <h2 className="text-sm">Lorem Ipsum</h2>
            </div>
            {/* Location */}
            <div
              className="mt-4 flex items-center gap-x-1 text-sm
            "
            >
              <div className="w-fit h-fit  ">
                <FontAwesomeIcon icon={faMapPin}></FontAwesomeIcon>{" "}
              </div>
              Los Angeles, California
            </div>
            {/* Social Media */}
            <div className="flex gap-x-2 text-lg mt-4">
              <Link href="/">
                <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>
              </Link>
              <Link href="/">
                <FontAwesomeIcon icon={faXTwitter}></FontAwesomeIcon>
              </Link>
              <Link href="/">
                <FontAwesomeIcon icon={faLinkedin}></FontAwesomeIcon>
              </Link>
            </div>
            {/* Bio */}
            <div className="mt-4 text-sm text-white/75">Notes </div>
            {/* Circle */}
            <div className="mt-4 flex items-center gap-x-4">
              <span>0 Active connections</span>
              <div className="flex relative gap-x-1">
                <div className="border w-8 h-8 rounded-full relative right-0 shadow-lg"></div>
                <div className="border w-8 h-8 rounded-full relative right-4 shadow-lg"></div>
                <div className="border w-8 h-8 rounded-full relative right-8 shadow-lg"></div>
                <div className="border w-8 h-8 rounded-full relative right-12 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <div className=" border border-white/30 text-sm rounded-full text-center w-1/8 p-2 bg-black shadow h-fit">
          <p className="text-sm">0% completed</p>
        </div>
      </div>
      {/* Feed */}
      <Feed id={userId} />
      {/* Event Card */}
    </section>
  );
}

export default Dashboard;
