import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { getAssistants } from "@/lib/OpenAI";

export async function GET() {
  const profile = await currentProfile();

  try {
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!profile?.user_key) return new NextResponse("openai api key not found", { status: 402 });

    const assistants = await getAssistants(atob(profile?.user_key));

    console.log("assistants-list", assistants);
    return NextResponse.json(assistants);
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
