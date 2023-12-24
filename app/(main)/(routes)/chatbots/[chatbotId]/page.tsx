import { ChatBot } from "@/components/chatbot";
import { currentProfile } from "@/lib/current-profile";

interface ChatbotIdPageProps {
  params: {
    chatbotId: string;
  };
}

const ChatbotIdPage = async ({ params }: ChatbotIdPageProps) => {
  const profile = await currentProfile();

  return <ChatBot chatbotId={params?.chatbotId} user={profile} />;
};

export default ChatbotIdPage;
