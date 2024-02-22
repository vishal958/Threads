"use server";
import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";

export async function getActivity(userId: string) {
  connectToDB();
  try {
    const user = await User.findById(userId)
      .populate({
        path: "activities",
        populate: [
          {
            path: "user",
            model: User,
            select: "_id name image ",
          },
          {
            path: "thread",
            model: Thread,
            select: "_id",
          }
        ],
      })
    const userActivities = user?.activities;
    return userActivities.sort((a: any, b: any) => b.timestamp - a.timestamp)
  } catch (err) {
    console.error("Error while fetching activity:", err);
    throw new Error("Unable to Get Activity");
  }
}