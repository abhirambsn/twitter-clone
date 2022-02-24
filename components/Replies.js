import React from 'react'
import Reply from './Reply'

const Replies = ({replies, id, tweetId}) => {
  return (
    <div>{replies.map(reply => (<Reply id={reply.id} key={reply.id} commentId={id} tweetId={tweetId} comment={reply.data()} />))}</div>
  )
}

export default Replies