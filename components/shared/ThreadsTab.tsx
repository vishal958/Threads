import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts, getUserReplies } from "@/lib/actions/user.actions";

import ThreadCard from "../cards/ThreadCard";

interface Result {
  name: string,
  id: string,
  image: string,
  likes: number,
  _id: string;
  text: string;
  parentId: string | null;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  children: [{
    author: {
      image: string;
    };
  }]
}

interface Props {
  currentUserId: string;
  userInfo: any;
  accountType: string;
  value: string,
  communityId: string,
}

async function ThreadsTab({ currentUserId, userInfo, accountType, value, communityId}: Props) {
  let result: Result[];
  const accountId = userInfo._id
  if (value === 'threads') {
    if (accountType === "Community") {
      result = (await fetchCommunityPosts(communityId))?.threads;
    } else {
      result = (await fetchUserPosts(accountId))?.threads;
    }
  } else if (value === "replies") {
    result = await getUserReplies(accountId)
  }

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result?.map((thread: Result) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: thread.author.name, image: thread.author.image, id: thread.author.name }
              : {
                name: thread.author.name,
                image: thread.author.image,
                id: thread.author.id,
              }
          }
          community={
            accountType === "Community"
              ? { name: thread.author.name, id: thread.author.name, image: thread.author.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children}
          totalLikes={thread?.likes}
          hasCurrentUserLiked={userInfo?.likedTweets?.includes(thread._id)}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;