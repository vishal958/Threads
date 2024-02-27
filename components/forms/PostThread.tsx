'use client'

import React, { ChangeEvent, useState } from 'react'
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { MentionsInput, Mention } from 'react-mentions';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { swapTags } from '@/lib/utils';
import { fetchUsers } from '@/lib/actions/user.actions';

interface Props {
  userId: string;
  content: string,
  clerkUserId: string,
}


const PostThread = ({ userId, content, clerkUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState([]);

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: content || "",
      accountId: userId
    },
  });

  const handleChange = (_event: Event, newValue: string) => {
    form.setValue('thread', newValue); // Set the value for the 'content' field
  };

  const handleKeyUp = async (event:  ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const cursorIndex = event.target?.selectionStart;
    if (cursorIndex && cursorIndex >= 0 && cursorIndex <= query.length) {
      const updatedQuery = query.substring(0, cursorIndex);
      const splitString = updatedQuery.split('@');

      if (
        splitString.length > 1 &&
        splitString[splitString.length - 1].length > 0
      ) {
        const queryString = splitString[splitString.length - 1]
        const users = await fetchUsers({
          userId: clerkUserId,
          searchString: queryString,
          pageNumber: 1,
          pageSize: 25,
        })
        const filteredUser: any = users?.users.map((e) => ({ _id: e?.id, name: e?.name }))
        setUsers(filteredUser)
      }
    }
  };

  const userMentionData: { id: string, display: string }[] = users.map((myUser: { _id: string, name: string }) => ({
    id: myUser._id,
    display: myUser?.name,
  }));

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: swapTags(values?.thread)?.displayText,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
      mentions: swapTags(values?.thread)?.mentions
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <MentionsInput
                className='mentions'
                {...field}
                onChange={handleChange}
                appendSpaceOnAdd
                rows={5}
                placeholder="Type anything, use the @ symbol to tag other users."
                onKeyUp={handleKeyUp}
                markup="@{{__type__||__id__||__display__}}"
              >
                <Mention
                  type="user"
                  markup="@{{__type__||__id__||__display__}}"
                  trigger="@"
                  data={userMentionData}
                  className="mentions__mention"
                />
              </MentionsInput>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>
          {content ? 'Repost Thread' : 'Post Thread'}
        </Button>
      </form>
    </Form>
  );
}

export default PostThread