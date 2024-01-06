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
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export const CreateBotModal = ({ user }: any) => {
  const { isOpen, data, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "newchatbot";

  const formSchema = z.object({
    chatbotName: z.string().min(1, {
      message: "Chatbot Name is required"
    }),
    openAIAPIkey: z.string().min(1, {
      message: "OpenAI API key is required"
    })
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatbotName: "",
      openAIAPIkey: ""
    }
  });

  useEffect(() => {
    if (user?.user_key) {
      form.setValue("openAIAPIkey", atob(user?.user_key));
    }
  }, [form, user?.user_key]);

  useEffect(() => {
    if (data?.name) {
      form.setValue("chatbotName", data?.name);
    } else {
      form.setValue("chatbotName", "");
    }
  }, [data?.name, form]);

  const handleClose = () => {
    if (atob(user?.user_key)) {
      form.setValue("chatbotName", data?.name ? data?.name : "");
    } else {
      form.reset();
    }
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (data?.name) {
        const response = await axios.post("/api/renameBot", {
          chatbotName: values.chatbotName,
          assistantId: data.id
        });

        console.log(response);
        if (response.status === 200) {
          toast.success("You Support Bot is renamed");
          handleClose();
          router.refresh();
        }
      } else {
        const response = await axios.post("/api/createBot", values);

        console.log(response);
        if (response.status === 200) {
          toast.success("You Support Bot is created");
          handleClose();
          router.refresh();
          router.push(`/chatbots/settings/${response.data.chatbot.id}`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating Bot");
    }
  };

  const hide =
    form.getValues().chatbotName === "" ||
    !form.getValues().chatbotName ||
    form.getValues().openAIAPIkey === "" ||
    !form.getValues().openAIAPIkey;

  return (
    <Dialog open={isModalOpen} onOpenChange={() => !isLoading && handleClose()}>
      <DialogContent className="bg-white text-black p-0 max-h-screen overflow-hidden flex flex-col">
        <DialogHeader className="pt-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {data.name ? "Rename Bot" : "New Bot"}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 max-h-full overflow-hidden flex flex-col"
          >
            <div className="space-y-2 px-6 overflow-y-scroll scrollbar-hide max-h-full flex flex-col">
              <FormField
                control={form.control}
                name="chatbotName"
                render={({ field }) => {
                  delete field.disabled;
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        {data.name
                          ? "Bot name"
                          : "What would you like to name your bot?"}
                      </FormLabel>
                      <span className="text-red-600 text-lg">*</span>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Enter bot name"
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
                          type="password"
                          disabled={isLoading}
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
                {isLoading
                  ? data?.name
                    ? "Saving..."
                    : "Creating Bot..."
                  : data?.name
                  ? "Save"
                  : "Create Bot"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
