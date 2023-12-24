import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.json(); // Use req.json() directly

    const res = await db.chatbot.create({
      data: {
        profileId: profile.id,
        ...formData
      }
    });
    console.log(res);

    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
