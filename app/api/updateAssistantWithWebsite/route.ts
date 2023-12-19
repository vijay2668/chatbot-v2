import { NextResponse } from "next/server";
import axios from "axios";
import { currentProfile } from "@/lib/current-profile";
import { modifyAssistant } from "@/lib/OpenAI";

export async function POST(req: Request) {
  const profile = await currentProfile();

  try {
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { assistantId, websiteURLs, chatbotName, chatbotInstructions } =
      await req.json();

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
      openAIAPIkey: profile?.openAIAPIkey,
      websiteURLs: websiteURLs
    });

    // got all fileIDs from backend
    let fileIDs: string[] = res?.data;

    console.log("step 2:", fileIDs);

    const assistant = await modifyAssistant({
      assistantId,
      chatbotName,
      chatbotInstructions,
      fileIDs,
      openAIAPIkey: profile?.openAIAPIkey
    });

    console.log("step 3:", assistant);

    return NextResponse.json({ assistant: assistant });
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
