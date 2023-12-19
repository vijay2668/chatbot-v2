import { UploadFile, modifyAssistant } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();

    const files: any = formData.getAll("files");
    const file_ids: any = formData.getAll("file_ids");

    const assistantId: any = formData.get("assistantId");
    const chatbotName: any = formData.get("chatbotName");
    const chatbotInstructions: any = formData.get("chatbotInstructions");

    let fileIDs: any = [];

    for (let file of files) {
      const res = await UploadFile(file, profile?.openAIAPIkey);
      fileIDs.push(res.id);
    }

    const assistant = await modifyAssistant({
      assistantId,
      chatbotName,
      chatbotInstructions,
      fileIDs: file_ids ? [...fileIDs, ...file_ids] : fileIDs,
      openAIAPIkey: profile?.openAIAPIkey
    });

    console.log("fileIDs", file_ids ? [...fileIDs, ...file_ids] : fileIDs);
    console.log("updated assistant", assistant);

    return NextResponse.json(assistant);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
