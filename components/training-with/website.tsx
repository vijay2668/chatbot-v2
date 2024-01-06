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
import { Info, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
export const Website = ({ chatbotUI, sources }: any) => {
  const router = useRouter();
  const [urls, setUrls] = useState<any>([]);
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [fetching, setfetching] = useState(false);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    websiteURL: z.string().min(1, {
      message: "WEBSITE NAME is required."
    })
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteURL: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const fetchSublinks = async (e: any, mainURL: string) => {
    e.preventDefault();
    const trimTrailingSlash = (url: string) =>
      url.endsWith("/") ? url.slice(0, -1) : url;

    const trimedSlash = trimTrailingSlash(mainURL);

    const trimHTTPS = (url: string) =>
      url.startsWith("https://") ? url.slice(8) : url;

    const trimed = trimHTTPS(trimedSlash);

    setfetching(true);
    const res = await axios.post("/api/fetchSublinks", { mainURL: trimed });
    console.log(res);
    if (res.status === 200) {
      if (res?.data?.length === 0) {
        toast(() => (
          <div>
            <div className="flex items-center space-x-2">
              <Info width={20} height={20} className="text-indigo-500" />
              Unable to Extract Sublinks
            </div>
            <br />
            <p>Can you Please Add some Links of Main URL</p>
          </div>
        ));
        setUrls([trimedSlash]);
      } else {
        toast.success("Sublinks Fetched");
        setUrls(res.data);
      }
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedUrls.length === 0) return;

    try {
      const res = await axios.post("/api/trainBotWithWebsite", {
        websiteURLs: selectedUrls,
        assistantId: chatbotUI?.bot_id,
        sources: sources
      });

      if (res.status === 200) {
        setUrls([]);
        setSelectedUrls([]);
        setInput("");
        setOpen(false);
        form.reset();
        router.refresh();
      }
      console.log(res);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while training the bot");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={
          urls.length === 0
            ? (e) => fetchSublinks(e, form?.getValues()?.websiteURL)
            : form.handleSubmit(onSubmit)
        }
        className="space-y-4 h-full overflow-hidden flex flex-col"
      >
        <FormField
          control={form.control}
          name="websiteURL"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Enter a Website URL:
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
                    type="submit"
                    variant="destructive"
                    disabled={fetching}
                    // onClick={() => fetchSublinks(field.value)}
                  >
                    Fetch
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            isLoading && "pointer-events-none opacity-50",
            "w-full h-full space-y-2 flex flex-col overflow-hidden"
          )}
        >
          <Label className="uppercase text-xs w-full font-bold text-zinc-500 dark:text-secondary/70">
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
          <div className="h-full w-full overflow-x-hidden overflow-y-scroll scrollbar-hide flex flex-col rounded-xl border">
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
                      const filter = urls.filter((ex: string) => ex !== url);
                      setUrls(filter);
                    }}
                    className="text-red-600 p-1 hover:bg-red-100 cursor-pointer rounded-md"
                  >
                    <X width={16} height={16} />
                  </div>
                </div>
                <Separator className={cn(urls.length - 1 === i && "hidden")} />
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
