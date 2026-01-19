"use client";
import { usePathname } from "next/navigation";
import { SearchIcon } from "./icons";

export default function SearchMap() {
  const path = usePathname();

  return (
    <section className="flex justify-evenly mx-auto items-center z-20">
      {/* Search */}
      <div className=" w-full  px-4 py-2 bg-[#181818] backdrop-blur-lg  border-b border-white/10  mx-auto  flex items-center">
        <div className="w-fit h-fit flex justify-center items-center">
          <SearchIcon size={20} color="currentColor" />
        </div>
        <input
          type="text"
          id="search"
          className="text-white flex-1  text-sm  placeholder:text-xs block mx-auto p-2.5 bg-transparent placeholder:text-white/50 focus:outline-none"
          placeholder={
            path === "/circle"
              ? "Search Users, Groups, & Collectives"
              : "Search a city or area"
          }
          required
        />
      </div>
    </section>
  );
}
