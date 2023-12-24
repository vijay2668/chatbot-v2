"use client";
import { useModal } from "@/hooks/use-modal-store";
import { UserButton } from "@clerk/nextjs";
import { ScrollArea } from "./ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import {
  File,
  LayoutDashboard,
  List,
  Settings,
  Twitter,
  Webhook
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

export const Sidebar = () => {
  const { onOpen } = useModal();
  const [pop, setpop] = useState(false);

  const items = [
    {
      label: "File",
      openName: "file",
      icon: <File width={20} height={20} />
    },
    {
      label: "Website",
      openName: "website",
      icon: <Webhook width={20} height={20} />
    }
  ];

  return (
    <div className="hidden h-full md:flex md:min-w-[262px] bg-gray-900">
      <div className="flex flex-col w-full h-full py-5 overflow-auto text-sm font-bold text-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="flex items-start justify-between w-full gap-2 px-4">
          <div className="ml-2">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <Image
                  width={36}
                  height={36}
                  src="/bot-image.png"
                  alt="vercel"
                />
                <div>
                  <p className="text-white leading-6 text-base font-bold">
                    Chatbot
                  </p>
                  <p className="text-white/50 leading-4 text-xs font-medium">
                    by Vijay
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        {/* <div className="px-4 py-6">
          <DropdownMenu onOpenChange={setpop}>
            <DropdownMenuTrigger className="relative p-3 rounded-lg cursor-pointer bg-black-1 group w-full flex flex-1">
              <div
                className={cn(
                  pop && "opacity-50",
                  "flex items-center justify-between flex-1"
                )}
              >
                <div className="flex gap-2 items-center">
                  <div className="flex justify-center items-center w-5 h-5 bg-indigo-500 text-xs not-italic font-bold rounded-[4px] text-[10px]">
                    P
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-sm whitespace-nowrap not-italic font-semibold leading-[18px]">
                      Private Workspace
                    </div>
                    <div className="text-gray-6 text-xs not-italic font-medium leading-[18px] tracking-[-0.12px]">
                      Private
                    </div>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className={cn(pop && "rotate-180", "h-5 w-5 transition-all")}
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex p-2 rounded-xl flex-col top-full right-1 bg-white min-w-[230px] w-full z-10 gap-1">
              <div className="flex flex-col gap-[1px]">
                <div className="p-1.5 rounded-lg flex justify-between  cursor-pointer relative group bg-indigo-500/20">
                  <DropdownMenuLabel className="flex gap-2 flex-1 items-center">
                    <div className="flex justify-center items-center w-5 h-5 bg-indigo-500 text-xs not-italic text-white font-bold rounded-[4px] text-[10px]">
                      P
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="text-sm not-italic font-semibold leading-5 text-black">
                        Private Workspace
                      </div>
                      <div className="text-gray-6 text-xs not-italic font-medium leading-[18px] tracking-[-0.12px]">
                        Private
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </div>
              </div>
              <Button variant="primary" className="rounded-lg">
                Create new Workspace
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
        <div className="flex flex-col flex-1 space-y-1">
          <Label className="text-xs not-italic font-bold leading-4 tracking-[0.48px] uppercase text-gray-500 p-3">
            Menu
          </Label>
          <div className="flex flex-col flex-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-white rounded-lg p-3 mx-4 hover:bg-gray-800"
            >
              <LayoutDashboard
                className="text-gray-200"
                width={18}
                height={18}
              />
              <Label className="leading-5 cursor-pointer">Dashboard</Label>
            </Link>
            <Link
              href="/chatbots"
              className="flex items-center space-x-2 text-white rounded-lg p-3 mx-4 hover:bg-gray-800"
            >
              <List className="text-gray-200" width={18} height={18} />
              <Label className="leading-5 cursor-pointer">Your Bots</Label>
            </Link>
          </div>
        </div>
        {/* <div className="mb-4">
          <Link
            href="/settings"
            className="flex items-center space-x-2 text-white rounded-lg p-3 mx-4 hover:bg-black-1 hover:text-purple-2 bg-black-1 hover:bg-gray-800"
          >
            <Settings className="text-gray-200" width={18} height={18} />
            <Label className="leading-5">Settings</Label>
          </Link>
        </div> */}
        {/* <div className="px-4">
          <div className="rounded-xl border border-gray-700/60 p-4">
            <div className="flex flex-col items-start text-white text-sm">
              <Label className="text-xs font-medium text-gray-6">
                Uploaded characters
              </Label>
              <div>0 / 1.00M</div>
            </div>
            <div className="flex flex-col items-start text-white text-sm pt-2.5">
              <Label className="text-xs font-medium text-gray-6">
                Messages remaining
              </Label>
              <div>100</div>
            </div>
            <div className="flex justify-between items-center text-purple-1 text-sm mt-3">
              <Link href="#">Manage plan</Link>
              <Link href="#">Upgrade</Link>
            </div>
          </div>
          <div className="flex flex-col space-y-2 mt-6">
            <Link
              href="#"
              className="cursor-pointer flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-black-1 hover:bg-gray-800 text-white hover:text-purple-2 w-full"
            >
              <Label className="leading-5">Nedd a custom plan?</Label>
            </Link>
            <Link
              href="#"
              className="cursor-pointer flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-black-1 hover:bg-gray-800 text-white hover:text-purple-2 w-full"
            >
              <Label className="leading-5">Request a feature</Label>
            </Link>
          </div>
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm flex items-center space-x-1 text-gray-6">
              <Label>Powered by</Label>
              <Link
                className="text-white text-bold hover:text-purple-1 hover:underline"
                target="_blank"
                href="/dashboard"
              >
                <Label>Vijay</Label>
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-6">
              <Link target="_blank" className="hover:text-indigo-500" href="#">
                <Twitter className="text-gray-400" width={18} height={18} />
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

{
  /* <ScrollArea className="flex-1 w-full">
  <div className="space-y-2">
    {items?.map((item, index) => (
      <NavigationItem
        key={index}
        label={item.label}
        icon={item.icon}
        openName={item.openName}
        onOpen={onOpen}
      />
    ))}
  </div>
</ScrollArea> */
}
