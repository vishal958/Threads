import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";

interface Props {
  searchParams: { content: string }
}
const CreateThread = async ({ searchParams }: Props) => {

  const content = searchParams?.content
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className='head-text'>{content ? 'Repost Thread' : 'Create Thread'}</h1>
      <PostThread userId={userInfo._id} content={content} />
    </>
  );
}

export default CreateThread;