"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Download, Plus, SortDesc } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Function to calculate the time difference and return a human-readable string
const calculateTimeDifference = (createdAtTimestamp: number) => {
  const createdAt: any = new Date(createdAtTimestamp * 1000); // Convert timestamp to milliseconds
  const currentDateTime: any = new Date();
  const timeDifferenceInSeconds = Math.floor(
    (currentDateTime - createdAt) / 1000
  );

  // Helper function to calculate the pluralization of units
  const pluralize = (count: any, unit: any) =>
    count === 1 ? unit : `${unit}s`;

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} ${pluralize(
      timeDifferenceInSeconds,
      "second"
    )} ago`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} ${pluralize(minutes, "minute")} ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} ${pluralize(hours, "hour")} ago`;
  } else {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} ${pluralize(days, "day")} ago`;
  }
};

export const Inbox = ({ list_of_thread_from_current_bot }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current_thread_messages = list_of_thread_from_current_bot[
    currentIndex
  ]?.sort((a: any, b: any) => a?.created_at - b?.created_at);

  // console.log(current_thread_messages[0]);

  return (
    <div className="w-full h-full flex flex-col space-y-4 overflow-y-scroll scrollbar-hide">
      <div className="flex flex-col w-full min-h-fit space-y-1">
        <Label className="text-base font-semibold">Inbox</Label>
        <Label className="text-sm font-normal text-gray-400">
          Go and check your chatbot messages
        </Label>
      </div>

      <div className="w-full rounded-xl h-full flex flex-col overflow-hidden border border-gray-200">
        <div className="border-b border-gray-200 flex items-center w-full">
          <div className="min-w-[200px] flex items-center justify-end p-2">
            <Button variant="outline" className="p-3 w-fit">
              <SortDesc width={16} height={16} />
            </Button>
          </div>
          <Separator orientation="vertical" />
          <div className="w-full space-x-2 p-2 border-gray-200 flex items-center justify-between">
            <div className="flex  items-center space-x-1">
              <Label className="text-lg font-bold">Chat with</Label>
              <Label className="text-indigo-500 text-lg font-bold">
                Unknown User
              </Label>
            </div>
            <Button
              variant="outline"
              className="border-indigo-500 space-x-1 rounded-lg text-indigo-500 text-xs hover:text-indigo-500 hover:bg-indigo-100 h-fit"
            >
              <Download width={15} height={15} />
              <p>Export all data</p>
            </Button>
          </div>
        </div>
        <div className="flex items-center w-full h-full overflow-hidden">
          {/* list */}
          <div className="flex flex-col max-w-[200px] w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-hide">
            {/* list-item */}
            {list_of_thread_from_current_bot?.map(
              (item: any, index: number) => (
                <div
                  onClick={() => setCurrentIndex(index)}
                  key={index}
                  className="w-full cursor-pointer overflow-hidden h-fit flex flex-col"
                >
                  <div
                    className={cn(
                      currentIndex === index
                        ? "bg-indigo-50 border-indigo-500"
                        : "border-transparent",
                      "w-full h-fit overflow-hidden border-r-4 transition-all flex space-y-1 py-2 px-4 hover:bg-indigo-50 flex-col"
                    )}
                  >
                    <Label className="text-base cursor-pointer">
                      Unknown User
                    </Label>
                    <div className="text-sm flex flex-col overflow-hidden cursor-pointer text-gray-400">
                      <p className="whitespace-nowrap overflow-scroll scrollbar-hide">
                        {
                          item?.sort(
                            (a: any, b: any) => a?.created_at - b?.created_at
                          )?.[0]?.content?.[0]?.text?.value
                        }
                      </p>
                    </div>

                    <Label className="text-xs text-end w-full cursor-pointer text-gray-400">
                      {calculateTimeDifference(
                        item?.sort(
                          (a: any, b: any) => a?.created_at - b?.created_at
                        )?.[0]?.created_at
                      )}
                    </Label>
                  </div>
                  <Separator />
                </div>
              )
            )}
            {/* list-item */}
          </div>
          <Separator orientation="vertical" />

          {/* list */}
          <div className="flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-hide">
            {/* list-item */}
            {current_thread_messages?.map((message: any) => (
              <div key={message.id} className="w-full h-fit flex flex-col">
                <div
                  className={cn(
                    message.role === "user" && "bg-gray-100",
                    "w-full flex space-y-2 py-2 px-4 flex-col"
                  )}
                >
                  <div className="w-full flex items-start space-x-4">
                    {message.role === "user" ? (
                      <Image
                        src="/user.svg"
                        alt="user"
                        className="rounded-full"
                        width={30}
                        height={30}
                      />
                    ) : (
                      <Image
                        src="/bot-image.png"
                        alt="user"
                        className="rounded-full"
                        width={30}
                        height={30}
                      />
                    )}
                    <div className="text-sm">
                      <p>{message.content[0].text.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end w-full">
                    {message.role === "user" && (
                      <Button
                        variant="outline"
                        className="border-indigo-500 space-x-1 rounded-lg bg-transparent text-indigo-500 hover:text-indigo-500 h-fit"
                      >
                        <Plus width={18} height={18} />
                        <p>Add as FAQ</p>
                      </Button>
                    )}
                  </div>
                </div>
                <Separator />
              </div>
            ))}
            {/* list-item */}
            <div className="flex flex-col min-w-[200px] h-full overflow-y-scroll overflow-x-hidden scrollbar-hide"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
