import { UploadFile, modifyBot } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!profile?.user_key)
      return new NextResponse("openai api key not found", { status: 402 });

    const formData = await req.formData();

    const files: any = formData.getAll("files");
    const assistantId: any = formData.get("assistantId");
    const sources: any = formData.get("sources");

    let fileIDs: any = [];

    for (let file of files) {
      const res = await UploadFile(file, atob(profile.user_key));
      fileIDs.push(res.id);
    }


    let existingFileIDs = []

    for (let source of sources) {
      existingFileIDs.push(source.id)
    }

    // got all fileIDs from backend
    fileIDs = [...fileIDs, ...existingFileIDs];

    console.log("fileIDs", fileIDs);

    const assistant = await modifyBot({
      assistantId,
      fileIDs,
      openAIAPIkey: atob(profile.user_key)
    });

    console.log("modified", assistant);

    return NextResponse.json({ modifiedbot: assistant });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
