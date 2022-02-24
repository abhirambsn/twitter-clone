import {signIn} from "next-auth/react"
import {BsGoogle} from 'react-icons/bs'
import Image from "next/image";
import Head from "next/head";


const Login = ({providers}) => {
  return (
    <div className="flex flex-col space-x-8 space-y-4 md:flex-row">
        <Head>
            <title>Twitter Clone | Login</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col items-center justify-center bg-[#1c9af8] h-screen w-full">
            <Image src="https://rb.gy/ogau5a" width={350} height={350} alt="twitter-logo" />
        </div>
        <div className="justify-between flex-grow w-full h-screen bg-black">
            <Image src="https://rb.gy/ogau5a" width={60} height={60} alt="twitter-logo" />
            <div className="h-20"></div>
            <h1 className="font-bold text-white text-7xl">Happening Now</h1>
            <div className="h-10"></div>
            <h1 className="text-3xl font-bold tracking-wide text-white">Join Twitter today.</h1>
            <div className="h-10"></div>
            <div className="flex flex-col space-y-10 divide-y divide-gray-400">
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