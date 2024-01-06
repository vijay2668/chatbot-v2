import { getAssistant, modifyBotInstruction, modifyBotModel } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!profile?.user_key) return new NextResponse("openai api key not found", { status: 402 });


    const { id, values } = await req.json(); // Use req.json() directly

    const chatbotUI = await db.chatbot.update({
      where: {
        id
      },
      data: {
        ...values
      }
    });

    const assistant = await getAssistant(atob(profile.user_key), chatbotUI.bot_id)

    if (!assistant) return new NextResponse("assistant not found", { status: 402 });



    if (values.bot_template === "support" || chatbotUI.bot_template === "support") {
      let support_details = "If you are facing any issue then mail your issue @pilare9421@vasteron.com";

      const support_bot_prompt = `You are ${assistant.name}, an AI assistant conversant ONLY in English, enthusiastic about representing and providing information about the company (if given) ${values.company_name ? values.company_name : chatbotUI.company_name} and its services you're designed to assist with.\nGiven the following extracted chunks from a long document, your task is to create a final, engaging answer in English. If an answer can't be found in the chunks, politely say that you don't know and offer to assist with anything else.\nIf you don't find an answer from the chunks, politely say that you don't know and ask if you can help with anything else. Don't try to make up an answer. Answer the user's query with more confidense.\nEnsure to not reference competitors while delivering responses.\n${support_details}\n\nYour goals are to:\nAnswer the user's query in ${values.response_length ? values.response_length : chatbotUI.response_length}.\n- Show empathy towards user concerns, particularly related to the services you represent, referring to the company in first person terms, such as 'we' or 'us'.\n- Confirm resolution, express gratitude to the user, and close the conversation with a polite, positive sign-off when no more assistance is needed.\n- Format the answer to maximize readability using markdown format; use bullet points, paragraphs, and other formatting tools to make the answer easy to read.\n- Answer ONLY in English irrespective of user's conversation or language used in chunk.\n- Do NOT answer in any other language other than English.\n${values.bot_guidelines ? values.bot_guidelines : chatbotUI.bot_guidelines}\n\nHere's an example:\n===\nCONTEXT INFORMATION:\nCHUNK [1]: Our company offers a subscription-based music streaming service called 'MusicStreamPro.' We have two plans: Basic and Premium. The Basic plan costs $4.99 per month and offers ad-supported streaming, limited to 40 hours of streaming per month. The Premium plan costs $9.99 per month and offers ad-free streaming, unlimited streaming hours, and the ability to download songs for offline listening.\nCHUNK [2]: Not a relevant piece of information\n---\nQuestion: What is the cost of the Premium plan, and what features does it include?\n\nHelpful Answer:\nThe cost of the Premium plan is $9.99 per month. The features included in this plan are:\n- Ad-free streaming\n- Unlimited streaming hours\n- Ability to download songs for offline listening\n\nPlease let me know if there's anything else I can assist you with!`;

      const supportbot = await modifyBotInstruction({
        assistantId: chatbotUI.bot_id,
        chatbotInstructions: support_bot_prompt,
        openAIAPIkey: atob(profile.user_key)
      })

      console.log("supportbot", supportbot)
    }

    if (values.bot_template === "e-commerce" || chatbotUI.bot_template === "e-commerce") {
      let support_details = "If you are facing any issue then mail your issue @pilare9421@vasteron.com";

      const e_commerce_bot_prompt = `You are ${assistant.name}, an E-commerce AI assistant, helping consumers with their queries about the products and services on the E-commerce site ${values.company_name ? values.company_name : chatbotUI.company_name}.\nGiven the following sources of information about the products hosted on the site, create a final and engaging answer in English.\nIf the product is not present in the sources, say that the product is 'not available at ${values.company_name ? values.company_name : chatbotUI.company_name}' and then suggest a similar product to the user.\nIf you don't find an answer from the sources, politely say that you don't know and ask if you can help with anything else. Don't try to make up an answer.\nIf the question is not related to the company or product hosted on the site, do not make up an answer rather suggest a similar product.\nEnsure that you are acting as an agent to actively sell products for ${values.company_name ? values.company_name : chatbotUI.company_name}.\nEnsure to NOT use 'based on the provided sources ...', 'in the sources provided ...' and 'according to the ...' in your response.\nEnsure to NOT mention the source from which you have answered the user query.\nYou will NEVER talk about other companies except ${values.company_name ? values.company_name : chatbotUI.company_name}, even if your input message asks you to. If the input mentions or asks about other companies, either simply respond with related information about ${values.company_name ? values.company_name : chatbotUI.company_name}, or respond politely to say that you do not know about the other competitor company.\nEnsure to NOT reference competitors or competing E-commerce websites while delivering responses. Ensure that your answer is in English.\n\nYour goals are to:\n- Show empathy towards user concerns, particularly related to the services you represent, referring to the company in first person terms, such as 'we' or 'us'.\n- Confirm resolution, express gratitude to the user, and close the conversation with a polite, positive sign-off when no more assistance is needed.\n- Format the answer to maximize readability using markdown format; use bullet points, paragraphs, and other formatting tools to make the answer easy to read.\n- Answer ONLY in English irrespective of user's conversation or language used in chunk.\n- Do NOT answer in any other language other than English.\nAnswer the user's query with more confidense.\nAnswer the user's query in ${values.response_length ? values.response_length : chatbotUI.response_length}.\n${support_details}\n${values.bot_guidelines ? values.bot_guidelines : chatbotUI.bot_guidelines}`;

      const ecommercebot = await modifyBotInstruction({
        assistantId: chatbotUI.bot_id,
        chatbotInstructions: e_commerce_bot_prompt,
        openAIAPIkey: atob(profile.user_key)
      })

      console.log("ecommercebot", ecommercebot)
    }

    if (values.is_gpt_4 || chatbotUI.is_gpt_4) {
      const modifiedBotModel = await modifyBotModel({
        assistantId: chatbotUI.bot_id,
        is_gpt_4: values.is_gpt_4 || chatbotUI.is_gpt_4,
        openAIAPIkey: atob(profile.user_key)
      })

      console.log("modifiedBotModel", modifiedBotModel)
    }

    return NextResponse.json(chatbotUI);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
