import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId
    },
    include: {
      chatbots: true
    }
  });

  if (!profile) {
    redirect("/");
  }

  return profile;
};
