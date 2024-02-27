"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MentionsInput, Mention } from 'react-mentions';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { ChangeEvent, useState } from "react";
import { fetchUsers } from "@/lib/actions/user.actions";
import { swapTags } from "@/lib/utils";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
  clerkUserId: string
}

function Comment({ threadId, currentUserImg, currentUserId, clerkUserId }: Props) {
  const pathname = usePathname();
  const [users, setUsers] = useState([]);

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const handleChange = (_event: Event, newValue: string) => {
    console.log(swapTags(newValue))
    form.setValue('thread', newValue); // Set the value for the 'content' field
  };

  const handleKeyUp = async (event: ChangeEvent<HTMLInputElement>) => {
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

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt='current_user'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              {/* <FormControl className='border-none bg-transparent'> */}
                <MentionsInput
                  className='mentions'
                  {...field}
                  onChange={handleChange}
                  appendSpaceOnAdd
                  // rows={5}
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
              {/* </FormControl> */}
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;