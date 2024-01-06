import { renameBot } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!profile.user_key)
      return new NextResponse("open ai api key not found", { status: 402 });

    const { chatbotName, assistantId } = await req.json();

    const assistant = await renameBot({
      chatbotName,
      assistantId,
      openAIAPIkey: atob(profile?.user_key)
    });

    console.log("renamedBot", assistant);

    const chatbot = await db.chatbot.updateMany({
      where: {
        bot_id: assistant.id
      },
      data: {
        bot_name: assistant.name
      }
    });

    console.log("chatbot", chatbot);

    return NextResponse.json({
      chatbot: chatbot,
      assistant: assistant
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
