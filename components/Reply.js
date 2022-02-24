import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import { BsChatDots, BsHeart, BsHeartFill } from "react-icons/bs";
import { BiChart, BiShare, BiTrash } from "react-icons/bi";
import { HiSwitchHorizontal } from "react-icons/hi";
import {
  deleteDoc,
  doc,
  onSnapshot,
  collection,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { commentIdAtom, commentModalAtom } from "../atoms/modalAtom";

const Reply = ({ id, commentId, tweetId, comment }) => {
  const [liked, setLiked] = useState(true);
  const [replies, setReplies] = useState([]);
  const [isOpen, setIsOpen] = useRecoilState(commentModalAtom);
  const [likes, setLikes] = useState([]);
  const { data: session } = useSession();

  useEffect(() => 
    onSnapshot(
      collection(db, "tweets", tweetId, "comments", commentId, "replies"),
      (snapshot) => setReplies(snapshot.docs)
    ), [tweetId, commentId])

  return (
    <>
    <div className="p-3 flex cursor-pointer">
      <img
        src={comment?.userImg}
        alt=""
        className="h-11 w-11 rounded-full mr-4"
      />
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex justify-between">
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4
                className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] 
                        group-hover:underline`}
              >
                {comment?.username}
              </h4>
              <span className={`text-sm sm:text-[15px]`}>@{comment?.tag}</span>
            </div>{" "}
            .{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
            <p className="text-[#d9d9d9] mt-0.5 max-w-lg overflow-scroll scrollbar-hide text-[15px] sm:text-base">
              {comment?.comment}
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Reply;
