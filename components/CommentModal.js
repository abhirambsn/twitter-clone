import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Moment from "react-moment";
import { commentIdAtom, commentModalAtom } from "../atoms/modalAtom";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BiXCircle } from "react-icons/bi";
import { AiOutlinePicture, AiOutlineGif } from "react-icons/ai";
import {
  BsFillBarChartLineFill,
  BsCalendar4Week,
} from "react-icons/bs";
import { MdOutlineLocationOn } from "react-icons/md";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const CommentModal = ({tweetId}) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(commentModalAtom);
  const [commentId, setCommentId] = useRecoilState(commentIdAtom);
  const [comment, setComment] = useState();
  const [reply, setReply] = useState("");
  const router = useRouter();

  useEffect(
    () =>
    onSnapshot(doc(collection(doc(db, "tweets", tweetId), "comments"), commentId), (snapshot) => {
        setComment(snapshot.data());
      }),
    [commentId, tweetId]
  );

  const sendReply = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "tweets", tweetId, "comments", commentId, "replies"), {
      comment: reply,
      username: session?.user?.name,
      tag: session?.user?.tag,
      userImg: session?.user?.image,
      timestamp: serverTimestamp(),
    });
    setIsOpen(false);
    setReply("");
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={setIsOpen}>
        <div
          className="flex items-start justify-center min-h-[800px]
            sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block align-bottom bg-black rounded-2xl
                    text-left overflow-hidden shadow-xl transform transition-all
                    sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
            >
              <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                <div
                  className="animateHover w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => setIsOpen(false)}
                >
                  <BiXCircle className="h-[22px] text-white" />
                </div>
              </div>
              <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <div className="text-[#6e767d] flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                    <img
                      src={comment?.userImg}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div>
                      <div className="inline-block group">
                        <h4 className="font-bold text-[15px] sm:text-base text-[#d9d9d9] inline-block group-hover:underline">
                          {comment?.username}
                        </h4>
                        <span className="ml-1.5 text-sm sm:text-[15px]">
                          @{comment?.tag}
                        </span>{" "}
                        .{" "}
                        <span className="hover:underline text-sm sm:text-[15px]">
                          <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
                        </span>
                        <p className="text-[#d9d9d9] text-[15px] sm:text-base">
                          {comment?.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-7 flex space-x-3 w-full">
                    <img
                      src={session?.user?.image}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div className="flex-grow mt-2">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Tweet your reply"
                        rows="2"
                        className="bg-transparent outline-none text-[#d9d9d9]
                                        text-lg placeholder-gray-500 tracking-wide
                                        w-full min-h-[80px]"
                      />

                      <div className="flex items-center">
                        <div className="icon">
                          <AiOutlineGif className="h-[22px] text-[#1d9bf0]" />
                        </div>
                        <div className="icon rotate-90">
                          <BsFillBarChartLineFill className="h-[22px] text-[#1d9bf0]" />
                        </div>
                        <div className="icon">
                          <BsCalendar4Week className="h-[22px] text-[#1d9bf0]" />
                        </div>
                        <div className="icon">
                          <MdOutlineLocationOn className="h-[22px] text-[#1d9bf8]" />
                        </div>
                      </div>
                      <button
                        className="bg-[#1d9bf0] text-white 
                                        rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8]
                                        disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                        disabled={!reply.trim()}
                        onClick={sendReply}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommentModal;
