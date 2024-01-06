import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import axios from "axios";
import { currentProfile } from "@/lib/current-profile";
import { createAssistant } from "@/lib/OpenAI";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { websiteURLs, chatbotName, chatbotInstructions, openAIAPIkey } =
      await req.json();

    let encodedopenAIAPIkey = btoa(openAIAPIkey);

    console.log("encodedopenAIAPIkey", encodedopenAIAPIkey);

    if (websiteURLs.length === 0) {
      return new NextResponse("website urls not found", {
        status: 400
      });
    }

    // got all sublinks
    console.log("step 1:", websiteURLs);

    let BACKEND_URL = process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return new NextResponse("Backend url not found", {
        status: 400
      });
    }

    // sending sublinks and openai API key for generating fileIDs of all links
    const res = await axios.post(BACKEND_URL, {
      openAIAPIkey: openAIAPIkey,
      websiteURLs: websiteURLs
    });

    // got all fileIDs from backend
    let fileIDs: string[] = res?.data;

    console.log("step 2:", fileIDs);

    const default_prompt =
      "You are a helpful customer support chatbot. You are able to answer questions about the website and it's context. You are also able to answer questions about the website. Refuse any answer that does not have to do with the website or its content. Provide short, concise answers.";

    const assistant = await createAssistant({
      chatbotName,
      chatbotInstructions:
        !chatbotInstructions || chatbotInstructions === ""
          ? default_prompt
          : chatbotInstructions,
      fileIDs,
      openAIAPIkey
    });

    console.log("step 3:", assistant);

    const response = await db.profile.update({
      where: { id: profile.id },
      data: {
        user_key: encodedopenAIAPIkey
      }
    });

    console.log("step 5:", response);
    return NextResponse.json({ response: response, assistant: assistant });
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
