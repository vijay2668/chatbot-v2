import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/use-modal-store";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ThumbsUp } from "lucide-react";
import * as z from "zod";

type FormData = {
  heading_level_1: string;
  heading_level_2: string;
  bold: string;
  italics: string;
  list: string;
  ordered_list: string;
  hyperlink: string;
  blockquotes: string;
};

export const LearnMoreModal: React.FC = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "learnMore";
  const [copied, setCopied] = useState(false);

  const formSchema = z.object({
    heading_level_1: z.string(),
    heading_level_2: z.string(),
    bold: z.string(),
    italics: z.string(),
    list: z.string(),
    ordered_list: z.string(),
    hyperlink: z.string(),
    blockquotes: z.string()
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading_level_1: "# Heading",
      heading_level_2: "## Heading",
      bold: "This text is in **bold**",
      italics: "This text is *really important*",
      list: "- First item \n- Second item",
      ordered_list: "1. First item \n2. Second item",
      hyperlink: "This text is a [Link](link goes here)",
      blockquotes: "> This text will look like a quote"
    }
  });

  const handleClose = () => onClose();

  const [copiedBtn, setCopiedBtn] = useState<string | null>(null);

  const handleCopyClick = (field: any, label: string) => {
    navigator.clipboard.writeText(field.value);
    setCopiedBtn(label);

    setTimeout(() => {
      setCopiedBtn(null);
    }, 2000);
  };

  const renderFormItem = (
    name: keyof FormData,
    label: string,
    readOnly: boolean,
    componentType: React.ComponentType<any> = Input
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="uppercase flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-secondary/70">
            <p>{label}</p>
            <button
              type="button"
              onClick={() => handleCopyClick(field, label)}
              className="text-indigo-500"
            >
              {copiedBtn === label ? (
                <div className="flex items-center text-green-600 space-x-1">
                  <ThumbsUp width={14} height={14} />
                  <p>Copied</p>
                </div>
              ) : (
                "Copy"
              )}
            </button>
          </FormLabel>
          <FormControl>
            {React.createElement(componentType, {
              readOnly,
              className:
                "bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0",
              ...field
            })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black px-0 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="pt-2 px-6">
          <DialogTitle className="text-2xl text-start font-bold">
            Using Markdown
          </DialogTitle>

          <Separator />
          <DialogDescription className="text-start">
            <div className="flex flex-col w-full min-h-fit space-y-1">
              <Label className="text-base font-semibold">
                Create richly formatted answers with these simple Markdown
                elements
              </Label>
              <Label className="text-sm font-normal text-gray-400">
                We support the following markdown elements
              </Label>
            </div>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-2 max-h-full overflow-hidden flex flex-col">
            <div className="space-y-2 px-6 overflow-y-scroll scrollbar-hide max-h-full flex flex-col">
              {renderFormItem("heading_level_1", "Heading level 1", true)}
              {renderFormItem("heading_level_2", "Heading level 2", true)}
              {renderFormItem("bold", "Bold", true)}
              {renderFormItem("italics", "Italics", true)}
              {renderFormItem("list", "List", true, Textarea)}
              {renderFormItem("ordered_list", "Ordered List", true, Textarea)}
              {renderFormItem("hyperlink", "Hyperlink", true)}
              {renderFormItem("blockquotes", "Blockquotes", true)}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
