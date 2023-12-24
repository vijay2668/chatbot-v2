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

    const id: string = formData?.id;

    const {
      bot_name,
      company_name,
      description,
      company_logo,
      bot_avatar,
      chat_bubble_icon,
      accent_colour,
      subheading,
      welcome_message,
      input_box_placeholder,
      botsonic_branding_on_the_widget,
      widget_position,
      show_sources_with_the_response,
      post_chat_feedback,
      widget,
      show_floating_welcome_message,
      show_floating_starter_questions
    } = formData;

    const res = await db.chatbot.update({
      where: {
        id
      },
      data: {
        bot_name,
        company_name,
        description,
        company_logo,
        bot_avatar,
        chat_bubble_icon,
        accent_colour,
        subheading,
        welcome_message,
        input_box_placeholder,
        botsonic_branding_on_the_widget,
        widget_position,
        show_sources_with_the_response,
        post_chat_feedback,
        widget,
        show_floating_welcome_message,
        show_floating_starter_questions
      }
    });
    console.log(res);

    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
