import React, { useState } from "react";
import Tools from "./Tools";

type ManageView = "moments" | "circle" | "referral" | null;

function Manage() {
  const [manage, setManage] = useState<ManageView>("moments");

  return (
    <section className="w-full h-screen bg-linear-to-b to-black  from-[#2b2b2b] overflow-hidden relative pl-56">
      <Tools manage={manage} setManage={setManage} />
    </section>
  );
}

export default Manage;
