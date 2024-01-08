import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { question, answer, chatbotId } = await req.json();

    const faq = await db.fAQ.create({
      data: {
        question,
        answer,
        chatbotId,
      }
    })

    return NextResponse.json(faq);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
