import Sources from "@/components/routes/sources";
import { fileRetrieve, getAssistant } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Chatbot } from "@prisma/client";

interface ChatbotIdPageProps {
  params: {
    id: string;
  };
}
const SourcesPage = async ({ params }: ChatbotIdPageProps) => {
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

  let sources = [];

  for (let file of assistant?.file_ids) {
    const f = await fileRetrieve(file, atob(profile?.user_key));
    sources.push(f);
  }

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
    <Sources
      user={profile}
      chatbotUI={chatbotUI}
      assistant={assistant}
      sources={sources}
    />
  );
};

export default SourcesPage;
