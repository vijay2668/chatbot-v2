"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Files } from "../training-with/files";
import { AiOutlineFilePdf, AiOutlineFileText } from "react-icons/ai";
import { Website } from "../training-with/website";
import { MdOutlineDelete } from "react-icons/md";
import { removeFile } from "@/lib/OpenAI";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const Sources = ({ user, chatbotUI, sources }: any) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const mainURL =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !mainURL) {
    return null;
  }

  const handleFileDelete = async (sourceId: string) => {
    try {
      setIsDeleting(true);
      const response = await axios.post("/api/removeFile", {
        sourceId,
        assistantId: chatbotUI?.bot_id
      });

      const data = response.data;

      if (!data.deleted) {
        toast.error("File is not removed, Pls try again after sometime");
        setIsDeleting(false);
        return;
      }
      router.refresh();
      setIsDeleting(false);
    } catch (error: any) {
      toast.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="sm:px-8 py-4 px-4 flex space-y-4 flex-col w-full h-full overflow-hidden flex-1">
        <div className="flex flex-col w-full min-h-fit space-y-1">
          <Label className="text-base font-semibold">Sources</Label>
          <Label className="text-sm font-normal text-gray-400">
            Upload documents or add links to your knowledge base or website to
            train Botsonic on your own data.
          </Label>
        </div>
        <div className="flex w-full h-full items-start space-x-2 overflow-hidden">
          <div className="w-1/2 h-full flex flex-col space-y-4 overflow-hidden">
            <Tabs
              defaultValue="files"
              className="w-full h-full overflow-hidden flex flex-col"
            >
              <TabsList>
                <TabsTrigger className="w-full" value="files">
                  Files
                </TabsTrigger>
                <TabsTrigger className="w-full" value="website">
                  Website
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="files"
                className="h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:overflow-hidden"
              >
                <Files chatbotUI={chatbotUI} sources={sources} />
              </TabsContent>
              <TabsContent
                value="website"
                className="h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:overflow-hidden"
              >
                <Website chatbotUI={chatbotUI} sources={sources} />
              </TabsContent>
            </Tabs>
          </div>

          <div
            className={cn(
              isDeleting && "pointer-events-none opacity-50",
              "w-1/2 h-full flex flex-col space-y-4 overflow-hidden"
            )}
          >
            <div className="flex flex-col h-full overflow-hidden border border-gray-200 rounded-xl py-4">
              <div className="flex flex-col h-full overflow-scroll space-y-2 scrollbar-hide">
                {sources?.map((source: any) => (
                  <>
                    <div
                      key={source?.id}
                      className="flex items-center text-gray-600 space-x-1 px-3"
                    >
                      <div>
                        {source.filename.includes(".pdf") ? (
                          <AiOutlineFilePdf className="text-xl" />
                        ) : (
                          <AiOutlineFileText className="text-xl" />
                        )}
                      </div>
                      <Label className="whitespace-nowrap leading-5 w-full overflow-scroll scrollbar-hide">
                        {source?.filename}
                      </Label>
                      <button
                        type="button"
                        onClick={() => handleFileDelete(source.id)}
                        className="text-red-500"
                      >
                        <MdOutlineDelete className="text-xl" />
                      </button>
                    </div>
                    <Separator />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <iframe
        className={cn(
          !open && "hidden",
          "absolute bottom-0 p-4 right-0 w-full h-[80vh] rounded-xl sm:max-w-[400px]"
        )}
        frameBorder="0"
        src={`${mainURL}/${user?.id}/${chatbotUI?.bot_id}`}
      />
      <Button
        onClick={() => setOpen(!open)}
        style={{ background: !open ? chatbotUI?.accent_colour : "transparent" }}
        className={cn(
          !open
            ? "rounded-full absolute bottom-4 right-4 p-2 h-fit"
            : "absolute bottom-[31.4rem] right-6 p-0 bg-transparent h-fit"
        )}
      >
        {open ? (
          <X width={32} height={32} className="p-1" />
        ) : (
          <Image
            src={chatbotUI?.chat_bubble_icon}
            alt={chatbotUI?.chat_bubble_icon}
            width={32}
            height={32}
            className="invert"
          />
        )}
      </Button>
    </>
  );
};

export default Sources;
