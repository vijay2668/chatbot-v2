import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { starter_question_id } = await req.json();

    const sq = await db.sQ.delete({
      where: {
        id: starter_question_id,
      }
    })

    return NextResponse.json(sq);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
