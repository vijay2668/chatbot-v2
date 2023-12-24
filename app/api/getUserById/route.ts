import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  try {
    if (!id) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.profile.findUnique({
      where: {
        id
      },
      include: {
        chatbots: true
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
