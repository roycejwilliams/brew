"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import Attended from "./attended";
import Hosted from "./hosted";
import Spotlight from "./spotlight";
import Suggested from "./suggested";

interface FeedProp {
  id: string;
}

function Feed({ id }: FeedProp) {
  const [feed, setFeed] = useState<boolean>(false);
  // shows a active feed if the user has data present... just a placeholder for now

  return (
    <section className="w-full mt-8 h-full flex justify-center items-center">
      {!feed ? (
        <>
          <div className="flex flex-col gap-y-20 w-full ">
            <Attended id={id} />
            <Hosted id={id} />
            <Spotlight id={id} />
            <Suggested id={id} />
          </div>
        </>
      ) : (
        <>
          {/* Empty State */}
          <div className="absolute mx-auto bg-[radial-gradient(circle_at_center,#98473E,transparent)] blur-3xl rounded-full opacity-85 w-3/5 h-3/5 mt-8"></div>

          <div className="flex flex-col gap-y-8 h-full justify-center items-center relative mt-8">
            {/* Display Cards */}
            <div className="flex gap-x-1 z-30">
              <div className="w-42 h-52 border border-white/20 shadow-lg rounded-xl mt-8 relative transform hover:-translate-y-4 ease-in-out duration-300 -rotate-12 overflow-hidden">
                <Image
                  src="/profile_2.png"
                  fill
                  priority
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="w-42 h-52 border border-white/20 shadow-lg rounded-xl relative hover:-translate-y-4 ease-in-out duration-300 overflow-hidden z-20">
                <Image
                  src="/profile_3.png"
                  fill
                  priority
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="w-42 h-52 border border-white/20  shadow-lg rounded-xl mt-8 relative hover:-translate-y-4 ease-in-out duration-300 rotate-12 overflow-hidden">
                <Image
                  src="/profile_4.png"
                  fill
                  priority
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <p>Your story begins when you show up.</p>
            <div className="flex gap-x-4 items-center text-sm">
              <button className="px-4 py-2 bg-black/30 backdrop-blur-3xl border cursor-pointer border-white/15 shadow-lg shadow-[#19535F] rounded-full">
                Find Your First Night
              </button>
              <div className="w-1.5 h-1.5 rounded-full border"></div>
              <button className="px-4 py-2 bg-black/30 backdrop-blur-3xl border cursor-pointer border-white/15 shadow-lg shadow-[#19535F] rounded-full">
                Curate your own event
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Feed;
