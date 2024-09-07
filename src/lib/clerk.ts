import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export const getUser = async () => {
  const { userId } = auth();
  if (!userId) return null;
  return await clerkClient.users.getUser(userId);
};
