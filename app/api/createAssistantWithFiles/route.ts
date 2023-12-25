import { UploadFile, createAssistant } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import axios from "axios";
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
    const chatbotName: any = formData.get("chatbotName");
    const chatbotInstructions: any = formData.get("chatbotInstructions");
    const openAIAPIkey: any = formData.get("openAIAPIkey");

    console.log("openAIAPIkey", openAIAPIkey);

    let fileIDs: any = [];

    for (let file of files) {
      const res = await UploadFile(file, openAIAPIkey);
      fileIDs.push(res.id);
    }

    console.log("fileIDs", fileIDs);

    const default_prompt =
      "You are a helpful customer support chatbot. You are able to answer questions about the files and it's context. You are also able to answer questions about the files. Refuse any answer that does not have to do with the files or its content. Provide short, concise answers.";

    const assistant = await createAssistant({
      chatbotName,
      chatbotInstructions:
        !chatbotInstructions || chatbotInstructions === ""
          ? default_prompt
          : chatbotInstructions,
      fileIDs,
      openAIAPIkey
    });

    console.log("assistant", assistant);
    const response = await db.profile.update({
      where: { id: profile.id },
      data: {
        openAIAPIkey: openAIAPIkey
      }
    });

    console.log("response", response);
    return NextResponse.json({ response: response, assistant: assistant });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
