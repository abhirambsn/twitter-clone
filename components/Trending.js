import Image from "next/image";
import { BiDotsHorizontal } from 'react-icons/bi'

const Trending = ({tweet}) => {
  return (
    <div className='hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 
    cursor-pointer transition-all duration-200 ease-out flex items-center justify-between'>
        <div className='space-y-0.5'>
            <p className='text-[#6e767d] text-xs font-medium'>{tweet?.heading}</p>
            <h6 className='font-bold max-w-[250px] text-sm'>{tweet?.description}</h6>
            <p className='text-[#6e767d] text-xs font-medium max-w-[250px]'>
                Trending With {tweet?.tags?.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </p>
        </div>

        {tweet?.img ? (
            <Image 
                src={tweet?.img}
                width={70}
                height={70}
                objectFit="cover"
                className="rounded-2xl" 
            />
        ) : (
            <div className="icon group">
                <BiDotsHorizontal className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
            </div>
        )}
    </div>
  )
}

export default Trending