import React, { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faGrip,
  faKey,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";

interface OpenModal {
  openModal: (type: "filter" | "notifications" | "qr") => void;
}

export default function Events({ openModal }: OpenModal) {
  return (
    <section
      className="absolute right-0 top-0 h-full transform w-[21.5%] bg-linear-to-b
 from-[#19535F]/10 via-black to-[#98473E]/5  backdrop-blur-3xl shadow border-l border-white/10 rounded-tl-3xl rounded-bl-3xl z-40"
    >
      <div className="flex justify-between  pb-4 items-center gap-x-4 border-b border-white/10  mt-14 px-8  text-white">
        <h2 className=" rounded-md text-xl">Discover</h2>
        <div className="flex items-center gap-x-4">
          <button
            role="Invite"
            onClick={() => openModal("qr")}
            className="w-8 h-8 cursor-pointer bg-white/10 transform translate-y-0 hover:-translate-y-1 ease-in-out duration-200 backdrop-blur-sm shadow-lg  flex items-center justify-center border border-white/10 rounded-full"
          >
            <FontAwesomeIcon icon={faQrcode} className="text-xs" />
          </button>
          <button
            role="notifications"
            onClick={() => openModal("notifications")}
            className="w-8 h-8 cursor-pointer bg-white/10 transform translate-y-0 hover:-translate-y-1 ease-in-out duration-200 backdrop-blur-sm shadow-lg  flex items-center justify-center border border-white/10 rounded-full"
          >
            <FontAwesomeIcon icon={faBell} className="text-xs" />
          </button>
          <button
            role="filter"
            onClick={() => openModal("filter")}
            aria-label="filter"
            className="w-8 h-8 cursor-pointer bg-white/10 transform translate-y-0 hover:-translate-y-1 ease-in-out duration-200 backdrop-blur-sm shadow-lg  flex items-center justify-center border border-white/10 rounded-full"
          >
            <FontAwesomeIcon icon={faGrip} className="text-xs" />
          </button>
        </div>
      </div>
      <section className="flex flex-wrap gap-2 px-8 pb-36 pt-4 relative w-full h-full mx-auto overflow-y-scroll overflow-hidden    ">
        {Array.from({ length: 20 }, (_, i) => (
          <button
            key={i}
            className="flex gap-x-4 rounded-md px-4 py-2 w-full  shadow-[#98473E]/15  hover:scale-105 origin-right duration-200 ease-in-out transition  mb-4 relative shadow-xl border border-white/20  cursor-pointer"
          >
            <Image
              src="/image-test-brew.jpg"
              fill
              alt="test image"
              className="object-cover brightness-75 blur-xs w-full h-full absolute z-0"
            />
            <div className="flex flex-col justify-between items-center relative">
              <div className="w-6 h-6  rounded-full bg-[#2b2b2b] shadow-lg border border-white/10 flex justify-center items-center">
                <FontAwesomeIcon icon={faKey} className="text-xs" />
              </div>
              <span className="text-xs text-white/75 ">Private</span>
            </div>
            <div className="flex flex-col items-start justify-between text-left relative">
              <h2 className="font-medium text-xs">AIMÉ LEON DORE</h2>
              <p className="text-xs text-white/75">
                Sat, Nov 9 <br></br> Washington DC, USA
              </p>
            </div>
          </button>
        ))}
      </section>
      <div className="w-full  h-full left-0 blur-3xl -z-10 absolute bottom-0"></div>
    </section>
  );
}
