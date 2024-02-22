'use client'

import Image from "next/image"
import { addLikeToThread } from "@/lib/actions/thread.actions";
import React from "react";

interface Props {
  userId: string;
  threadId: string,
  hasCurrentUserLiked: boolean,
  totalLikes: number,
}

const Like = ({ userId, threadId, hasCurrentUserLiked, totalLikes }: Props) => {
  const [likesCount, setLikesCount] = React.useState(totalLikes || 0)
  const [hasLiked, sethasLiked] = React.useState(hasCurrentUserLiked)

  const handler = async () => {
    setLikesCount((prev: number) => {
      return !hasLiked ? ++prev : --prev
    })
    sethasLiked(!hasLiked)
    await addLikeToThread(threadId, userId);
  };

  return (
    <>
      <Image
        src={hasLiked ? '/assets/heart-filled.svg/' : '/assets/heart-gray.svg'}
        alt='heart'
        width={24}
        height={24}
        onClick={handler}
        className='cursor-pointer object-contain'
      />
      <span className='text-base-semibold text-light-1'>
        {likesCount}
      </span>
    </>

  )
}

export default Like