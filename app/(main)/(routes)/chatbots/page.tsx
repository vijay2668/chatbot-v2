import { ChatbotList } from "@/components/chatbot-list";
import { getAssistants } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";

const ChatBotsPage = async () => {
  const profile = await currentProfile();
  if (!profile?.user_key) return;

  const assistants = await getAssistants(atob(profile.user_key));

  if (!assistants) return;

  return (
    <div className="h-full overflow-hidden w-full">
      <div className="z-10 m-4 bg-white md:m-8 space-y-4 h-full overflow-hidden">
        <ChatbotList user={profile} chatbots={assistants} />
      </div>
    </div>
  );
};

export default ChatBotsPage;
