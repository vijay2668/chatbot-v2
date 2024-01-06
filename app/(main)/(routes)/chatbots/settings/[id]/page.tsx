import Settings from "@/components/routes/settings";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import React from "react";

interface ChatbotIdPageProps {
  params: {
    id: string;
  };
}

const SettingPage = async ({ params }: ChatbotIdPageProps) => {
  const profile = await currentProfile();

  if (!profile?.user_key) return;

  const chatbotUI = await db.chatbot.findUnique({
    where: {
      id: params.id
    },
    include: {
      threads: true,
      faqs: true,
      fields: true,
      starter_questions: true
    }
  });

  if (!chatbotUI) return;

  return <Settings chatbotUI={chatbotUI} user={profile} />;
};

export default SettingPage;
