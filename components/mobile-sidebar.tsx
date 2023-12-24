import { LayoutDashboard, List, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import Link from "next/link";
import Image from "next/image";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="h-full flex w-full bg-gray-900">
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

            <div className="flex flex-col flex-1 space-y-1">
              <Label className="text-xs not-italic font-bold leading-4 tracking-[0.48px] uppercase text-gray-500 p-3">
                Menu
              </Label>
              <div className="flex flex-col flex-1">
                <SheetTrigger asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 text-white rounded-lg p-3 mx-4 hover:bg-gray-800"
                  >
                    <LayoutDashboard
                      className="text-gray-200"
                      width={18}
                      height={18}
                    />
                    <Label className="leading-5 cursor-pointer">
                      Dashboard
                    </Label>
                  </Link>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <Link
                    href="/chatbots"
                    className="flex items-center space-x-2 text-white rounded-lg p-3 mx-4 hover:bg-gray-800"
                  >
                    <List className="text-gray-200" width={18} height={18} />
                    <Label className="leading-5 cursor-pointer">
                      Your Bots
                    </Label>
                  </Link>
                </SheetTrigger>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
