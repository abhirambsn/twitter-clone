import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BiChart, BiDotsHorizontal, BiShare, BiTrash } from 'react-icons/bi'
import { BsChatDots, BsHeart, BsHeartFill } from 'react-icons/bs';
import { HiSwitchHorizontal } from 'react-icons/hi';
import { db } from '../firebase';
import Moment from 'react-moment';
import { useRecoilState } from 'recoil';
import { modalAtom, postIdAtom } from '../atoms/modalAtom';

const Tweet = ({id, tweet, tweetPage}) => {
    const {data: session} = useSession();
    const [isOpen, setIsOpen] = useRecoilState(modalAtom);
    const [postId, setPostId] = useRecoilState(postIdAtom);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);
    const router = useRouter();

    useEffect(() => 
        onSnapshot(query(collection(db, "tweets", id, "comments"), orderBy("timestamp", "desc")), (snapshot) => {
            setComments(snapshot.docs)
        }), [id])

    useEffect(() => 
        onSnapshot(collection(db, "tweets", id, "likes"), (snapshot) => setLikes(snapshot.docs)), [id]);
    useEffect(
        () => setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1), 
    [likes])

    const likePost = async () => {
        if (liked) {
            await deleteDoc(doc(db, "tweets", id, "likes", session?.user?.uid))
        } else {
            await setDoc(doc(db, "tweets", id, "likes", session?.user?.uid), {
                username: session?.user?.name
            })
        }
    }
  return (
    <div className='p-3 flex cursor-pointer border-b border-gray-700' onClick={() => {router.push(`/tweet/${id}`)}}>
        {!tweetPage && (
            <img src={tweet?.userImg} alt="Profile Picture" className='h-11 w-11 rounded-full mr-4' />
        )}
        <div className='flex flex-col space-y-2 w-full'>
            <div className={`flex ${!tweetPage && "justify-between"}`}>
                {tweetPage && (
                    <img src={tweet?.userImg} alt="Profile Picture" className='h-11 w-11 rounded-full mr-4' />
                )}
                <div className='text-[#6e767d]'>
                    <div className='inline-block group'>
                        <h4 className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] 
                        group-hover:underline ${!tweetPage && "inline-block"}`}>
                            {tweet?.username}
                        </h4>
                        <span className={`text-sm sm:text-[15px] ${!tweetPage && "ml-1.5"}`}>
                            @{tweet?.tag}
                        </span>
                    </div>{" "}
                    .{" "}
                    <span className='hover:underline text-sm sm:text-[15px]'>
                        <Moment fromNow>{tweet?.timestamp?.toDate()}</Moment>
                    </span>
                    {!tweetPage && (
                        <p className='text-[#d9d9d9] text-[15px] sm:text-base mt-0.5'>
                            {tweet?.tweet}
                        </p>
                    )}
                </div>
                <div className='icon group flex-shrink-0 ml-auto'>
                    <BiDotsHorizontal className='h-5 text-[#6e767d] group-hover:text-[#1d9bf0]' />
                </div>
            </div>
            {tweetPage && (
                <p className='text-[#d9d9d9] text-[15px] sm:text-base mt-0.5'>
                    {tweet?.tweet}
                </p>
            )}
            <img src={tweet?.image} alt="" className='rounded-2xl max-h-[700px] object-cover mr-2' />
            <div className={`text-[#6e767d] flex justify-between w-10/12 ${tweetPage && "mx-auto"}`}>
                <div className='flex items-center space-x-1 group' onClick={(e) => {
                    e.stopPropagation();
                    setPostId(id);
                    setIsOpen(true);
                }}>
                    <div className='icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-60'>
                        <BsChatDots className='h-5 group-hover:text-[#1d9bf0]' />
                    </div>
                    {comments.length > 0 && (
                        <span className='group-hover:text-[#1d9bf0] text-sm'>
                            {comments.length}
                        </span>
                    )}
                </div>
                {session?.user?.uid === tweet?.id ? (
                    <div className='flex items-center space-x-1 group'
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteDoc(doc(db, "tweets", id));
                        router.push("/");
                    }}>
                        <div className='icon group-hover:bg-red-600/10'>
                            <BiTrash className='h-5 group-hover:text-red-600' />
                        </div>
                    </div>
                ) : (
                    <div className='flex items-center space-x-1 group'>
                        <div className='icon group-hover:bg-green-500/10'>
                            <HiSwitchHorizontal className='h-5 group-hover:text-green-500' />
                        </div>
                    </div>
                )}
                <div className='flex items-center space-x-1 group' onClick={(e) => {
                    e.stopPropagation();
                    likePost();
                }}>
                    <div className='icon group-hover:bg-pink-600/10'>
                        {liked ? (
                            <BsHeartFill className='h-5 text-pink-600' />
                        ) : (
                            <BsHeart className='h-5 group-hover:text-pink-600' />
                        )}
                    </div>
                    {likes.length > 0 && (
                        <span className={`group-hover:text-pink-600 text-sm ${liked && "text-pink-600"}`}>
                            {likes.length}
                        </span>
                    )}
                </div>
                <div className='icon group'>
                    <BiShare className='h-5 group-hover:text-[#1d9bf0]' />
                </div>
                <div className='icon group'>
                    <BiChart className='h-5 group-hover:text-[#1d9bf0]' />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Tweet