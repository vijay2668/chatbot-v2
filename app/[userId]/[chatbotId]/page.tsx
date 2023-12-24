"use client";
import { useParams } from "next/navigation";
import styles from "@/styles/Home.module.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import LoadingDots from "@/components/LoadingDots";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface ChatMessage {
  role: string;
  message: string;
}

const ChatbotPage = () => {
  const params = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentChatbot, setCurrentChatbot] = useState<any>(null);
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentThread, setCurrentThread] = useState<any>(null);
  const chatbotUI = user?.chatbots?.find(
    (item: any) => item.bot_id === params?.chatbotId
  );

  useEffect(() => {
    if (params?.userId) {
      const fetch = async () => {
        const user = await axios.post("/api/getUserById", {
          id: params?.userId
        });
        setUser(user?.data);
      };
      fetch();
    }
  }, [params?.userId]);

  useEffect(() => {
    if (user?.openAIAPIkey) {
      const getAllAssistants = async () => {
        try {
          const assistants = await axios.get("/api/getAllAssistants");
          const filterCurrentChatbot = assistants?.data?.find(
            (chatbot: any) => chatbot?.id === chatbotUI?.bot_id
          );
          setCurrentChatbot(filterCurrentChatbot);
        } catch (error) {
          console.error("Error fetching assistants:", error);
        }
      };
      getAllAssistants();
    }
  }, [chatbotUI?.bot_id, user?.openAIAPIkey]);

  // ... (other useEffect blocks remain the same)

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
        role: "user",
        message: question
      }
    ]);

    setLoading(true);
    setQuery("");

    try {
      const response = await axios.post("/api/chat", {
        question,
        assistant: currentChatbot,
        currentThread: currentThread
      });
      const data = await response.data;

      if (data.last_error) {
        toast.error(data.last_error.message);
      } else {
        setMessages((prevChats: ChatMessage[]) => [
          ...prevChats,
          {
            role: "bot",
            message: data.content[0].text.value
          }
        ]);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error in chat request:", error);
    } finally {
      setLoading(false);
    }
  }

  // Prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === "Enter" && query) {
      handleSubmit(e);
    } else if (e.key == "Enter") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (chatbotUI) {
      const createFirstThread = async () => {
        const getCreatedThread = await axios.get("/api/createThread");
        setCurrentThread(getCreatedThread.data);
      };
      createFirstThread();
    }
  }, [chatbotUI]);

  // Set initial bot greeting message
  useEffect(() => {
    // if (currentChatbot?.name) {
    setMessages([
      {
        message: chatbotUI?.welcome_message,
        role: "bot"
      }
    ]);

  }, [chatbotUI?.welcome_message]);

  if (chatbotUI) {
    return (
      <div className="max-w-full w-full justify-end p-4 h-full items-end flex flex-col space-y-4 right-0">
        {open && (
          <div className="h-full bg-white flex flex-col border rounded-2xl overflow-hidden  w-full">
            <div
              style={{ background: chatbotUI?.accent_colour }}
              className={cn(
                `rounded-t-2xl flex items-center justify-center  w-full h-2/6`
              )}
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <img
                  alt={chatbotUI?.company_logo}
                  src={chatbotUI?.company_logo}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <Label className="font-semibold text-white text-lg capitalize">
                  {chatbotUI?.company_name}
                </Label>
                <Label className="capitalize text-white/80 text-xs">
                  {chatbotUI?.subheading}
                </Label>
              </div>
            </div>
            <div className="flex flex-col overflow-hidden w-full h-full">
              <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex flex-col overflow-y-scroll">
                  {messages.map((message: any, index: number) => {
                    let icon;
                    let className;

                    // Determine message sender (bot or user)
                    if (message.role === "bot") {
                      icon = (
                        <img
                          key={index}
                          src={chatbotUI?.bot_avatar}
                          alt="AI"
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      );
                      className = "relative p-4 flex space-x-1";
                    } else {
                      icon = (
                        <img
                          key={index}
                          src="/usericon.png"
                          alt="AI"
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      );
                      // The latest message sent by the user will be animated while waiting for a response
                      className = "relative p-4 flex space-x-1";
                    }

                    return (
                      <div key={`chatMessage-${index}`} className={className}>
                        {icon}
                        <div className="text-sm p-2 px-3 bg-gray-100 rounded-xl">
                          <ReactMarkdown>{message.message}</ReactMarkdown>
                        </div>
                      </div>
                    );
                  })}
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
                  className="text-gray-400 relative h-full min-w-[30px] flex items-center justify-start"
                >
                  {loading ? (
                    <div className="flex items-center w-full h-full justify-start">
                      <LoadingDots color="#000" />
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
        )}
        <Button
          onClick={() => setOpen(!open)}
          style={{ background: chatbotUI?.accent_colour }}
          className="rounded-full p-2 h-fit"
        >
          {open ? (
            <X width={32} height={32} className="p-1" />
          ) : (
            <img
              src={chatbotUI?.chat_bubble_icon}
              alt={chatbotUI?.chat_bubble_icon}
              className="w-8 h-8 object-cover"
            />
          )}
        </Button>
      </div>
    );
  }
};

export default ChatbotPage;
