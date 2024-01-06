import OpenAI from "openai";

//create bot
export const createBot = async ({
  chatbotName,
  chatbotInstructions,
  openAIAPIkey
}: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const assistant = await openai?.beta?.assistants?.create({
    name: chatbotName,
    instructions: chatbotInstructions,
    tools: [{ type: "retrieval" }],
    model: "gpt-3.5-turbo-1106"
  });

  return assistant;
};

//rename bot
export const renameBot = async ({
  chatbotName,
  assistantId,
  openAIAPIkey
}: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const assistant = await openai?.beta?.assistants?.update(assistantId, {
    name: chatbotName
  });

  return assistant;
};

// modify bot
export const modifyBot = async ({
  assistantId,
  fileIDs,
  openAIAPIkey
}: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const assistant = await openai?.beta?.assistants?.update(assistantId, {
    file_ids: fileIDs.map((fileID: any) => fileID)
  });

  return assistant;
};

// modify bot instructions
export const modifyBotInstruction = async ({
  assistantId,
  chatbotInstructions,
  openAIAPIkey
}: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const assistant = await openai?.beta?.assistants?.update(assistantId, {
    instructions: chatbotInstructions,
  });

  return assistant;
};

// modify bot model
export const modifyBotModel = async ({
  assistantId,
  is_gpt_4,
  openAIAPIkey
}: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const assistant = await openai?.beta?.assistants?.update(assistantId, {
    model: is_gpt_4 ? "gpt-4-1106-preview" : "gpt-3.5-turbo-1106"
  });

  return assistant;
};

// remove file permanently
export const removeFile = async (sourceId: string, openAIAPIkey: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const file = await openai.files.del(sourceId);

  return file;
};

// remove file from bot
export const removeFileFromBot = async (sourceId: string, assistantId: string, openAIAPIkey: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const deletedAssistantFile = await openai.beta.assistants.files.del(
    assistantId,
    sourceId
  );

  return deletedAssistantFile;
};



//create assistants
export const createAssistant = async ({
  chatbotName,
  chatbotInstructions,
  fileIDs,
  openAIAPIkey
}: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const assistant = await openai?.beta?.assistants?.create({
    name: chatbotName,
    instructions: chatbotInstructions,
    tools: [{ type: "retrieval" }],
    model: "gpt-3.5-turbo-1106",
    file_ids: fileIDs.map((fileID: any) => fileID)
  });

  return assistant;
};

export const modifyAssistant = async ({
  assistantId,
  chatbotName,
  chatbotInstructions,
  fileIDs,
  openAIAPIkey
}: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const assistant = await openai?.beta?.assistants?.update(assistantId, {
    name: chatbotName,
    instructions: chatbotInstructions,
    tools: [{ type: "retrieval" }],
    model: "gpt-3.5-turbo-1106",
    file_ids: fileIDs.map((fileID: any) => fileID)
  });

  return assistant;
};

//run assistants
export const runAssistant = async ({
  assistantId,
  threadId,
  instructions,
  openAIAPIkey
}: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const run = await openai?.beta?.threads?.runs?.create(threadId, {
    assistant_id: assistantId,
    instructions: instructions
  });
  return run;
};

//get assistants
export const getAssistants = async (openAIAPIkey: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const assistants: any = await openai?.beta?.assistants?.list({
    order: "desc"
  });

  return assistants?.data;
};

//get assistant
export const getAssistant = async (openAIAPIkey: any, assistantId: string) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const assistant = await openai?.beta?.assistants?.retrieve(assistantId);

  return assistant;
};

//delete assistant
export const deleteAssistant = async (
  openAIAPIkey: any,
  assistantID: string
) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });
  const response = await openai?.beta?.assistants?.del(assistantID);
  return response;
};

//check on the run thread
export const runCheck = async ({ threadId, runId, openAIAPIkey }: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const check = await openai?.beta?.threads?.runs?.retrieve(threadId, runId);
  return check;
};

//create thread
export const createThread = async (openAIAPIkey: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const thread = await openai?.beta?.threads?.create();
  return thread;
};

//get thread
export const getThread = async (threadId: string, openAIAPIkey: string) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const thread = await openai?.beta?.threads?.retrieve(threadId);
  return thread;
};

//delete thread
export const deleteThread = async (threadId: string, openAIAPIkey: string) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const response = await openai?.beta?.threads?.del(threadId);
  return response;
};

//create message
export const createMessage = async ({
  threadId,
  content,
  openAIAPIkey
}: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const messages = await openai?.beta?.threads?.messages?.create(threadId, {
    role: "user",
    content: content
  });
  return messages;
};

//get messages
export const getMessages = async (threadId: string, openAIAPIkey: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const messages = await openai?.beta?.threads?.messages?.list(threadId);
  return messages;
};

// Upload a file with an "assistants" purpose

export const UploadFile = async (fileSrc: any, openAIAPIkey: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const file = await openai?.files?.create({
    file: fileSrc,
    purpose: "assistants"
  });
  return file;
};

export const fileRetrieve = async (fileID: any, openAIAPIkey: any) => {
  const openai: any = new OpenAI({
    apiKey: openAIAPIkey
  });

  const file = await openai?.files?.retrieve(fileID);
  return file;
};
