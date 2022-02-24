import Image from "next/image"
import {RiHome7Fill, RiHashtag} from "react-icons/ri";
import {FaBell} from "react-icons/fa";
import {BiEnvelope, BiUser} from "react-icons/bi";
import {BsFillBookmarkFill} from "react-icons/bs";
import {GoNote} from "react-icons/go";
import {CgMoreO} from "react-icons/cg"
import {FiMoreHorizontal} from "react-icons/fi";
import SidebarMenuItem from "./SidebarMenuItem";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

import {useSession} from "next-auth/react";

const Sidebar = () => {
    const {data: session} = useSession()
    const router = useRouter();
  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
        <div className="flex items-center justify-center w-14 h-14 animateHover p-0 xl:ml-24">
            <Image src="https://rb.gy/ogau5a" width={30} height={30} alt="twitter-logo" />
        </div>
        <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
            <SidebarMenuItem Icon={RiHome7Fill} title="Home" active onClick={() => router.push("/")} />
            <SidebarMenuItem Icon={RiHashtag} title="Explore" />
            <SidebarMenuItem Icon={FaBell} title="Notifications" />
            <SidebarMenuItem Icon={BiEnvelope} title="Messages" />
            <SidebarMenuItem Icon={BsFillBookmarkFill} title="Bookmarks" />
            <SidebarMenuItem Icon={GoNote} title="Lists" />
            <SidebarMenuItem Icon={BiUser} title="Profile" />
            <SidebarMenuItem Icon={CgMoreO} title="More" />
        </div>
        <button className="hidden xl:inline ml-auto text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1C9AF8] bg-[#1C9AF0]">Tweet</button>
        <div className="text-[#d9d9d9] flex items-center justify-center animateHover xl:ml-auto mt-auto" onClick={() => signOut()}>
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img src={session?.user.image} 
            alt="User Image" className="h-10 w-10 rounded-full xl:mr-2.5 border border-gray-700" />
            <div className="hidden xl:inline leading-5">
                <h4 className="font-bold">{session?.user.name}</h4>
                <p className="text-[#6e767d]">@{session?.user.tag}</p>
            </div>
            <FiMoreHorizontal className="h-5 hidden xl:inline ml-10 text-white" />
        </div>
    </div>
  )
}

export default Sidebar