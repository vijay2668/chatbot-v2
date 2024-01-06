"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { AppearanceForm } from "@/components/forms/appearance-form";
import Image from "next/image";
import { BotSettingsForm } from "../forms/bot-settings-form";
import { StarterQuestionsForm } from "../forms/starter-questions-form";
import { UserForm } from "../forms/user-form";

const Settings = ({ user, chatbotUI }: any) => {
  const [open, setOpen] = useState(false);

  const mainURL =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const [defaultForm, setDefaultForm] = useState(0);

  const forms = [
    {
      label: "Appearance",
      component: () => <AppearanceForm chatbotUI={chatbotUI} />
    },
    {
      label: "Bot settings",
      component: () => <BotSettingsForm chatbotUI={chatbotUI} />
    },
    {
      label: "Starter questions",
      component: () => <StarterQuestionsForm chatbotUI={chatbotUI} />
    },
    {
      label: "User form",
      component: () => <UserForm chatbotUI={chatbotUI} />
    }
  ];

  const handleForm = (index: any) => {
    return forms[index].component();
  };

  console.log();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !mainURL) {
    return null;
  }

  return (
    <>
      <div className="sm:px-8 py-4 px-4 flex space-y-4 flex-col w-full h-full overflow-hidden flex-1">
        <div className="w-fit flex items-center p-1 bg-slate-100 rounded-lg">
          {forms.map((item: any, index: number) => (
            <Button
              key={index}
              onClick={() => setDefaultForm(index)}
              className={cn(
                defaultForm === index
                  ? "bg-white hover:bg-white"
                  : "bg-slate-100 hover:bg-slate-100",
                "py-1 px-3 text-sm text-black leading-6 rounded-md"
              )}
            >
              {item.label}
            </Button>
          ))}
        </div>
        {handleForm(defaultForm)}
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

export default Settings;
