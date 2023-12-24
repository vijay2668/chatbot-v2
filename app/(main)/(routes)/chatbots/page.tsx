import { ChatbotList } from "@/components/chatbot-list";
import { Label } from "@/components/ui/label";
import { currentProfile } from "@/lib/current-profile";

const ChatBotsPage = async () => {
  const profile = await currentProfile();

  return (
    <div className="h-full overflow-hidden w-full">
      <div className="z-10 m-4 bg-white md:m-8 space-y-4 h-full overflow-hidden">
        <ChatbotList user={profile} />
      </div>
    </div>
  );
};

export default ChatBotsPage;
