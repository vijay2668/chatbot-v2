"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const FileUploadModal = ({ user }: any) => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "file";

  const formSchema = z.object({
    files: z.any(),
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
      files: [],
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

  const handleClose = () => {
    if (user?.openAIAPIkey) {
      form.setValue("files", []);
      form.setValue("chatbotName", "");
      form.setValue("chatbotInstructions", "");
    } else {
      form.reset();
    }
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (hide) return;
    try {
      const { files, openAIAPIkey, chatbotName, chatbotInstructions } = values;

      if (files.length === 0) {
        toast.error("At least one file is required");
        return;
      }

      const formData = new FormData();
      for (let file of files) {
        formData.append("files", file);
      }

      formData.append("chatbotName", chatbotName);
      formData.append("chatbotInstructions", chatbotInstructions || "");
      formData.append("openAIAPIkey", openAIAPIkey);

      const response = await axios.post(
        "/api/createAssistantWithFiles",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      console.log(response);
      if (response.status === 200) {
        const assistant = response?.data?.assistant;
        const bot_ui_data = {
          bot_id: assistant?.id,
          bot_name: "New Bot",
          company_name: "",
          description: "",
          company_logo: "",
          bot_avatar: "",
          chat_bubble_icon: "https://utfs.io/f/2092fc67-cb66-498b-aafe-adea4e250573-55pms0.svg",
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
          console.log(response);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const hide =
    form.getValues().files.length === 0 ||
    !form.getValues().files ||
    form.getValues().chatbotName === "" ||
    !form.getValues().chatbotName ||
    form.getValues().openAIAPIkey === "" ||
    !form.getValues().openAIAPIkey;

  return (
    <Dialog open={isModalOpen} onOpenChange={() => !isLoading && handleClose()}>
      <DialogContent className="bg-white text-black p-0 max-h-screen overflow-hidden flex flex-col">
        <DialogHeader className="pt-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Attach a file for training bot
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 max-h-full overflow-hidden flex flex-col"
          >
            <div className="space-y-2 px-6 overflow-y-scroll scrollbar-hide max-h-full flex flex-col">
              <div className="flex items-center justify-start w-full">
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        PDF Files
                      </FormLabel>
                      <span className="text-red-600 text-lg">*</span>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          multiple
                          disabled={isLoading}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="attach your files"
                          onChange={(e: any) => {
                            form.setValue("files", e.target.files);
                          }}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="chatbotName"
                render={({ field }) => {
                  delete field.disabled;
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
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
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
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
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
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
