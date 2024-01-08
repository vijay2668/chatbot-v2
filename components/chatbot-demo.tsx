"use client";
import styles from "@/styles/Home.module.css";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import LoadingDots from "./LoadingDots";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { FAQ, Role } from "@prisma/client";

interface ChatMessage {
  role: string;
  message: string;
}

// Destructure props directly in the function parameters
export const ChatbotDemoPage = ({ chatbotUI, assistant, thread }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Set initial bot greeting message
  useEffect(() => {
    setMessages([
      {
        message: chatbotUI?.welcome_message,
        role: Role.BOT
      }
    ]);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query) {
      // Use toast notification instead of alert
      toast.error("Please input a question");
      return;
    }

    const question = query.trim();

    setMessages((prevChats: ChatMessage[]) => [
      ...prevChats,
      {
        role: Role.USER,
        message: question
      }
    ]);

    setLoading(true);
    setQuery("");

    try {
      const response = await axios.post("/api/chat", {
        question,
        assistant: assistant,
        threadId: thread?.id,
        count
      });
      const data = await response.data;

      if (data.last_error) {
        toast.error(data.last_error.message);
        return;
      }

      if (data?.files_not_uploaded_message) {
        setMessages((prevChats: ChatMessage[]) => [
          ...prevChats,
          {
            role: Role.BOT,
            message: data.files_not_uploaded_message
          }
        ]);
        return;
      }

      if (data?.messages_limit_warning_message) {
        setMessages((prevChats: ChatMessage[]) => [
          ...prevChats,
          {
            role: Role.BOT,
            message: data.messages_limit_warning_message
          }
        ]);
        return;
      }

      setMessages((prevChats: ChatMessage[]) => [
        ...prevChats,
        {
          role: Role.BOT,
          message: data.content
        }
      ]);

      setCount(count + 1);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error in chat request:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFaqSubmit = async (query: string) => {
    const question = query.trim();

    setMessages((prevChats: ChatMessage[]) => [
      ...prevChats,
      {
        role: Role.USER,
        message: question
      }
    ]);

    setLoading(true);
    setQuery("");

    try {
      const response = await axios.post("/api/chat", {
        question,
        assistant: assistant,
        threadId: thread?.id,
        count
      });
      const data = await response.data;

      if (data.last_error) {
        toast.error(data.last_error.message);
        return;
      }

      if (data?.files_not_uploaded_message) {
        setMessages((prevChats: ChatMessage[]) => [
          ...prevChats,
          {
            role: Role.BOT,
            message: data.files_not_uploaded_message
          }
        ]);
        return;
      }

      if (data?.messages_limit_warning_message) {
        setMessages((prevChats: ChatMessage[]) => [
          ...prevChats,
          {
            role: Role.BOT,
            message: data.messages_limit_warning_message
          }
        ]);
        return;
      }

      setMessages((prevChats: ChatMessage[]) => [
        ...prevChats,
        {
          role: Role.BOT,
          message: data.content
        }
      ]);

      setCount(count + 1);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error in chat request:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === "Enter" && query) {
      handleSubmit(e);
    } else if (e.key == "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-full w-full bg-transparent justify-end h-full items-end flex flex-col space-y-4">
      <div className="h-full bg-transparent flex flex-col border rounded-2xl overflow-hidden  w-full">
        <div
          style={{ background: chatbotUI?.accent_colour }}
          className={cn(
            `rounded-t-2xl flex items-center justify-start  w-full h-fit p-4 py-6`
          )}
        >
          <div className="flex items-center justify-center space-x-3">
            <img
              alt={chatbotUI?.company_logo}
              src={chatbotUI?.company_logo}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <Label className="font-semibold text-white text-lg leading-5 capitalize">
                {chatbotUI?.company_name}
              </Label>
              <Label className="capitalize text-white/80 text-xs leading-5">
                {chatbotUI?.subheading}
              </Label>
            </div>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden w-full h-full">
          <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex flex-col overflow-y-scroll scrollbar-hide">
              {messages.map((message: any, index: number) => {
                let icon;
                let className;

                // Determine message sender (bot or user)
                if (message.role === Role.BOT) {
                  icon = (
                    <div className="p-1 mt-1.5 border border-black rounded-full">
                      <img
                        id="chat-bubble-icon"
                        src={chatbotUI?.chat_bubble_icon}
                        alt="chat bubble icon"
                        className="w-3 h-3"
                      />
                    </div>
                  );
                  className =
                    "relative p-4 flex space-x-1 items-start justify-start";
                } else {
                  icon = (
                    <div
                      style={{
                        borderColor:
                          message.role === Role.USER && chatbotUI?.accent_colour
                      }}
                      className="p-1 mt-1.5 border rounded-full"
                    >
                      <User
                        style={{
                          color:
                            message.role === Role.USER &&
                            chatbotUI?.accent_colour
                        }}
                        width={12}
                        height={12}
                      />
                    </div>
                  );
                  // The latest message sent by the user will be animated while waiting for a response
                  className =
                    "relative p-4 flex items-start justify-end space-x-1";
                }

                return (
                  <div key={`chatMessage-${index}`} className={className}>
                    {icon}
                    <div
                      style={{
                        background:
                          message.role === Role.USER && chatbotUI?.accent_colour
                      }}
                      className={cn(
                        message.role === Role.USER && "text-white",
                        "text-sm p-2 px-2 bg-gray-100 shadow-md max-w-[250px] rounded-xl"
                      )}
                    >
                      <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col w-full h-fit">
            <div className="px-2 pb-2 flex items-center space-x-2 w-full h-fit overflow-scroll scrollbar-hide">
              {chatbotUI?.faqs?.map((faq: FAQ) => (
                <button
                  type="button"
                  onClick={() => {
                    handleFaqSubmit(faq.question);
                  }}
                  key={faq.id}
                  className="bg-indigo-500 text-sm cursor-pointer rounded-xl text-white px-2 py-1 w-fit h-fit whitespace-nowrap"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>
          <Separator />
          <form className="flex items-center" onSubmit={handleSubmit}>
            <Input
              disabled={loading}
              autoFocus={true}
              onKeyDown={handleEnter}
              id="userInput"
              name="userInput"
              placeholder={
                loading
                  ? "Waiting for response..."
                  : chatbotUI?.input_box_placeholder
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 text-base focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
            />
            <button
              type="submit" // Set type to "submit"
              disabled={loading}
              style={{
                color: chatbotUI?.accent_colour
              }}
              className="text-gray-400 relative h-full min-w-[30px] flex items-center justify-start"
            >
              {loading ? (
                <div className="flex items-center w-full h-full justify-start">
                  <LoadingDots color={chatbotUI?.accent_colour} />
                </div>
              ) : (
                <svg
                  viewBox="0 0 20 20"
                  className={styles.svgicon}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
