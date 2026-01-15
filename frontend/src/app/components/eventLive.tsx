import React, { useEffect, useState } from "react";
import CanvasQRcode from "./canvasQRcode";
import AttendeeDetails from "./attendeeDetails";
import HostMessage from "./hostMessage";
import { Map } from "./map";

interface EventLiveProp {
  activeModal: "live";
}

type HostMessageItem = {
  text: string;
  time: string;
};

export default function EventLive({ activeModal }: EventLiveProp) {
  const [hostMessages, setHostMessages] = useState<HostMessageItem[]>([]);

  useEffect(() => {
    const dummyData: HostMessageItem[] = [
      {
        text: "We`&apos;`re opening the first pour now. Take your time settling into the space — the room is filling with a steady energy, and the music is beginning to shape the atmosphere. Feel free to make your way to the bar when you`&apos;`re ready. Tonight is meant to unfold slowly and intentionally; we`&apos;`ll guide you through each moment as the experience builds.",
        time: "8:17 PM",
      },
      {
        text: "If you`&apos;`ve just arrived, you can check in at the bar when you`&apos;`re ready. There`&apos;`s no rush — move at your own pace, the night is designed to breathe.",
        time: "8:36 PM",
      },
    ];

    setHostMessages(dummyData.reverse());
  }, []);

  return (
    <>
      <div className="py-4 flex items-center gap-x-2 border-b w-1/3">
        <div className="w-6 h-6  animation-pulse shadow-2xl border-2 border-green-600 rounded-full flex justify-center items-center">
          <div className="w-4 h-4  animation-pulse shadow-2xl border-2 border-green-600 rounded-full flex justify-center items-center">
            <div className="w-2 h-2  animation-pulse shadow-2xl border-2 border-green-600 rounded-full"></div>
          </div>
        </div>
        <h2 className="text-lg ">Live Now</h2>
      </div>
      <section className="py-24 min-h-[85vh] text-center">
        <h2 className="text-5xl">Let&apos;s Party</h2>
        <p className="text-lg text-white/75 mt-8">Time to Brew</p>
        <div className="overflow-hidden rounded-xl shadow-lg border w-fit mx-auto my-8 shadow-[#19535F] border-white/50">
          <CanvasQRcode qrWidth={275} />
        </div>{" "}
        <h2 className="text-2xl mt-8">Check in with Host</h2>
      </section>
      <div className="w-full h-2/3 relative my-8 overflow-hidden inset-0  rounded-lg shadow-lg opacity-85">
        <Map center={[-122.42285, 37.73393]} zoom={11} />
      </div>
      <AttendeeDetails activeEvent={activeModal} />
      <section className=" w-full py-24">
        <div className="text-center">
          <h2 className="text-5xl">Tonight&apos;s Signals</h2>
          <p className="mt-8 text-white/75">
            Real-time notes from your host. Curated notes meant for those
            present.
          </p>
        </div>
        {/* {hostMessage.map(() => {}) */}
        {hostMessages.map((msg, i) => (
          <HostMessage key={i} hostMessage={msg.text} hostTime={msg.time} />
        ))}{" "}
      </section>
    </>
  );
}
