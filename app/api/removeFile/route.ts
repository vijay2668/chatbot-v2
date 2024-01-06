import { removeFile, removeFileFromBot } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!profile?.user_key) {
      return new NextResponse("openai api key not found", { status: 402 });
    }

    const { sourceId, assistantId } = await req.json();

    const deleteFile = await removeFile(sourceId, atob(profile.user_key))
    console.log(deleteFile)
    
    const deletedFileFromBot = await removeFileFromBot(sourceId, assistantId, atob(profile.user_key));
    console.log(deletedFileFromBot)

    return NextResponse.json(deletedFileFromBot);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
