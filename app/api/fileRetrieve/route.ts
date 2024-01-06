import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { fileRetrieve } from "@/lib/OpenAI";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    
    if (!profile?.user_key) {
      return new NextResponse("openai api key not found", { status: 402 });
    }

    const { file_ids } = await req.json();

    const file = await fileRetrieve(
      file_ids?.[0],
      atob(profile?.user_key)
    );

    return NextResponse.json(file);
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
