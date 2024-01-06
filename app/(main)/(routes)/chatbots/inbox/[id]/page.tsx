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
      threads: true
    }
  });

  if (!chatbotUI) return;

  let list_of_thread_from_current_bot = [];

  for (let thread of chatbotUI.threads) {
    const current_thread = await getMessages(
      thread.thread_id,
      atob(profile.user_key)
    );
    console.log("current_thread", current_thread)
    list_of_thread_from_current_bot.push(current_thread.data);
  }

  if (!list_of_thread_from_current_bot) return;

  return (
    <div className="flex flex-col w-full h-full p-8">
      <Inbox
        list_of_thread_from_current_bot={list_of_thread_from_current_bot}
      />
    </div>
  );
};

export default InboxPage;
