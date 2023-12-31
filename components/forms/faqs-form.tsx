"use client";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { MdDeleteOutline } from "react-icons/md";
import { BiPencil } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const FAQsForm = ({ chatbotUI }: any) => {
  const router = useRouter();
  const { onOpen } = useModal();

  const handleDelete = async (faq_id: string) => {
    const remove = await axios.post("/api/removeStarterQuestion", {
      faq_id
    });

    if (remove.data) {
      toast.success("Successfully Removed Starter Question!");
      router.refresh();
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 overflow-y-scroll scrollbar-hide">
      <div className="flex w-3/4 flex-col min-h-fit space-y-1">
        <Label className="text-base font-semibold">FAQs</Label>
        <div className="space-x-1">
          <Label className="text-sm font-normal text-gray-400">
            These will be shown upfront to your user as nudges. You can style
            the answers using markdown.
          </Label>
          {/* <Button
            onClick={() => onOpen("learnMore")}
            variant="link"
            className="p-0 text-indigo-500 hover:no-underline h-fit"
          >
            Learn more
          </Button> */}
        </div>
      </div>

      <div className="w-full max-w-[400px] space-y-2 max-h-full flex flex-col overflow-scroll scrollbar-hide">
        {chatbotUI?.faqs?.map((faq: any) => (
          <div
            key={faq?.id}
            className="w-full h-fit flex items-center space-x-2"
          >
            <div className="border rounded-xl border-gray-200 w-full h-fit p-4 flex flex-col items-start space-y-2">
              <Label>{faq?.question}</Label>
              <Label className="text-gray-500">{faq?.answer}</Label>
            </div>
            <div className="flex text-xl space-x-2 items-center">
              <button
                type="button"
                onClick={() =>
                  onOpen("FAQ", {
                    chatbotId: chatbotUI.id,
                    faq
                  })
                }
                className="text-gray-500"
              >
                <BiPencil />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                type="button"
                className="text-red-500"
              >
                <MdDeleteOutline />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button
          onClick={() => onOpen("FAQ", { chatbotId: chatbotUI.id })}
          variant="outline"
          className="border-indigo-500/50 flex items-center space-x-1 text-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 h-fit py-5 justify-start rounded-xl w-full max-w-[400px]"
        >
          <PlusCircle width={16} height={16} />
          <p>Add more FAQ</p>
        </Button>
      </div>
    </div>
  );
};
