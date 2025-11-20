import { faBell, faQrcode, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SearchProps {
  openModal: (type: "qr" | "notifications") => void;
}

export default function Search({ openModal }: SearchProps) {
  return (
    <section className="flex absolute justify-evenly w-5/6  mx-auto top-8 left-1/2 -translate-1/2 items-center  z-10  mt-12 ">
      {/* QR Code */}

      {/* Search */}
      <div className="max-w-3/4 w-1/2 border p-4 bg-[#2b2b2b]  border-white/10 shadow-xl mx-auto rounded-md flex items-center">
        <div className="w-fit h-fit flex justify-center items-center">
          <FontAwesomeIcon icon={faSearch} className="text-xl" />
        </div>
        <input
          type="text"
          id="search"
          className="text-white flex-1  text-sm  placeholder:text-xs block mx-auto p-2.5 bg-transparent placeholder:text-white/50 focus:outline-none"
          placeholder="Search by City, Zip Code, or State"
          required
        />
      </div>
    </section>
  );
}
