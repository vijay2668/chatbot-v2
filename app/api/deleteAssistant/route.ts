import { deleteAssistant } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { assistantID } = await req.json();

    const assistant = await deleteAssistant(profile?.openAIAPIkey, assistantID);

    await db.chatbot.deleteMany({
      where: {
        bot_id: assistant?.id
      }
    });

    return NextResponse.json(assistant);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
