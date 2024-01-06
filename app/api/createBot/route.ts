import { UploadFile, createAssistant, createBot } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { chatbotName, openAIAPIkey } = await req.json();

    let encodedopenAIAPIkey = btoa(openAIAPIkey);

    console.log("encodedopenAIAPIkey", encodedopenAIAPIkey);

    let company_name = "Chatbot";
    let support_details =
      "If you are facing any issue then mail your issue @pilare9421@vasteron.com";
    let additional_guidelines =
      "Be polite and friendly. Don't use slang. Don't use emojis.";

    const support_bot_prompt = `You are ${chatbotName}, an AI assistant conversant ONLY in English, enthusiastic about representing and providing information about the company (if given) ${company_name} and its services you're designed to assist with.\nGiven the following extracted chunks from a long document, your task is to create a final, engaging answer in English. If an answer can't be found in the chunks, politely say that you don't know and offer to assist with anything else.\nIf you don't find an answer from the chunks, politely say that you don't know and ask if you can help with anything else. Don't try to make up an answer. Answer the user's query with more confidense.\nEnsure to not reference competitors while delivering responses.\n${support_details}\n\nYour goals are to:\nAnswer the user's query in short.\n- Show empathy towards user concerns, particularly related to the services you represent, referring to the company in first person terms, such as 'we' or 'us'.\n- Confirm resolution, express gratitude to the user, and close the conversation with a polite, positive sign-off when no more assistance is needed.\n- Format the answer to maximize readability using markdown format; use bullet points, paragraphs, and other formatting tools to make the answer easy to read.\n- Answer ONLY in English irrespective of user's conversation or language used in chunk.\n- Do NOT answer in any other language other than English.\n${additional_guidelines}\n\nHere's an example:\n===\nCONTEXT INFORMATION:\nCHUNK [1]: Our company offers a subscription-based music streaming service called 'MusicStreamPro.' We have two plans: Basic and Premium. The Basic plan costs $4.99 per month and offers ad-supported streaming, limited to 40 hours of streaming per month. The Premium plan costs $9.99 per month and offers ad-free streaming, unlimited streaming hours, and the ability to download songs for offline listening.\nCHUNK [2]: Not a relevant piece of information\n---\nQuestion: What is the cost of the Premium plan, and what features does it include?\n\nHelpful Answer:\nThe cost of the Premium plan is $9.99 per month. The features included in this plan are:\n- Ad-free streaming\n- Unlimited streaming hours\n- Ability to download songs for offline listening\n\nPlease let me know if there's anything else I can assist you with!`;

    const assistant = await createBot({
      chatbotName,
      chatbotInstructions: support_bot_prompt,
      openAIAPIkey
    });

    console.log("assistant", assistant);

    const user = await db.profile.update({
      where: { id: profile.id },
      data: {
        user_key: encodedopenAIAPIkey
      }
    });

    const bot_ui_data = {
      bot_id: assistant?.id,
      bot_name: chatbotName,
      company_name: "Chatbot",
      description: "",
      company_logo:
        "https://utfs.io/f/2092fc67-cb66-498b-aafe-adea4e250573-55pms0.svg",
      bot_avatar:
        "https://utfs.io/f/2092fc67-cb66-498b-aafe-adea4e250573-55pms0.svg",
      chat_bubble_icon:
        "https://utfs.io/f/2092fc67-cb66-498b-aafe-adea4e250573-55pms0.svg",
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
      show_floating_starter_questions: false,
      bot_template: "support",
      response_length: "short",
      is_gpt_4: false,
      bot_guidelines: additional_guidelines,
      messages_limit_per_day: 30,
      messages_limit_warning_message: "You've reached the message limit",
      messages_used: 0,
      show_user_form: false,
      files_not_uploaded_message: "The bot is yet to be trained, please add the data and train the bot."
    };

    const chatbot = await db.chatbot.create({
      data: {
        profileId: user.id,
        ...bot_ui_data
      }
    });

    const fields = await db.field.createMany({
      data: [
        {
          chatbotId: chatbot.id,
          label: "name",
          type: "text",
          is_required: true,
          placeholder: "Enter your Message"
        },
        {
          chatbotId: chatbot.id,
          label: "email",
          type: "email_id",
          is_required: true,
          placeholder: "Enter your Email-ID"
        }
      ]
    });

    console.log("user", user);
    console.log("chatbot", chatbot);
    console.log("fields", fields);

    return NextResponse.json({
      user: user,
      chatbot: chatbot,
      fields: fields,
      assistant: assistant
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
