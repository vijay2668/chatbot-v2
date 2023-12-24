"use client";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import Image from "next/image";
import { Settings } from "lucide-react";

export const DashboardPage = ({ user }: any) => {
  const { onOpen } = useModal();

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="px-6 pt-5 pb-4 text-n-text-strong font-semibold text-3xl md:px-8 md:py-6 md:pt-10 ">
        Welcome to Chatbot
      </h1>
      <div className="flex flex-col gap-4 px-6 pb-6 md:px-8 md:flex-row">
        <div className="flex-1 md:w-1/3 w-full">
          <Button
            onClick={() => onOpen("file")}
            variant="outline"
            className="h-full py-3 w-full justify-start rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-semibold text-left whitespace-normal">
                  Create a PDF Bot
                </Label>
                <Label className="text-xs text-gray-500 whitespace-normal text-left">
                  Train a custom ChatGPT on your pdf files base
                </Label>
              </div>
            </div>
          </Button>
        </div>
        <div className="flex-1 md:w-1/3 w-full">
          <Button
            onClick={() => onOpen("website")}
            variant="outline"
            className="h-full py-3 justify-start w-full rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-semibold text-left whitespace-normal">
                  Create a Website Bot
                </Label>
                <Label className="text-xs text-gray-500 whitespace-normal text-left">
                  Personalize ChatGPT for your specific Website
                </Label>
              </div>
            </div>
          </Button>
        </div>
        {/* <div className="flex-1 md:w-1/3 w-full">
          <Button
            variant="outline"
            className=" w-full h-full py-3 justify-start rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-semibold text-left whitespace-normal">
                  Import an OpenAI Assistant Bot
                </Label>
                <p className="text-xs text-gray-500 whitespace-normal text-left">
                  Connect your existing OpenAI Assistant to Botsonic
                </p>
              </div>
            </div>
          </Button>
        </div> */}
      </div>
    </div>
  );
};

{
  /* <div className="px-6 md:px-8 mt-7 sm:mt-0">
<div className="flex justify-between items-center">
  <Label className="text-xl font-semibold">Your Bots</Label>
  <Button
    variant="outline"
    className="h-fit text-indigo-500 hover:text-indigo-500 rounded-xl w-24"
  >
    See all
  </Button>
</div>
<div className="flex overflow-x-scroll cursor-grab mt-4">
  <Card className="py-4 px-4 space-y-4 w-[16rem]">
    <CardHeader className="p-0">
      <Image src="/bot-image.png" alt="" width={40} height={40} />
    </CardHeader>
    <CardContent className="p-0 flex flex-col space-y-1.5">
      <Label className="text-black text-sm">New Bot</Label>
      <Label className="text-gray-400 font-normal text-xs">
        Last updated 1 days ago
      </Label>
      <Label className="text-gray-400 font-normal text-xs h-10"></Label>
    </CardContent>
    <CardFooter className="p-0 space-x-2">
      <Button
        variant="primary"
        className="h-fit rounded-lg text-xs w-full"
      >
        <Label>Visit Bot</Label>
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
          <DropdownMenuItem>Modify</DropdownMenuItem>
          <DropdownMenuItem>Clone this bot</DropdownMenuItem>
          <DropdownMenuItem>Move bot</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardFooter>
  </Card>
</div>
</div> */
}
{
  /* <div className="flex flex-col w-full md:flex-row">
        <div className="pl-4 pr-6 py-4 md:pl-8 md:pr-5 md:py-10 flex flex-col md:flex-row w-full gap-x-5 relative">
          <div className="flex flex-col border-gray-1 border rounded-2xl border-solid relative p-4 md:p-6 gap-6 bg-white overflow-hidden hidden sm:flex flex-1">
            <div className="text-black-3 text-xl not-italic font-bold leading-7 tracking-[-0.4px]">
              Workspace stats
            </div>
            <div className="flex-1 grid sm:grid-cols-4 grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-gray-6 text-sm not-italic font-medium leading-5">
                  Characters used
                </div>
                <div className="text-black-3 text-2xl not-italic font-bold leading-8 tracking-[-0.4px]">
                  0
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-gray-6 text-sm not-italic font-medium leading-5">
                  Bots
                </div>
                <div className="text-black-3 text-2xl not-italic font-bold leading-8 tracking-[-0.4px]">
                  1
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-gray-6 text-sm not-italic font-medium leading-5">
                  Team members
                </div>
                <div className="text-black-3 text-2xl not-italic font-bold leading-8 tracking-[-0.4px]">
                  1
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-gray-6 text-sm not-italic font-medium leading-5">
                  Money saved
                </div>
                <div className="text-black-3 text-2xl not-italic font-bold leading-8 tracking-[-0.4px]">
                  0$
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-gray-6 text-sm not-italic font-medium leading-5">
                  Users
                </div>
                <div className="text-black-3 text-2xl not-italic font-bold leading-8 tracking-[-0.4px]">
                  0
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-gray-6 text-sm not-italic font-medium leading-5">
                  Conversations
                </div>
                <div className="text-black-3 text-2xl not-italic font-bold leading-8 tracking-[-0.4px]">
                  0
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-gray-6 text-sm not-italic font-medium leading-5">
                  Resolutions
                </div>
                <div className="text-black-3 text-2xl not-italic font-bold leading-8 tracking-[-0.4px]">
                  0
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-gray-6 text-sm not-italic font-medium leading-5">
                  Time saved
                </div>
                <div className="text-black-3 text-2xl not-italic font-bold leading-8 tracking-[-0.4px]">
                  0s
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */
}
{
  /* <ScrollArea className="h-full w-48 ml-2 my-2 rounded-md border">
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
      </ScrollArea> */
}
