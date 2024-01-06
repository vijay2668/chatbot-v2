"use client";
import { UserButton } from "@clerk/nextjs";
import { Label } from "./ui/label";
import { useParams, usePathname, useRouter } from "next/navigation";
import { MobileSidebar } from "./mobile-sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const DashboardHeader = () => {
  const path = usePathname();
  const params = useParams();
  const id = params?.id;

  const settings_links = [
    {
      label: "Sources",
      href: "/chatbots/sources/"
    },
    {
      label: "Settings",
      href: "/chatbots/settings/"
    },
    {
      label: "Connect",
      href: "/chatbots/connect/"
    },
    {
      label: "Inbox",
      href: "/chatbots/inbox/"
    },
    {
      label: "Analytics",
      href: "/chatbots/analytics/"
    }
  ];

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
      {path.includes("/chatbots/") ? (
        <div className="flex items-center space-x-2">
          {settings_links.map((link: any, index: number) => (
            <Link
              key={index}
              href={link.href + id}
              className={cn(
                path.includes(link.href) ? "border-indigo-500 text-indigo-500" : "border-transparent text-gray-600",
                "text-sm hover:text-indigo-500/50 border-b-2 w-[60px] hover:border-indigo-500/50 h-full flex items-center justify-center font-semibold transition-all"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="flex items-center space-x-2">
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
