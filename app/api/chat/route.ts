import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import {
  createMessage,
  getMessages,
  runAssistant,
  runCheck
} from "@/lib/OpenAI";

export async function POST(req: Request) {
  const profile = await currentProfile();

  const { currentThread, question, assistant } = await req.json();

  //only accept post requests
  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!question) {
    return new NextResponse("No question in the request", { status: 400 });
  }

  if (!assistant) {
    return new NextResponse("Current Assistant is missing", { status: 402 });
  }

  if (!currentThread) {
    return new NextResponse("Thread id is missing", { status: 402 });
  }

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll("\n", " ");

  try {
    const userMessage = await createMessage({
      threadId: currentThread.id,
      content: sanitizedQuestion,
      openAIAPIkey: profile?.openAIAPIkey
    });

    console.log("userMessage", userMessage);

    const run = await runAssistant({
      assistantId: assistant.id,
      threadId: currentThread.id,
      instructions: assistant.instructions,
      openAIAPIkey: profile?.openAIAPIkey
    });

    let runStatus = await runCheck({
      threadId: currentThread.id,
      runId: run.id,
      openAIAPIkey: profile?.openAIAPIkey
    });

    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      runStatus = await runCheck({
        threadId: currentThread.id,
        runId: run.id,
        openAIAPIkey: profile?.openAIAPIkey
      });
      console.log(runStatus);

      if (runStatus.status === "failed") {
        return NextResponse.json(runStatus);
      }
    }

    const messages = await getMessages(currentThread.id, profile?.openAIAPIkey);

    const lastMessageForRun = messages.data
      .filter(
        (message: any) =>
          message.run_id === run.id && message.role === "assistant"
      )
      .pop();

    console.log(lastMessageForRun);

    return NextResponse.json(lastMessageForRun);
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
