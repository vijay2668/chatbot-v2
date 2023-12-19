import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { getAssistants } from "@/lib/OpenAI";

export async function GET() {
  const profile = await currentProfile();

  try {
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const assistants = await getAssistants(profile?.openAIAPIkey);

    console.log("assistants-list", assistants);
    return NextResponse.json(assistants);
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
