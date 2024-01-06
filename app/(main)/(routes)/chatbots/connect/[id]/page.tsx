import { Connect } from "@/components/routes/connect";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ChatbotIdPageProps {
  params: {
    id: string;
  };
}

const ConnectPage = async ({ params }: ChatbotIdPageProps) => {
  const profile = await currentProfile();

  if (!profile?.user_key) return;

  const chatbotUI = await db.chatbot.findUnique({
    where: {
      id: params.id
    },
    include: {
      threads: true
    }
  });

  if (!chatbotUI) return;

  return (
    <div className="flex flex-col w-full h-full p-8">
      <Connect object_id={chatbotUI?.id} />
    </div>
  );
};

export default ConnectPage;
