import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }
  
  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
    include:{
      chatbots: true
    }
  });

  if (!profile) {
    await db.profile.create({
      data: {
        userId,
      },
    });
    redirect('/dashboard');
  }

  return profile;
};
