import { Inbox } from "@/components/routes/inbox";
import { getMessages } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ChatbotIdPageProps {
  params: {
    id: string;
  };
}

const InboxPage = async ({ params }: ChatbotIdPageProps) => {
  const profile = await currentProfile();

  if (!profile?.user_key) return;

  const chatbotUI = await db.chatbot.findUnique({
    where: {
      id: params.id
    },
    include: {
      messages_list: true
    }
  });

  if (!chatbotUI) return;

  let messages_list = [];

  for (let messages of chatbotUI.messages_list) {
    const getMessages = await db.messages.findUnique({
      where: {
        id: messages.id
      },
      include: {
        messages: true
      }
    });

    messages_list.push(getMessages);
  }

  messages_list.sort((a: any, b: any) => b?.createdAt - a?.createdAt);

  return (
    <div className="flex flex-col w-full h-full p-8">
      <Inbox messages_list={messages_list} chatbotUI={chatbotUI} />
    </div>
  );
};

export default InboxPage;
