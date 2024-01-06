"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { useState } from "react";
import { Label } from "../ui/label";
import { MdOutlineDelete } from "react-icons/md";
import { FiFile } from "react-icons/fi";
import { Separator } from "../ui/separator";
import { PiFileCloudLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const Files = ({ chatbotUI, sources }: any) => {
  const router = useRouter();

  const [files, setfiles] = useState<any>([]);

  const formSchema = z.object({
    files: z
      .array(z.any())
      .min(1, "One PDF is required")
      .refine(
        (files) => files[0]?.type?.includes("application/pdf"),
        ".pdf file is only accepted."
      )
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: []
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { files } = values;

      const formData = new FormData();
      for (let file of files) {
        formData.append("files", file);
      }

      formData.append("assistantId", chatbotUI?.bot_id);
      formData.append("sources", sources);

      const response = await axios.post("/api/trainBotWithFiles", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log(files);
      if (response.status === 200) {
        setfiles([]);
        form.reset();
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while training the bot");
    }
  };

  const handleFileDelete = (file: any) => {
    const filteredFiles = files?.filter((f: any) => f?.name !== file?.name);
    form.reset({ files: filteredFiles });
    setfiles(filteredFiles);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 h-full overflow-hidden flex flex-col"
      >
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                PDF Files:
              </FormLabel>
              <span className="text-red-600 text-lg">*</span>
              <FormControl>
                <Label
                  htmlFor="file"
                  className="h-fit w-full flex flex-col space-y-4 cursor-pointer items-center justify-center border-2 border-dashed border-indigo-500 p-4 rounded-xl shadow-lg text-indigo-500"
                >
                  <div className="flex flex-col w-fit h-fit">
                    <PiFileCloudLight className="w-fit h-14" />
                  </div>

                  <Label className="cursor-pointer text-black">
                    Click to upload the files
                  </Label>

                  <Input
                    type="file"
                    id="file"
                    accept=".pdf"
                    multiple
                    disabled={isLoading}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value=""
                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 hidden text-black focus-visible:ring-offset-0"
                    placeholder="attach your files"
                    onChange={(e: any) => {
                      field.onChange([...e.target.files]);
                      setfiles([...e.target.files]);
                    }}
                    name={field.name}
                  />
                </Label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            isLoading && "pointer-events-none opacity-50",
            "flex flex-col h-full overflow-hidden border border-gray-200 rounded-xl py-4"
          )}
        >
          <div className="flex flex-col h-full overflow-scroll space-y-2 scrollbar-hide">
            {files?.map((file: any, index: number) => (
              <>
                <div
                  key={index}
                  className="flex items-center text-gray-600 space-x-1 px-3"
                >
                  <div>
                    <FiFile className="text-xl" />
                  </div>
                  <Label className="whitespace-nowrap leading-5 w-full overflow-scroll scrollbar-hide">
                    {file?.name}
                  </Label>
                  <button
                    onClick={() => handleFileDelete(file)}
                    type="button"
                    className="hover:text-red-500"
                  >
                    <MdOutlineDelete className="text-xl" />
                  </button>
                </div>
                <Separator />
              </>
            ))}
          </div>
        </div>
        <Button
          // className={cn(hide && "hidden")}
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? "Uploading & Training Bot..." : "Upload & Train"}
        </Button>
      </form>
    </Form>
  );
};
