import {signIn} from "next-auth/react"
import {BsGoogle} from 'react-icons/bs'
import Image from "next/image";


const Login = ({providers}) => {
  return (
    <div className="flex flex-col md:flex-row space-x-8 space-y-4">
        <div className="flex flex-col items-center justify-center bg-[#1c9af8] h-screen w-full">
            <Image src="https://rb.gy/ogau5a" width={350} height={350} alt="twitter-logo" />
        </div>
        <div className="bg-black flex-grow h-screen w-full justify-between">
            <Image src="https://rb.gy/ogau5a" width={60} height={60} alt="twitter-logo" />
            <div className="h-20"></div>
            <h1 className="text-7xl font-bold text-white">Happening Now</h1>
            <div className="h-10"></div>
            <h1 className="text-3xl font-bold text-white tracking-wide">Join Twitter today.</h1>
            <div className="h-10"></div>
            <div className="flex flex-col divide-y space-y-10 divide-gray-400">
            {Object.values(providers).map(provider => (
                <button key={provider.id} onClick={() => signIn(provider.id, {callbackUrl: '/'})} className="flex flex-row items-center justify-center bg-white p-2 rounded-full font-semibold space-x-4 w-[20rem]">
                    <BsGoogle size={20} />
                    <span>Sign up with {provider.name}</span>
                </button>
            ))}
            <button onClick={() => signIn('google')} className="flex flex-row items-center justify-center bg-[#1c9af8] p-2 rounded-full text-white font-semibold space-x-4 w-[20rem]">
                <span>Sign up with phone or email</span>
            </button>
            </div>
        </div>
    </div>
  )
}

export default Login