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
import { BsThreeDotsVertical } from "react-icons/bs";
import { Chatbot } from "@prisma/client";

export const ChatbotList = ({ user, chatbots }: any) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const find_choosen_chatbot_ui = (choosen_bot_id: string) => {
    const finded = user.chatbots.find(
      (chatbot: Chatbot) => chatbot.bot_id === choosen_bot_id
    );

    router.push(`/chatbots/${finded?.id}`);
  };

  const handleDelete = async (assistant: any) => {
    try {
      const response = await axios.post("/api/deleteAssistant", {
        assistant: assistant
      });

      const data = response.data;

      if (data.deleted) {
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handle = async (assistant: any) => {
    onOpen("newchatbot", assistant);
  };

  return (
    <>
      <Label className="text-base font-semibold">
        {chatbots?.length} Live bots
      </Label>
      <div className="w-full h-full flex flex-col space-y-4 overflow-y-scroll scrollbar-hide">
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
                onClick={() => find_choosen_chatbot_ui(chatbot.id)}
                variant="primary"
                className="h-fit rounded-lg text-xs w-full"
              >
                Visit Bot
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    className="h-fit px-1.5 py-1.5 rounded-lg text-lg w-full"
                  >
                    <BsThreeDotsVertical />
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
