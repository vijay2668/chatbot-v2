"use client";

import { useRef, useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import LoadingDots from "@/components/LoadingDots";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import axios from "axios";
import { Combobox } from "@/components/combo-box";
import { useRouter } from "next/navigation";

// Component
export function ChatBot({ user }: any) {
  // State
  const [chatbots, setChatbots] = useState<any>([]);
  const [currentThread, setCurrentThread] = useState<any>(null);
  const [currentChatbot, setCurrentChatbot] = useState<any>(null);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const router = useRouter()
  useEffect(() => {
    if (currentChatbot) {
      const createFirstThread = async () => {
        const getCreatedThread = await axios.get("/api/createThread");
        setCurrentThread(getCreatedThread.data);
      };
      createFirstThread();
      setError("");
    }
  }, [currentChatbot]);

  useEffect(() => {
    if (user?.openAIAPIkey) {
      const getAllAssistants = async () => {
        //Getting all Assistant which have been made by user
        const assistants = await axios.get("/api/getAllAssistants");
        setChatbots(assistants?.data);
      };
      getAllAssistants();
    } else {
      router.push("/dashboard")
    }
  }, [router, user?.openAIAPIkey]);

  console.log(chatbots);
  // Refs
  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Set initial bot greeting message
  useEffect(() => {
    if (currentChatbot?.name) {
      setMessages([
        {
          message: `👋 Hello there! Welcome to our ${currentChatbot?.name}!`,
          role: "bot"
        }
      ]);
    }
  }, [currentChatbot?.name]);

  // Focus on text area when component mounts
  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  // Handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert("Please input a question");
      return;
    }

    const question = query.trim();

    setMessages((prevChats: any) => [
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
        setError(data.last_error.message);
      } else {
        setMessages((prevChats: any) => [
          ...prevChats,
          {
            role: "bot",
            message: data.content[0].text.value
          }
        ]);
      }

      setLoading(false);

      // Scroll to bottom
      messageListRef?.current?.scrollTo(
        0,
        messageListRef?.current?.scrollHeight
      );
    } catch (error) {
      setLoading(false);
      setError("An error occurred while fetching the data. Please try again.");
      console.log("error", error);
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

  // JSX
  if (chatbots) {
    return (
      <div className="mx-auto flex flex-col w-full h-full space-y-4">
        <header className="sticky top-0 z-40 bg-white">
          <div className="h-16 left-0 px-8 border-b flex items-center justify-between border-b-slate-200 py-4">
            <nav className="">
              <Link
                href="/dashboard"
                className="hover:text-slate-600 cursor-pointer"
              >
                Dashboard
              </Link>
            </nav>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>
        <div>
          <main className="flex flex-col items-center w-full flex-1 overflow-hidden">
            {/* Combobox for selecting chatbots */}
            <Combobox
              chatbots={chatbots}
              setCurrentChatbot={setCurrentChatbot}
            />
            <div className="flex flex-col justify-between items-center w-full h-full py-4">
              <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
                Chat With Your Docs
              </h1>
              <main className={styles.main}>
                {/* Chat messages container */}
                <div className={styles.cloud}>
                  <div ref={messageListRef} className={styles.messagelist}>
                    {messages.map((message: any, index: number) => {
                      let icon;
                      let className;

                      // Determine message sender (bot or user)
                      if (message.role === "bot") {
                        icon = (
                          <Image
                            key={index}
                            src="/bot-image.png"
                            alt="AI"
                            width="40"
                            height="40"
                            className={styles.boticon}
                            priority
                          />
                        );
                        className = styles.apimessage;
                      } else {
                        icon = (
                          <Image
                            key={index}
                            src="/usericon.png"
                            alt="Me"
                            width="30"
                            height="30"
                            className={styles.usericon}
                            priority
                          />
                        );
                        // The latest message sent by the user will be animated while waiting for a response
                        className =
                          loading && index === messages.length - 1
                            ? styles.usermessagewaiting
                            : styles.usermessage;
                      }

                      return (
                        <div key={`chatMessage-${index}`} className={className}>
                          {icon}
                          <div className={styles.markdownanswer}>
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Input form for user queries */}
                <div className={styles.center}>
                  <div className={styles.cloudform}>
                    <form onSubmit={handleSubmit}>
                      <textarea
                        disabled={loading}
                        onKeyDown={handleEnter}
                        ref={textAreaRef}
                        autoFocus={false}
                        rows={1}
                        maxLength={512}
                        id="userInput"
                        name="userInput"
                        placeholder={
                          loading ? "Waiting for response..." : "Ask"
                        }
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={styles.textarea}
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className={styles.generatebutton}
                      >
                        {loading ? (
                          <div className={styles.loadingwheel}>
                            <LoadingDots color="#000" />
                          </div>
                        ) : (
                          // Send icon SVG in input field
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

                {/* Display error message */}
                {error && (
                  <div className="border border-red-400 rounded-md p-4">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}
              </main>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
