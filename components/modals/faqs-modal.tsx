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
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/use-modal-store";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const FAQsModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "FAQ";

  const formSchema = z.object({
    question: z.string().min(1, {
      message: "Question is required"
    }),
    answer: z.string().min(1, {
      message: "Answer is required"
    })
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: ""
    }
  });

  useEffect(() => {
    if (data?.question) {
      form.setValue("question", data?.question);
    }
  }, [data?.question, form]);

  useEffect(() => {
    if (data?.faq) {
      form.setValue("question", data?.faq?.question);
      form.setValue("answer", data?.faq?.answer);
    }
  }, [data?.faq, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  console.log(data);
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (data?.faq) {
        const response = await axios.post("/api/modifyStarterQuestion", {
          ...values,
          faq_id: data?.faq?.id
        });
        if (response.status === 200) {
          handleClose();
          toast.success("Successfully updated FAQ!");
          router.refresh();
        }
        return;
      }

      const response = await axios.post("/api/addFAQ", {
        ...values,
        chatbotId: data.chatbotId
      });

      if (response.status === 200) {
        handleClose();
        toast.success("Successfully added FAQ!");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred While creating FAQ"
      );
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => !isLoading && handleClose()}>
      <DialogContent className="bg-white text-black p-0 max-h-screen overflow-hidden flex flex-col">
        <DialogHeader className="pt-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {data?.faq ? "Update a FAQ" : "Add a New FAQ"}
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
                name="question"
                render={({ field }) => {
                  delete field.disabled;
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Question
                      </FormLabel>
                      <span className="text-red-600 text-lg">*</span>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
                name="answer"
                render={({ field }) => {
                  delete field.disabled;
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Answer
                      </FormLabel>
                      <span className="text-red-600 text-lg">*</span>
                      <FormControl>
                        <Textarea
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
              <Button variant="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
