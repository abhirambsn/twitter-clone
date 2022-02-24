import 'emoji-mart/css/emoji-mart.css'
import React, { useRef, useState } from "react"
import {IoMdClose} from "react-icons/io";
import {AiOutlinePicture, AiOutlineGif} from "react-icons/ai";
import {BsFillBarChartLineFill, BsEmojiSmile, BsCalendar4Week} from "react-icons/bs";
import {MdOutlineLocationOn} from "react-icons/md";
import { Picker } from 'emoji-mart'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import {db, storage} from "../firebase";
import {useSession} from 'next-auth/react';


const TweetForm = () => {
    const {data: session} = useSession();
    const [tweetData, setTweetData] = useState("");
    const [image, setImage] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef(null);

    const uploadImage = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setImage(readerEvent.target.result);
        }
    }
    const insertEmoji = (e) => {
        let sym = e.unified.split("-")
        let codesArray = []
        sym.forEach((el) => codesArray.push("0x" + el))
        let emoji = String.fromCodePoint(...codesArray)
        setTweetData(tweetData + emoji);
    }
    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, "tweets"), {
            id: session?.user?.uid,
            username: session?.user?.name,
            userImg: session?.user?.image,
            tag: session?.user?.tag,
            tweet: tweetData,
            timestamp: serverTimestamp()
        })

        const imageRef = ref(storage, `tweets/${docRef.id}/image`)
        if (image) {
            await uploadString(imageRef, image, "data_url").then(async () => {
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(db, "tweets", docRef.id), {image: downloadURL})
            })
        }
        setLoading(false);
        setTweetData("");
        setImage(null);
        setShowEmoji(false);
    }
    
  return (
    <div className={`border-b border-gray-700 flex p-3 space-x-3 overflow-y-scroll scrollbar-hide ${loading && "opacity-60"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={session?.user?.image} 
        alt="user img" className="h-10 w-10 cursor-pointer rounded-full border border-gray-700" />
        <div className="w-full divide-y divide-gray-700">
            <div className={`${image && "pb-7"} ${tweetData && "space-y-2.5"}`}>
                <textarea name="" onChange={(e) => setTweetData(e.target.value)} value={tweetData} id="" rows={2} className="bg-transparent outline-none text-[#d9d9d9] text-lg 
                placeholder:text-gray-500 tracking-wide w-full min-h-[50px]" placeholder="What's happening?" />
            </div>
            {image && (
                <div className="relative">
                    <div className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] 
                    bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 
                    cursor-pointer" onClick={() => setImage(null)}>
                        <IoMdClose className="text-white h-5" />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Image" className="rounded-2xl max-h-80 object-contain" />
                </div>
            )}
            {!loading && (
            <div className="flex items-center justify-between pt-2.5">
                <div className="flex items-center">
                    <div className="icon" onClick={() => fileRef.current.click()}>
                        <AiOutlinePicture className="h-[22px] text-[#1d9bf0]" />
                        <input type="file" onChange={uploadImage} ref={fileRef} hidden />
                    </div>
                    <div className="icon">
                        <AiOutlineGif className="h-[22px] text-[#1d9bf0]" />
                    </div>
                    <div className="icon rotate-90">
                        <BsFillBarChartLineFill className="h-[22px] text-[#1d9bf0]" />
                    </div>
                    <div className="icon" onClick={() => setShowEmoji(!showEmoji)}>
                        <BsEmojiSmile className="h-[22px] text-[#1d9bf0]" />
                    </div>
                    <div className="icon">
                        <BsCalendar4Week className="h-[22px] text-[#1d9bf0]" />
                    </div>
                    <div className="icon">
                        <MdOutlineLocationOn className="h-[22px] text-[#1d9bf8]" />
                    </div>

                    {showEmoji && (
                        <Picker onSelect={insertEmoji} style={{
                            position: "absolute",
                            marginTop: "465px",
                            marginLeft: -40,
                            maxWidth: "320px",
                            borderRadius: "20px"
                        }} theme='dark'
                        />
                    )}
                </div>
                <button className='bg-[#1d9bf0] text-white 
                rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8]
                disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default'
                disabled={!tweetData.trim() && !image}
                onClick={sendPost}>
                    Tweet
                </button>
            </div>
        )}
        </div>
    </div>
  )
}

export default TweetForm