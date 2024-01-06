import { deleteAssistant, removeFile } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!profile?.user_key) {
      return new NextResponse("openai api key not found", { status: 402 });
    }

    const { assistant } = await req.json();


    for (let file_id of assistant.file_ids) {
      const deleteFile = await removeFile(file_id, atob(profile.user_key))
      console.log(deleteFile)
    }

    const deletedAssistant = await deleteAssistant(atob(profile.user_key), assistant.id);

    console.log(deletedAssistant)

    await db.chatbot.deleteMany({
      where: {
        bot_id: assistant?.id
      },
    });

    return NextResponse.json(deletedAssistant);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
