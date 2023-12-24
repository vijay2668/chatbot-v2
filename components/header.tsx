"use client";
import { UserButton } from "@clerk/nextjs";
import { Label } from "./ui/label";
import { useParams, usePathname, useRouter } from "next/navigation";
import { MobileSidebar } from "./mobile-sidebar";
import { Button } from "./ui/button";
import { SettingsIcon } from "lucide-react";

export const DashboardHeader = () => {
  const path = usePathname();
  const params = useParams();
  const router = useRouter();
  const chatbotId = params?.chatbotId;

  return (
    <div className="px-4 md:px-6 flex justify-between border-b min-h-[40px] border-gray-1 overflow-auto">
      <div className="flex items-center space-x-1">
        <MobileSidebar />
        <Label className="text-md text-xl font-semibold text-gray-900 w-fit h-fit whitespace-nowrap ">
          {path.includes("/chatbots") && !params?.chatbotId
            ? "Your Bots"
            : params?.chatbotId
            ? "New Bot"
            : "Dashboard"}
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        {chatbotId && (
          <Button
            variant="outline"
            onClick={() => router.push(`/settings/${chatbotId}`)}
            className="h-fit text-gray-700 px-1 py-1 rounded-lg text-xs w-full"
          >
            <SettingsIcon width={20} height={20} />
          </Button>
        )}

        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[32px] w-[32px]"
            }
          }}
        />
      </div>
    </div>
  );
};
