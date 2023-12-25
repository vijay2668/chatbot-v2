import { ChatBot } from "@/components/chatbot";
import { ChatbotDemoPage } from "@/components/chatbot-demo";
import { currentProfile } from "@/lib/current-profile";

interface ChatbotIdPageProps {
  params: {
    chatbotId: string;
  };
}

const ChatbotIdPage = async ({ params }: ChatbotIdPageProps) => {
  const profile = await currentProfile();

  return <ChatbotDemoPage params={params} user={profile} />;
};

export default ChatbotIdPage;
