import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {HiOutlineSparkles} from "react-icons/hi";
import { db } from "../firebase";
import Tweet from "./Tweet";
import TweetForm from "./TweetForm";

const Feed = () => {
    const [tweets, setTweets] = useState([]);
    useEffect(() => 
        onSnapshot(query(collection(db, "tweets"), orderBy("timestamp", "desc")), (snapshot) => {
            setTweets(snapshot.docs);
        }),
    [])
  return (
    <div className='text-white flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]'>
        <div className='text-[#d9d9d9] flex items-center justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700'>
            <h2 className="text-lg sm:text-xl font-bold">Home</h2>
            <div className="animateHover w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
                <HiOutlineSparkles className="text-white" />
            </div>
        </div>
        <TweetForm />
        <div className="pb-72">
            {tweets.map(tweet => (
                <Tweet key={tweet.id} id={tweet.id} tweet={tweet.data()} />
            ))}
        </div>
    </div>
  )
}

export default Feed