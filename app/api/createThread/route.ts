import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { createThread } from "@/lib/OpenAI";

export async function GET() {
  const profile = await currentProfile();

  try {
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const thread = await createThread(profile?.openAIAPIkey);

    return NextResponse.json(thread);
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
