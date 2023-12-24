"use client";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { Settings } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const ChatbotList = ({ user }: any) => {
  const [chatbots, setChatbots] = useState<any>([]);
  const { onOpen } = useModal();
  const router = useRouter();

  const handleDelete = async (assistant: any) => {
    try {
      const response = await axios.post("/api/deleteAssistant", {
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

  return (
    <>
      <Label className="text-base font-semibold">
        {chatbots?.length} Live bots
      </Label>
      <div className="w-full h-full flex flex-col space-y-4 overflow-y-scroll">
        {chatbots?.map((chatbot: any) => (
          <Card
            key={chatbot?.id}
            className="py-4 px-4 flex items-center justify-between w-full"
          >
            <CardHeader className="p-0 flex flex-row items-center space-x-2">
              <Image src="/bot-image.png" alt="" width={40} height={40} />
              <Label className="text-black text-sm">{chatbot?.name}</Label>
            </CardHeader>
            <CardFooter className="p-0 space-x-2">
              <Button
                onClick={() => router.push(`/chatbots/${chatbot?.id}`)}
                variant="primary"
                className="h-fit rounded-lg text-xs w-full"
              >
                Visit Bot
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    className="h-fit px-1 py-1 rounded-lg text-xs w-full"
                  >
                    <Settings width={20} height={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handle(chatbot)}
                    className="cursor-pointer"
                  >
                    Modify
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleDelete(chatbot)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};
