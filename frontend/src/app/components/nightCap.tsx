import React, { useState } from "react";
import { SendMessageDm, MicrophoneMusicTalk } from "react-basicons";
import Comments from "./comments";

export default function NightCap() {
  const [comments, setComments] = useState<string[] | null>([]);

  const mockComments = [
    {
      id: "1",
      comment: "Didn’t expect tonight to feel like this. Grateful.",
      createdAt: "11:42 PM",
      profileImage: "/profile_2.png",
    },
    {
      id: "2",
      comment: "The music, the conversations — everything landed.",
      createdAt: "11:51 PM",
      profileImage: "/profile_3.png",
    },
    {
      id: "3",
      comment: "One of those nights you want to remember.",
      createdAt: "12:03 AM",
      profileImage: "/profile_4.png",
    },
    {
      id: "4",
      comment:
        "I didn’t come in with expectations tonight, and I think that’s why it landed the way it did. Conversations felt unforced, time moved slower than usual, and for a moment it didn’t feel like everyone was rushing toward the next thing. Grateful for the people I crossed paths with — even the quiet exchanges mattered more than I expected.",
      createdAt: "12:17 AM",
      profileImage: "/profile_1.png",
    },
  ];

  return (
    <section className="py-24 ">
      <div className="mb-16  flex justify-end items-center">
        <div className="flex flex-col gap-y-4 max-w-sm text-right">
          <h2 className="text-4xl ">
            {comments?.length === 0
              ? "Leave something behind"
              : "Add to the night"}{" "}
          </h2>
          <p className="text-white/75">
            {comments?.length === 0
              ? "The night's winding down. Share a thought, a feeling, or a moment before it fades."
              : "A few thoughts are already here. Add yours before the night closes."}{" "}
          </p>
        </div>
      </div>
      {/* Text Area */}
      <form className="w-full mx-auto rounded-xl border border-white/10 bg-black/30 backdrop-blur-2xl shadow-lg overflow-hidden mb-16">
        <div className="relative ">
          {/* Textarea */}
          <textarea
            name="nightcap"
            rows={6}
            placeholder="Share your night…"
            className="w-full bg-transparent px-6 pt-6 pb-16 text-white text-sm placeholder-white/40 placeholder:text-sm resize-none outline-none"
          />
        </div>
        {/* Actions */}
        <div className=" p-6 flex items-center justify-between border-t border-white/20">
          {/* Mic */}
          <button
            type="button"
            className="text-white/50 hover:text-white transition ease-in-out duration-300 cursor-pointer"
          >
            <MicrophoneMusicTalk size={20} color="currentColor" />
          </button>

          {/* Send */}
          <button
            type="submit"
            className="w-9 h-9 flex items-center cursor-pointer transition ease-in-out duration-300 justify-center rounded-full bg-white text-black hover:scale-105 "
          >
            <SendMessageDm size={18} weight={1} color="currentColor" />
          </button>
        </div>
      </form>
      <section className="w-full">
        {/* NightCap Comments */}
        {mockComments && mockComments?.length === 0 ? (
          <>
            <div className="w-fit max-w-3xl text-sm rounded-xl p-4 border border-white/10 bg-black/30 backdrop-blur-2xl shadow-lg overflow-hidden">
              Leave a note from the night.
            </div>
          </>
        ) : (
          <>
            {mockComments?.map((comment, index) => (
              <Comments
                key={index}
                comment={comment.comment}
                profileId={comment.profileImage}
                createdAt={comment.createdAt}
              />
            ))}
          </>
        )}
      </section>
    </section>
  );
}
