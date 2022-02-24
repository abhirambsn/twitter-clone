import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { commentModalAtom, modalAtom } from "../../atoms/modalAtom";
import { getSession, getProviders } from "next-auth/react";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase";
import Login from "../../components/Login";
import Modal from "../../components/Modal";
import { BsArrowLeft } from "react-icons/bs";
import Tweet from "../../components/Tweet";
import Comment from "../../components/Comment";
import { BiDotsHorizontal } from "react-icons/bi";
import Widgets from "../../components/Widgets";
import CommentModal from "../../components/CommentModal";

const TweetPage = ({
  trendingTweets,
  followTweets,
  providers,
  sessionData,
}) => {
  const [isOpen, setIsOpen] = useRecoilState(modalAtom);
  const { data: session } = useSession();
  const [tweet, setTweet] = useState();
  const [comments, setComments] = useState([]);
  const [isCommentModalOpen, setIsCommentModalOpen] = useRecoilState(commentModalAtom);
  const router = useRouter();
  const { id } = router.query;

  useEffect(
    () =>
      onSnapshot(doc(db, "tweets", id), (snapshot) => {
        setTweet(snapshot.data());
      }),
    [id]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "tweets", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [id]
  );
  if (!sessionData) return <Login providers={providers} />;
  return (
    <div>
      <Head>
        <title>
          {tweet?.username} | {tweet?.tweet}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-screen mx-auto">
        <Sidebar />
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div
            className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl
                gap-x-4 sticky top-0 z-50 bg-black"
          >
            <div
              className="animateHover w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <BsArrowLeft className="h-5 text-white" />
            </div>
            Tweet
          </div>
          <Tweet id={id} tweet={tweet} tweetPage />
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                  <>
                <Comment
                  key={comment.id}
                  id={comment.id}
                  tweetId={id}
                  comment={comment.data()}
                />
                </>
              ))}
            </div>
          )}
        </div>
        <div className="icon group flex-shrink-0 ml-auto">
          <BiDotsHorizontal className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
        </div>
        <Widgets trendingTweets={trendingTweets} followTweets={followTweets} />
        {isOpen && <Modal />}
        {isCommentModalOpen && <CommentModal tweetId={id} />}
      </main>
    </div>
  );
};

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
      sessionData,
    },
  };
}

export default TweetPage;
