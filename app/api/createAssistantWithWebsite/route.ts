import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import axios from "axios";
import { currentProfile } from "@/lib/current-profile";
import OpenAI from "openai";
import { createAssistant } from "@/lib/OpenAI";

export async function POST(req: Request) {
  const profile = await currentProfile();

  try {
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { websiteURLs, chatbotName, chatbotInstructions, openAIAPIkey } =
      await req.json();

    console.log("openAIAPIkey", openAIAPIkey);

    if (websiteURLs.length === 0) {
      return new NextResponse("website urls not found", {
        status: 400
      });
    }

    // got all sublinks
    console.log("step 1:", websiteURLs);

    let BACKEND_URL = process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return new NextResponse("Backend url not found", {
        status: 400
      });
    }

    // sending sublinks and openai API key for generating fileIDs of all links
    const res = await axios.post(BACKEND_URL, {
      openAIAPIkey: openAIAPIkey,
      websiteURLs: websiteURLs
    });

    // got all fileIDs from backend
    let fileIDs: string[] = res?.data;

    console.log("step 2:", fileIDs);

    const assistant = await createAssistant({
      chatbotName,
      chatbotInstructions,
      fileIDs,
      openAIAPIkey
    });

    console.log("step 3:", assistant);

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

    console.log("step 5:", response);
    return NextResponse.json({ response: response, assistant: assistant });
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
