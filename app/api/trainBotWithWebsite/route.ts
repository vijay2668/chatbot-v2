
import { modifyBot } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!profile?.user_key)
      return new NextResponse("openai api key not found", { status: 402 });

    const { websiteURLs, assistantId, sources } = await req.json();

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
      openAIAPIkey: atob(profile.user_key),
      websiteURLs: websiteURLs
    });

    let existingFileIDs = []

    for (let source of sources) {
      existingFileIDs.push(source.id)
    }

    // got all fileIDs from backend
    let fileIDs: string[] = [...res?.data, ...existingFileIDs];

    console.log("step 2:", fileIDs);

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
