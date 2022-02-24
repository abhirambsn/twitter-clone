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
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { commentIdAtom, commentModalAtom } from "../atoms/modalAtom";
import CommentModal from "./CommentModal";
import Reply from "./Reply";
import Replies from "./Replies";

const Comment = ({ id, tweetId, comment }) => {
  const [liked, setLiked] = useState(true);
  const [replies, setReplies] = useState([]);
  const [commentId, setCommentId] = useRecoilState(commentIdAtom);
  const [isOpen, setIsOpen] = useRecoilState(commentModalAtom);
  const [likes, setLikes] = useState([]);
  const { data: session } = useSession();

  useEffect(
    () =>
      onSnapshot(
        collection(db, "tweets", tweetId, "comments", id, "likes"),
        (snapshot) => setLikes(snapshot.docs)
      ),
    [id]
  );
  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  );

  useEffect(() => 
    onSnapshot(
      query(
        collection(db, "tweets", tweetId, "comments", id, "replies"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setReplies(snapshot.docs)
    ), [tweetId, id])

  const likeComment = async () => {
    if (liked) {
      await deleteDoc(
        doc(db, "tweets", tweetId, "comments", id, "likes", session?.user?.uid)
      );
    } else {
      await setDoc(
        doc(db, "tweets", tweetId, "comments", id, "likes", session?.user?.uid),
        {
          username: session?.user?.name,
        }
      );
    }
  };

  return (
    <div className="flex flex-col"> 
      <div className="p-3 flex cursor-pointer border-b border-gray-700">
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
          <Replies replies={replies} id={id} tweetId={tweetId} />
          <div className={`text-[#6e767d] flex justify-between w-10/12`}>
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                setCommentId(id);
                setIsOpen(true);
              }}
            >
              <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-60">
                <BsChatDots className="h-5 group-hover:text-[#1d9bf0]" />
              </div>
              {replies.length > 0 && (
                <span className="group-hover:text-[#1d9bf0] text-sm">
                  {replies.length}
                </span>
              )}
            </div>
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                likeComment();
              }}
            >
              <div className="icon group-hover:bg-pink-600/10">
                {liked ? (
                  <BsHeartFill className="h-5 text-pink-600" />
                ) : (
                  <BsHeart className="h-5 group-hover:text-pink-600" />
                )}
              </div>
              {likes.length > 0 && (
                <span
                  className={`group-hover:text-pink-600 text-sm ${
                    liked && "text-pink-600"
                  }`}
                >
                  {likes.length}
                </span>
              )}
            </div>
            <div className="icon group">
              <BiShare className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            <div className="icon group">
              <BiChart className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
