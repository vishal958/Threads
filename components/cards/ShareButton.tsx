'use client'
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  threadId: string,
  threadText: string,
}

const ShareButton = ({ threadId, threadText }: Props) => {
  const [isWebShareSupported, setIsWebShareSupported] = useState(typeof navigator.share === 'function');
  const shareUrl = `${window.location.origin}/thread/${threadId}`;

  const handleShareClick = async () => {
    try {
      await navigator.share({
        title: 'Tweet Share',
        text: threadText,
        url: shareUrl,
      });
    } catch (error: any) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <>
      {isWebShareSupported ? (
        <Image
          onClick={handleShareClick}
          src='/assets/share.svg'
          alt='heart'
          width={24}
          height={24}
          className='cursor-pointer object-contain'
        />

      ) : (
        <p>Web Share API is not supported on this browser.</p>
      )}
    </>
  );
};

export default ShareButton;
