import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { chatbotId, thread_id } = await req.json();

    const saveThread = await db.thread.create({
      data: {
        chatbotId,
        thread_id
      }
    });

    return NextResponse.json(saveThread);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
