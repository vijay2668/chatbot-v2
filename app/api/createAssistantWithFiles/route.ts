import { UploadFile, createAssistant } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import axios from "axios";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();

    const files: any = formData.getAll("files");
    const chatbotName: any = formData.get("chatbotName");
    const chatbotInstructions: any = formData.get("chatbotInstructions");
    const openAIAPIkey: any = formData.get("openAIAPIkey");

    console.log("openAIAPIkey", openAIAPIkey);

    let fileIDs: any = [];

    for (let file of files) {
      const res = await UploadFile(file, openAIAPIkey);
      fileIDs.push(res.id);
    }

    console.log("fileIDs", fileIDs);

    const assistant = await createAssistant({
      chatbotName,
      chatbotInstructions,
      fileIDs,
      openAIAPIkey
    });

    console.log("assistant", assistant);
    const response = await db.profile.update({
      where: { id: profile.id },
      data: {
        openAIAPIkey: openAIAPIkey
      }
    });

    const bot_ui_data = {
      bot_id: assistant?.id,
      bot_name: "New Bot",
      company_name: "",
      description: "",
      company_logo: "",
      bot_avatar: "",
      chat_bubble_icon: "",
      accent_colour: "#6366f1",
      subheading: "Our bot answers instantly",
      welcome_message: "Hey there, how can I help you?",
      input_box_placeholder: "Send a message...",
      botsonic_branding_on_the_widget: "show",
      widget_position: "right",
      show_sources_with_the_response: "show",
      post_chat_feedback: "show",
      widget: "open",
      show_floating_welcome_message: false,
      show_floating_starter_questions: false
    };

    await axios.post("/api/createChatbotUI", bot_ui_data);

    console.log("response", response);
    return NextResponse.json({ response: response, assistant: assistant });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
