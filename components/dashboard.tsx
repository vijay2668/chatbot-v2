"use client";
import { useModal } from "@/hooks/use-modal-store";
import { fileRetrieve } from "@/lib/OpenAI";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Delete, Edit } from "lucide-react";

export const DashboardPage = ({ user }: any) => {
  const [chatbots, setChatbots] = useState<any>([]);
  const { onOpen } = useModal();

  useEffect(() => {
    if (user?.openAIAPIkey) {
      const getAllAssistants = async () => {
        //Getting all Assistant which have been made by user
        const assistants = await axios.get("/api/getAllAssistants");
        setChatbots(assistants?.data);
      };
      getAllAssistants();
    }
  }, [user?.openAIAPIkey]);

  const handleDelete = async (assistant: any) => {
    try {
      const response = await axios.post("/api/deleteAssistant", {
        openAIAPIkey: user?.openAIAPIkey,
        assistantID: assistant?.id
      });

      const data = response.data;

      if (data.deleted) {
        const filterAssistant = chatbots.filter(
          (chatbot: any) => chatbot.id !== data.id
        );
        setChatbots(filterAssistant);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handle = async (assistant: any) => {
    const file = await axios.post("/api/fileRetrieve", {
      file_ids: assistant?.file_ids
    });

    const { filename } = file?.data;

    if (filename === "upload") {
      onOpen("editWebsite", assistant);
    } else {
      onOpen("editFile", assistant);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="h-full w-48 ml-2 my-2 rounded-md border">
        <div className="p-4">
          <h4 className="text-sm font-medium leading-none">
            Your Created Bots
          </h4>
          <Separator className="my-2" />
          {chatbots?.map((chatbot: any) => (
            <div key={chatbot.id} className="flex flex-col w-full">
              <div className="text-sm w-full flex items-center justify-between">
                {chatbot.name}
                <div className="flex items-center space-x-2">
                  <Edit
                    onClick={() => handle(chatbot)}
                    className="cursor-pointer"
                    width={18}
                    height={18}
                  />
                  <Delete
                    onClick={() => handleDelete(chatbot)}
                    className="cursor-pointer"
                    width={18}
                    height={18}
                  />
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
