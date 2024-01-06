"use client";
import { ActionTooltip } from "@/components/action-tooltip";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Chat_Bubble_Icons = [
  "https://utfs.io/f/2092fc67-cb66-498b-aafe-adea4e250573-55pms0.svg",
  "https://utfs.io/f/3eb6ad01-1d72-4d0e-a264-78ee579e2b72-1tf88.svg",
  "https://utfs.io/f/368a99c9-d562-4bc1-80cb-9b34e84bbb45-2558r.svg",
  "https://utfs.io/f/2ad99a5e-980e-410e-ab66-02c2f7e4bbc1-9ogxcy.svg",
  "https://utfs.io/f/e7b5709b-eb56-48d2-be38-bc8b85fd7942-uoa3ht.svg",
  "https://utfs.io/f/869ea975-76c3-4f87-861a-53a15b175fe5-1wk75.svg"
];

export const AppearanceForm = ({ chatbotUI }: any) => {
  const [loading, setLoading] = useState(false);
  const [appearanceForm, setAppearanceForm] = useState({
    bot_id: chatbotUI?.bot_id,
    bot_name: chatbotUI?.bot_name || "",
    company_name: chatbotUI?.company_name || "",
    description: chatbotUI?.description || "",
    company_logo: chatbotUI?.company_logo || "",
    bot_avatar: chatbotUI?.bot_avatar || "",
    chat_bubble_icon:
      chatbotUI?.chat_bubble_icon ||
      "https://utfs.io/f/2092fc67-cb66-498b-aafe-adea4e250573-55pms0.svg",
    accent_colour: chatbotUI?.accent_colour || "#6366f1",
    subheading: chatbotUI?.subheading || "Our bot answers instantly",
    welcome_message:
      chatbotUI?.welcome_message || "Hey there, how can I help you?",
    input_box_placeholder:
      chatbotUI?.input_box_placeholder || "Send a message...",
    botsonic_branding_on_the_widget:
      chatbotUI?.botsonic_branding_on_the_widget || "show",
    widget_position: chatbotUI?.widget_position || "right",
    show_sources_with_the_response:
      chatbotUI?.show_sources_with_the_response || "show",
    post_chat_feedback: chatbotUI?.post_chat_feedback || "show",
    widget: chatbotUI?.widget || "open",
    show_floating_welcome_message:
      chatbotUI?.show_floating_welcome_message || false,
    show_floating_starter_questions:
      chatbotUI?.show_floating_starter_questions || false
  });

  const appearanceFormReset = () => {
    setAppearanceForm({
      bot_id: chatbotUI?.bot_id,
      bot_name: chatbotUI?.bot_name || "",
      company_name: chatbotUI?.company_name || "",
      description: chatbotUI?.description || "",
      company_logo: chatbotUI?.company_logo || "",
      bot_avatar: chatbotUI?.bot_avatar || "",
      chat_bubble_icon:
        chatbotUI?.chat_bubble_icon ||
        "https://utfs.io/f/2092fc67-cb66-498b-aafe-adea4e250573-55pms0.svg",
      accent_colour: chatbotUI?.accent_colour || "#6366f1",
      subheading: chatbotUI?.subheading || "Our bot answers instantly",
      welcome_message:
        chatbotUI?.welcome_message || "Hey there, how can I help you?",
      input_box_placeholder:
        chatbotUI?.input_box_placeholder || "Send a message...",
      botsonic_branding_on_the_widget:
        chatbotUI?.botsonic_branding_on_the_widget || "show",
      widget_position: chatbotUI?.widget_position || "right",
      show_sources_with_the_response:
        chatbotUI?.show_sources_with_the_response || "show",
      post_chat_feedback: chatbotUI?.post_chat_feedback || "show",
      widget: chatbotUI?.widget || "open",
      show_floating_welcome_message:
        chatbotUI?.show_floating_welcome_message || false,
      show_floating_starter_questions:
        chatbotUI?.show_floating_starter_questions || false
    });
  };

  const appearanceFormSubmit = async () => {
    try {
      setLoading(true);
      const res: any = await axios.post("/api/updateChatbotUI", {
        id: chatbotUI?.id,
        values: appearanceForm,
        index: 0
      });
      const data = await res.data;
      console.log(data);
      if (res.status === 200) {
        toast.success("bot appearance updated");
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          loading && "opacity-80 pointer-events-none",
          "w-full h-full flex flex-col space-y-4 overflow-y-scroll scrollbar-hide"
        )}
      >
        <div className="flex flex-col w-full min-h-fit space-y-1">
          <Label className="text-base font-semibold">Appearance</Label>
          <Label className="text-sm font-normal text-gray-400">
            Customize how your widget looks like
          </Label>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Bot Name</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Bot description for your personal reference."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <Input
              value={appearanceForm.bot_name}
              onChange={(e) =>
                setAppearanceForm((prev: any) => ({
                  ...prev,
                  bot_name: e.target.value
                }))
              }
              name="bot_name"
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Company Name</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Company Name to be displayed in the chatbot."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <Input
              value={appearanceForm.company_name}
              onChange={(e) =>
                setAppearanceForm((prev: any) => ({
                  ...prev,
                  company_name: e.target.value
                }))
              }
              name="company_name"
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-full space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Description</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Bot description for your personal reference."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <Input
              placeholder="Enter a description for your bot here..."
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              value={appearanceForm.description}
              onChange={(e) =>
                setAppearanceForm((prev: any) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              name="description"
            />
          </div>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Company Logo</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Company Logo to be displayed in the chatbot."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <FileUpload
              onChange={setAppearanceForm}
              endpoint="chatbot"
              customKey="company_logo"
              value={appearanceForm?.company_logo}
            />
          </div>
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Bot Avatar</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Chatbot Picture to be displayed in the chatbot."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <FileUpload
              onChange={setAppearanceForm}
              endpoint="chatbot"
              customKey="bot_avatar"
              value={appearanceForm?.bot_avatar}
            />
          </div>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-full space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Chat bubble icon</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Customize the button style of the chatbot"
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <div className="flex items-center space-x-2 w-full">
              {Chat_Bubble_Icons.map((item: any, index: number) => {
                // console.log(appearanceForm.chat_bubble_icon === item);
                return (
                  <Button
                    key={index}
                    onClick={() => {
                      setAppearanceForm((prev: any) => ({
                        ...prev,
                        chat_bubble_icon: item
                      }));
                    }}
                    variant="outline"
                    className={cn(
                      "p-2",
                      appearanceForm.chat_bubble_icon === item &&
                        "border-indigo-500"
                    )}
                  >
                    <img
                      src={item}
                      alt={item}
                      className="w-8 h-8 object-fill"
                    />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-fit space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Accent colour</p>
            </Label>
            <Input
              value={appearanceForm.accent_colour}
              onChange={(e) =>
                setAppearanceForm((prev: any) => ({
                  ...prev,
                  accent_colour: e.target.value
                }))
              }
              name="accent_colour"
              type="color"
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center w-full space-x-2">
          <div className="w-full space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Subheading</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Chatbot Subheading to be displayed in the chatbot."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              value={appearanceForm.subheading}
              onChange={(e) =>
                setAppearanceForm((prev: any) => ({
                  ...prev,
                  subheading: e.target.value
                }))
              }
              name="subheading"
            />
          </div>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-full space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Welcome Message</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Customize the welcome message that is shown to your customers."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              value={appearanceForm.welcome_message}
              onChange={(e) =>
                setAppearanceForm((prev: any) => ({
                  ...prev,
                  welcome_message: e.target.value
                }))
              }
              name="welcome_message"
            />
          </div>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-full space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Input Box Placeholder</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Chatbot Input Placeholder to be displayed in the chatbot."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              value={appearanceForm.input_box_placeholder}
              onChange={(e) =>
                setAppearanceForm((prev: any) => ({
                  ...prev,
                  input_box_placeholder: e.target.value
                }))
              }
              name="input_box_placeholder"
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center w-full space-x-2">
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Chatbot branding on the widget</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Hide/Show Botsonic banner at the bottom."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <div className="w-fit flex items-center p-1 bg-slate-100 rounded-lg">
              <Button
                onClick={() =>
                  setAppearanceForm((prev: any) => ({
                    ...prev,
                    botsonic_branding_on_the_widget: "show"
                  }))
                }
                className={cn(
                  appearanceForm.botsonic_branding_on_the_widget === "show"
                    ? "bg-white hover:bg-white"
                    : "bg-slate-100 hover:bg-slate-100",
                  "py-1 px-3 text-sm text-black leading-6 rounded-md"
                )}
              >
                Show
              </Button>
              <Button
                onClick={() =>
                  setAppearanceForm((prev: any) => ({
                    ...prev,
                    botsonic_branding_on_the_widget: "hide"
                  }))
                }
                className={cn(
                  appearanceForm.botsonic_branding_on_the_widget === "hide"
                    ? "bg-white hover:bg-white"
                    : "bg-slate-100 hover:bg-slate-100",
                  "py-1 px-3 text-sm leading-6 text-black rounded-md"
                )}
              >
                Hide
              </Button>
            </div>
          </div>
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Widget Position</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Choose the location of the widget. Note: Doesn't work on the preview shown on this page."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <div className="w-fit flex items-center p-1 bg-slate-100 rounded-lg">
              <Button
                onClick={() =>
                  setAppearanceForm((prev: any) => ({
                    ...prev,
                    widget_position: "left"
                  }))
                }
                className={cn(
                  appearanceForm.widget_position === "left"
                    ? "bg-white hover:bg-white"
                    : "bg-slate-100 hover:bg-slate-100",
                  "py-1 px-3 text-sm text-black leading-6 rounded-md"
                )}
              >
                Left
              </Button>
              <Button
                onClick={() =>
                  setAppearanceForm((prev: any) => ({
                    ...prev,
                    widget_position: "right"
                  }))
                }
                className={cn(
                  appearanceForm.widget_position === "right"
                    ? "bg-white hover:bg-white"
                    : "bg-slate-100 hover:bg-slate-100",
                  "py-1 px-3 text-sm leading-6 text-black rounded-md"
                )}
              >
                Right
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Show sources with the response</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Hide/Show sources along with responses"
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <div className="w-fit flex items-center p-1 bg-slate-100 rounded-lg">
              <Button
                onClick={() =>
                  setAppearanceForm((prev: any) => ({
                    ...prev,
                    show_sources_with_the_response: "show"
                  }))
                }
                className={cn(
                  appearanceForm.show_sources_with_the_response === "show"
                    ? "bg-white hover:bg-white"
                    : "bg-slate-100 hover:bg-slate-100",
                  "py-1 px-3 text-sm text-black leading-6 rounded-md"
                )}
              >
                Show
              </Button>
              <Button
                onClick={() =>
                  setAppearanceForm((prev: any) => ({
                    ...prev,
                    show_sources_with_the_response: "hide"
                  }))
                }
                className={cn(
                  appearanceForm.show_sources_with_the_response === "hide"
                    ? "bg-white hover:bg-white"
                    : "bg-slate-100 hover:bg-slate-100",
                  "py-1 px-3 text-sm leading-6 text-black rounded-md"
                )}
              >
                Hide
              </Button>
            </div>
          </div>
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Post chat feedback</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Hide/Show post chat feedback"
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <div className="w-fit flex items-center p-1 bg-slate-100 rounded-lg">
              <Button
                onClick={() =>
                  setAppearanceForm((prev: any) => ({
                    ...prev,
                    post_chat_feedback: "show"
                  }))
                }
                className={cn(
                  appearanceForm.post_chat_feedback === "show"
                    ? "bg-white hover:bg-white"
                    : "bg-slate-100 hover:bg-slate-100",
                  "py-1 px-3 text-sm text-black leading-6 rounded-md"
                )}
              >
                Show
              </Button>
              <Button
                onClick={() =>
                  setAppearanceForm((prev: any) => ({
                    ...prev,
                    post_chat_feedback: "hide"
                  }))
                }
                className={cn(
                  appearanceForm.post_chat_feedback === "hide"
                    ? "bg-white hover:bg-white"
                    : "bg-slate-100 hover:bg-slate-100",
                  "py-1 px-3 text-sm leading-6 text-black rounded-md"
                )}
              >
                Hide
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <RadioGroup
          name="widget"
          defaultValue="open"
          className="space-y-4"
          onValueChange={(e) =>
            setAppearanceForm((prev: any) => ({
              ...prev,
              widget: e
            }))
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="open" id="r1" />
            <Label htmlFor="r1">Widget is open by default</Label>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="close" id="r2" />
              <Label htmlFor="r2">Widget is closed by default</Label>
            </div>
            <div className="flex flex-col space-y-4 ml-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  disabled={appearanceForm.widget === "open"}
                  checked={appearanceForm.show_floating_welcome_message}
                  onCheckedChange={(e: any) =>
                    setAppearanceForm((prev: any) => ({
                      ...prev,
                      show_floating_welcome_message: e
                    }))
                  }
                  name="show_floating_welcome_message"
                  id="show_floating_welcome_message"
                />
                <label
                  htmlFor="show_floating_welcome_message"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show Floating Welcome Message
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  disabled={appearanceForm.widget === "open"}
                  checked={appearanceForm.show_floating_starter_questions}
                  onCheckedChange={(e: any) =>
                    setAppearanceForm((prev: any) => ({
                      ...prev,
                      show_floating_starter_questions: e
                    }))
                  }
                  name="show_floating_starter_questions"
                  id="show_floating_starter_questions"
                />
                <label
                  htmlFor="show_floating_starter_questions"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show Floating Starter Questions
                </label>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
      <Separator />
      <div className="flex items-center w-full justify-between">
        <Button onClick={appearanceFormReset} variant="outline">
          Undo Changes
        </Button>
        <Button onClick={appearanceFormSubmit} variant="primary">
          Save
        </Button>
      </div>
    </>
  );
};
