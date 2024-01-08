import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import {
  createMessage,
  getMessages,
  runAssistant,
  runCheck
} from "@/lib/OpenAI";
import { db } from "@/lib/db";
import { FAQ, Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    const { threadId, question, assistant, count } = await req.json();

    //only accept post requests
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!profile?.user_key) {
      return new NextResponse("openai api key not found", { status: 402 });
    }

    if (!question) {
      return new NextResponse("No question in the request", { status: 402 });
    }

    if (!assistant) {
      return new NextResponse("Current Assistant is missing", { status: 402 });
    }

    if (!threadId) {
      return new NextResponse("Thread id is missing", { status: 402 });
    }

    const chatbotUI = await db.chatbot.findFirst({
      where: {
        bot_id: assistant.id
      },
      include: {
        faqs: true
      }
    })

    if (!chatbotUI) {
      return new NextResponse("chatbotUI is missing", { status: 402 });
    }

    if (assistant.file_ids.length === 0) {
      return NextResponse.json({ files_not_uploaded_message: chatbotUI.files_not_uploaded_message });
    }

    if (chatbotUI.messages_used === chatbotUI.messages_limit_per_day) {
      return NextResponse.json({ messages_limit_warning_message: chatbotUI.messages_limit_warning_message });
    }


    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll("\n", " ");


    if (count === 0) {
      await db.messages.create({
        data: {
          profileId: profile.id,
          chatbotId: chatbotUI.id,
          thread_id: threadId
        }
      })
    }

    const getCreatedMessages = await db.messages.findFirst({
      where: {
        thread_id: threadId
      },
    })

    if (!getCreatedMessages) return new Response("messages as container not found")


    await db.message.create({
      data: {
        role: Role.USER,
        content: sanitizedQuestion,
        messagesId: getCreatedMessages.id,
        chatbotId: chatbotUI.id,
      }
    })


    const findFaq = chatbotUI.faqs.find((faq: FAQ) => faq.question.includes(sanitizedQuestion))

    if (findFaq?.answer) {
      const faq_reply = await db.message.create({
        data: {
          role: Role.BOT,
          content: findFaq.answer,
          messagesId: getCreatedMessages.id,
          chatbotId: chatbotUI.id,
        }
      })
      return NextResponse.json(faq_reply);
    }

    const userMessage = await createMessage({
      threadId,
      content: sanitizedQuestion,
      openAIAPIkey: atob(profile?.user_key)
    });


    console.log("userMessage", userMessage);


    const run = await runAssistant({
      assistantId: assistant.id,
      threadId,
      instructions: assistant.instructions,
      openAIAPIkey: atob(profile?.user_key)
    });

    console.log("run", run);

    let runStatus = await runCheck({
      threadId,
      runId: run.id,
      openAIAPIkey: atob(profile?.user_key)
    });

    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      runStatus = await runCheck({
        threadId,
        runId: run.id,
        openAIAPIkey: atob(profile?.user_key)
      });
      console.log(runStatus);

      if (runStatus.status === "failed") {
        return NextResponse.json(runStatus);
      }
    }

    const messages = await getMessages(threadId, atob(profile?.user_key));

    const lastMessageForRun = messages.data
      .filter(
        (message: any) =>
          message.run_id === run.id && message.role === "assistant"
      )
      .pop();

    console.log(lastMessageForRun);

    await db.chatbot.updateMany({
      where: { bot_id: assistant.id },
      data: { messages_used: chatbotUI.messages_used + 1 }
    })


    const assistant_reply = await db.message.create({
      data: {
        content: lastMessageForRun.content[0].text.value,
        messagesId: getCreatedMessages?.id,
        chatbotId: chatbotUI.id,
      }
    })

    return NextResponse.json(assistant_reply);
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
