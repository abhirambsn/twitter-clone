import { getProviders, getSession } from 'next-auth/react'
import Head from 'next/head'
import Feed from '../components/Feed'
import Login from '../components/Login'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import { useRecoilState } from 'recoil'
import { modalAtom } from '../atoms/modalAtom'
import Widgets from '../components/Widgets'

export default function Home({trendingTweets, followTweets, providers, sessionData}) {
  const [isOpen, setIsOpen] = useRecoilState(modalAtom);
  if (!sessionData) return <Login providers={providers} />
  return (
    <div>
      <Head>
        <title>Twitter Clone</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex min-h-screen mx-auto bg-black max-w-screen'>
        <Sidebar />
        <Feed />
        <Widgets trendingTweets={trendingTweets} followTweets={followTweets} />
        {isOpen && <Modal />}
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const trendingTweets = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followTweets = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );
  const providers = await getProviders();
  const sessionData = await getSession(context);
  return {
    props: {
      trendingTweets,
      followTweets,
      providers,
      sessionData
    }
  }
}