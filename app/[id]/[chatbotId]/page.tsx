import { ChatbotDemoPage } from "@/components/chatbot-demo";
import { createThread, getAssistant } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { Chatbot } from "@prisma/client";

interface ChatbotIdPageProps {
  params: {
    chatbotId: string;
  };
}

const ChatbotIdPage = async ({ params }: ChatbotIdPageProps) => {
  const profile = await currentProfile();

  if (!profile?.user_key) return;

  const assistant = await getAssistant(
    atob(profile?.user_key),
    params?.chatbotId
  );

  if (!assistant) return;

  // console.log("assistant", assistant);

  const chatbotUI = profile?.chatbots?.find(
    (item: Chatbot) => item.bot_id === params?.chatbotId
  );

  if (!chatbotUI) return;

  // console.log("chatbotUI", chatbotUI);

  const thread = await createThread(atob(profile?.user_key));
  if (!thread) return;

  // console.log("thread", thread);

  return (
    <ChatbotDemoPage
      chatbotUI={chatbotUI}
      assistant={assistant}
      thread={thread}
    />
  );
};

export default ChatbotIdPage;
