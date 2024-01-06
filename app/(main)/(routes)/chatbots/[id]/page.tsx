import { ChatbotDemoPage } from "@/components/chatbot-demo";
import { createThread, getAssistant } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { Chatbot } from "@prisma/client";

interface ChatbotIdPageProps {
  params: {
    id: string;
  };
}

const ChatbotIdPage = async ({ params }: ChatbotIdPageProps) => {
  const profile = await currentProfile();

  if (!profile?.user_key) return;

  const find_choosen_chatbot_ui = (choosen_id: string) => {
    const finded = profile.chatbots.find(
      (chatbot: Chatbot) => chatbot.id === choosen_id
    );

    return finded?.bot_id;
  };

  const bot_id: any = find_choosen_chatbot_ui(params?.id);

  if (!bot_id) return;

  const assistant = await getAssistant(atob(profile?.user_key), bot_id);

  if (!assistant) return;

  // console.log("assistant", assistant);

  const chatbotUI = profile?.chatbots?.find(
    (item: Chatbot) => item.id === params?.id
  );

  if (!chatbotUI) return;

  // console.log("chatbotUI", chatbotUI);

  const thread = await createThread(atob(profile?.user_key));
  if (!thread) return;

  // console.log("thread", thread);

  return (
    <div className="flex flex-col w-full h-full p-4">
      <ChatbotDemoPage
        chatbotUI={chatbotUI}
        assistant={assistant}
        thread={thread}
      />
    </div>
  );
};

export default ChatbotIdPage;
