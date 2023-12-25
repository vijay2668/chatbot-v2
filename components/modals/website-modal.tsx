"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Info, Minus, Plus, X } from "lucide-react";

export const WebsiteModal = ({ user }: any) => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "website";

  const formSchema = z.object({
    websiteURL: z.string().min(1, {
      message: "WEBSITE NAME is required."
    }),
    chatbotName: z.string().min(1, {
      message: "Chatbot Name is required"
    }),
    chatbotInstructions: z.string().optional(),
    openAIAPIkey: z.string().min(1, {
      message: "OpenAI API key is required"
    })
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteURL: "",
      chatbotName: "",
      chatbotInstructions: "",
      openAIAPIkey: ""
    }
  });

  useEffect(() => {
    if (user) {
      form.setValue("openAIAPIkey", user.openAIAPIkey);
    }
  }, [form, user]);

  const [urls, setUrls] = useState<any>([]);
  const [selectedUrls, setSelectedUrls] = useState([]);

  const handleClose = () => {
    if (user?.openAIAPIkey) {
      form.setValue("websiteURL", "");
      form.setValue("chatbotName", "");
      form.setValue("chatbotInstructions", "");
    } else {
      form.reset();
    }
    setInput("");
    setOpen(false);
    setUrls([]);
    setSelectedUrls([]);
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (hide) return;
    const trimTrailingSlash = (url: string) =>
      url.endsWith("/") ? url.slice(0, -1) : url;

    values.websiteURL = trimTrailingSlash(values.websiteURL);

    try {
      const res = await axios.post("/api/createAssistantWithWebsite", {
        ...values,
        websiteURLs: selectedUrls
      });

      if (res.status === 200) {
        const assistant = res?.data?.assistant;
        const bot_ui_data = {
          bot_id: assistant?.id,
          bot_name: "New Bot",
          company_name: "",
          description: "",
          company_logo: "",
          bot_avatar: "",
          chat_bubble_icon: "BiSupport",
          accent_colour: "#6366f1",
          subheading: "Our bot answers instantly",
          welcome_message: "Hey there, how can I help you?",
          input_box_placeholder: "Send a message...",
          botsonic_branding_on_the_widget: "show",
          widget_position: "right",
          show_sources_with_the_response: "show",
          post_chat_feedback: "show",
          widget: "open",
          show_floating_welcome_message: false,
          show_floating_starter_questions: false
        };

        const createUI = await axios.post("/api/createChatbotUI", bot_ui_data);

        if (createUI) {
          toast(() => (
            <div>
              <div className="flex items-center space-x-2">
                <Info width={20} height={20} className="text-indigo-500" />
                Your Bot is Created
              </div>
              <br />
              <p>Give the Bot few minutes to be trained!</p>
            </div>
          ));
          handleClose();
          console.log(res);
        }
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const [fetching, setfetching] = useState(false);

  const fetchSublinks = async (mainURL: string) => {
    const trimTrailingSlash = (url: string) =>
      url.endsWith("/") ? url.slice(0, -1) : url;

    const trimedSlash = trimTrailingSlash(mainURL);

    const trimHTTPS = (url: string) =>
      url.startsWith("https://") ? url.slice(8) : url;

    const trimed = trimHTTPS(trimedSlash);

    setfetching(true);
    const res = await axios.post("/api/fetchSublinks", { mainURL: trimed });

    if (res.status === 200) {
      toast.success("Sublinks Fetched");
      setUrls(res.data);
      setfetching(false);
    } else {
      toast.error("Failed to fetch sublinks");
      setfetching(false);
    }
  };

  const handleCheckboxClick = (url: string) => {
    setSelectedUrls((prevSelectedUrls: any) => {
      if (prevSelectedUrls.includes(url)) {
        // If URL is already in the array, remove it
        return prevSelectedUrls.filter(
          (selectedUrl: any) => selectedUrl !== url
        );
      } else {
        // If URL is not in the array, add it
        return [...prevSelectedUrls, url];
      }
    });
  };

  const hide =
    selectedUrls.length === 0 ||
    form.getValues().chatbotName === "" ||
    !form.getValues().chatbotName ||
    form.getValues().openAIAPIkey === "" ||
    !form.getValues().openAIAPIkey;

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={() => !isLoading && handleClose()}>
      <DialogContent className="bg-white max-w-[80vw] w-full text-black p-0 max-h-screen overflow-hidden flex flex-col">
        <DialogHeader className="pt-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add your Website URL
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 max-h-full overflow-hidden flex flex-col"
          >
            <div className="space-y-2 px-6 w-full max-h-full flex flex-col">
              <div className="flex items-center w-full justify-start">
                <FormField
                  control={form.control}
                  name="websiteURL"
                  render={({ field }) => {
                    delete field.disabled;
                    return (
                      <FormItem className="w-full px-2">
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                          Website URL
                        </FormLabel>
                        <span className="text-red-600 text-lg">*</span>
                        <div className="flex items-center space-x-2 w-full">
                          <FormControl>
                            <Input
                              disabled={isLoading || fetching}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                              placeholder="Enter Website URL"
                              {...field}
                            />
                          </FormControl>
                          {urls?.length === 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              disabled={fetching}
                              onClick={() => fetchSublinks(field.value)}
                            >
                              Fetch
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex w-full items-start justify-center">
                <div className="space-y-2 w-1/2 flex-1 px-2 max-h-full flex flex-col">
                  <FormField
                    control={form.control}
                    name="chatbotName"
                    render={({ field }) => {
                      delete field.disabled;
                      return (
                        <FormItem>
                          <FormLabel className="uppercase whitespace-nowrap text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Chatbot Name
                          </FormLabel>
                          <span className="text-red-600 text-lg">*</span>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                              placeholder="Enter Chatbot Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="chatbotInstructions"
                    render={({ field }) => {
                      delete field.disabled;
                      return (
                        <FormItem>
                          <FormLabel className="uppercase whitespace-nowrap text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Chatbot Instructions
                          </FormLabel>
                          <span className="text-xs font-bold text-zinc-500">
                            {" "}
                            (Optional)
                          </span>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                              placeholder="Enter Chatbot Instructions (Optional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="openAIAPIkey"
                    render={({ field }) => {
                      delete field.disabled;
                      return (
                        <FormItem>
                          <FormLabel className="uppercase whitespace-nowrap text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            OpenAI API Key
                          </FormLabel>
                          <span className="text-red-600 text-lg">*</span>
                          <FormControl>
                            <Input
                              disabled={isLoading || user?.openAIAPIkey}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                              placeholder="Enter OpenAI API Key"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="border-l p-2 w-1/2 space-y-2 flex flex-col">
                  <Label className="uppercase text-xs w-full whitespace-nowrap font-bold text-zinc-500 dark:text-secondary/70">
                    Choose The URLs and you can also{" "}
                    <Button
                      type="button"
                      onClick={() => setOpen(!open)}
                      variant="link"
                      className="p-0 text-indigo-500 h-fit"
                    >
                      Add
                    </Button>{" "}
                    Urls
                  </Label>
                  {open && (
                    <div className="flex items-center space-x-1">
                      <Input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter URL"
                      />
                      <div
                        onClick={() => {
                          if (!input) {
                            toast.error("URL is required");
                            return;
                          }
                          const trimTrailingSlash = (url: string) =>
                            url.endsWith("/") ? url.slice(0, -1) : url;
                          const trimed = trimTrailingSlash(input);

                          if (urls.includes(trimed)) {
                            toast.error("This URL is Already exist");
                          } else {
                            setUrls((prev: any) => [...prev, trimed]);
                            setInput("");
                          }
                        }}
                        className="min-w-[40px] h-10 transition-all flex items-center justify-center cursor-pointer rounded-lg hover:bg-indigo-50"
                      >
                        <Plus width={16} height={16} />
                      </div>
                    </div>
                  )}
                  <Separator />
                  <div className="h-48 w-full overflow-x-hidden overflow-y-scroll scrollbar-hide flex flex-col rounded-md border">
                    {urls?.map((url: string, i: number) => (
                      <>
                        <div
                          key={i}
                          className="flex py-1 px-2 min-h-[40px] min-w-full items-center overflow-x-hidden space-x-2"
                        >
                          <Checkbox
                            id={`checkbox-${i}`}
                            onCheckedChange={() => handleCheckboxClick(url)}
                            // checked={selectedUrls.includes(url)}
                          />
                          <Label
                            htmlFor={`checkbox-${i}`}
                            className="w-full cursor-pointer leading-8 overflow-hidden flex flex-col"
                          >
                            <p className="whitespace-nowrap overflow-x-scroll overflow-y-hidden scrollbar-hide">
                              {url}
                            </p>
                          </Label>
                          <div
                            onClick={() => {
                              const filter = urls.filter(
                                (ex: string) => ex !== url
                              );
                              setUrls(filter);
                            }}
                            className="text-red-600 p-1 hover:bg-red-100 cursor-pointer rounded-md"
                          >
                            <X width={16} height={16} />
                          </div>
                        </div>
                        <Separator
                          className={cn(urls.length - 1 === i && "hidden")}
                        />
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-2">
              <Button
                className={cn(hide && "hidden")}
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? "Training Bot..." : "Train bot"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
