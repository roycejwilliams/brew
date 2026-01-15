import React from "react";
import Image from "next/image";

interface CommentProp {
  comment: string;
  createdAt: Date | string;
  profileId: string;
}

export default function Comments({
  comment,
  createdAt,
  profileId,
}: CommentProp) {
  return (
    <div className="w-fit max-w-2xl mb-6">
      {" "}
      <div className=" text-sm rounded-xl flex gap-x-4 items-start px-4 py-2 border border-white/10 bg-black/30 backdrop-blur-2xl shadow-lg overflow-hidden">
        <div className="w-10 h-10 border shrink-0 border-white/20 shadow-2xl rounded-full overflow-hidden relative">
          <Image
            src={profileId}
            alt=""
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <span>{comment}</span>
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-xs text-white/50">{createdAt.toString()}</span>
      </div>
    </div>
  );
}
