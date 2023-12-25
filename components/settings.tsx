"use client";
import { ActionTooltip } from "@/components/action-tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { LiaRobotSolid } from "react-icons/lia";
import { BsRobot } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { MdChatBubbleOutline } from "react-icons/md";
import { MdSupportAgent } from "react-icons/md";
import { SlSupport } from "react-icons/sl";
import { SiProbot } from "react-icons/si";

const Settings = ({ user }: any) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);

  let bot_id = params?.chatbotId;

  const chatbot = user?.chatbots?.find(
    (chatbot: any) => chatbot?.bot_id === bot_id
  );

  const [form, setform] = useState({
    id: chatbot?.id,
    bot_id: bot_id,
    bot_name: chatbot?.bot_name || "",
    company_name: chatbot?.company_name || "",
    description: chatbot?.description || "",
    company_logo: chatbot?.company_logo || "",
    bot_avatar: chatbot?.bot_avatar || "",
    chat_bubble_icon: chatbot?.chat_bubble_icon || "BiSupport",
    accent_colour: chatbot?.accent_colour || "#6366f1",
    subheading: chatbot?.subheading || "Our bot answers instantly",
    welcome_message:
      chatbot?.welcome_message || "Hey there, how can I help you?",
    input_box_placeholder:
      chatbot?.input_box_placeholder || "Send a message...",
    botsonic_branding_on_the_widget:
      chatbot?.botsonic_branding_on_the_widget || "show",
    widget_position: chatbot?.widget_position || "right",
    show_sources_with_the_response:
      chatbot?.show_sources_with_the_response || "show",
    post_chat_feedback: chatbot?.post_chat_feedback || "show",
    widget: chatbot?.widget || "open",
    show_floating_welcome_message:
      chatbot?.show_floating_welcome_message || false,
    show_floating_starter_questions:
      chatbot?.show_floating_starter_questions || false
  });

  const handleReset = () => {
    setform({
      id: chatbot?.id,
      bot_id: bot_id,
      bot_name: chatbot?.bot_name || "",
      company_name: chatbot?.company_name || "",
      description: chatbot?.description || "",
      company_logo: chatbot?.company_logo || "",
      bot_avatar: chatbot?.bot_avatar || "",
      chat_bubble_icon: chatbot?.chat_bubble_icon || "BiSupport",
      accent_colour: chatbot?.accent_colour || "#6366f1",
      subheading: chatbot?.subheading || "Our bot answers instantly",
      welcome_message:
        chatbot?.welcome_message || "Hey there, how can I help you?",
      input_box_placeholder:
        chatbot?.input_box_placeholder || "Send a message...",
      botsonic_branding_on_the_widget:
        chatbot?.botsonic_branding_on_the_widget || "show",
      widget_position: chatbot?.widget_position || "right",
      show_sources_with_the_response:
        chatbot?.show_sources_with_the_response || "show",
      post_chat_feedback: chatbot?.post_chat_feedback || "show",
      widget: chatbot?.widget || "open",
      show_floating_welcome_message:
        chatbot?.show_floating_welcome_message || false,
      show_floating_starter_questions:
        chatbot?.show_floating_starter_questions || false
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res: any = await axios.post("/api/updateChatbotUI", form);
      const data = await res.data;
      console.log(data);
      if (res.status === 200) {
        toast.success("bot appearance created");
        setLoading(false);
        if (chatbot) return;
        handleReset();
      }
    } catch (error: any) {
      toast.error(error);
      setLoading(false);
    }
  };

  const Chat_Bubble_Icons = [
    {
      label: "LiaRobotSolid",
      icon: () => <LiaRobotSolid className="text-2xl" />
    },
    { label: "BsRobot", icon: () => <BsRobot className="text-2xl" /> },
    { label: "BiSupport", icon: () => <BiSupport className="text-2xl" /> },
    {
      label: "MdChatBubbleOutline",
      icon: () => <MdChatBubbleOutline className="text-2xl" />
    },
    {
      label: "MdSupportAgent",
      icon: () => <MdSupportAgent className="text-2xl" />
    },
    { label: "SlSupport", icon: () => <SlSupport className="text-2xl" /> },
    { label: "SiProbot", icon: () => <SiProbot className="text-2xl" /> }
  ];

  return (
    <div
      className={cn(
        loading && "opacity-80 pointer-events-none",
        "sm:px-8 py-8 px-4 flex flex-col w-full h-full overflow-hidden flex-1"
      )}
    >
      <Tabs
        defaultValue="appearance"
        className="w-full h-full space-y-4 flex flex-col overflow-hidden"
      >
        <TabsList className="w-full min-h-fit">
          <TabsTrigger className="w-full overflow-hidden" value="appearance">
            <p className="overflow-hidden">Appearance</p>
          </TabsTrigger>
          <TabsTrigger className="w-full overflow-hidden" value="bot-settings">
            <p className="overflow-hidden">Bot Settings</p>
          </TabsTrigger>
          <TabsTrigger
            className="w-full overflow-hidden"
            value="starter-questions"
          >
            <p className="overflow-hidden">Starter Questions</p>
          </TabsTrigger>
          <TabsTrigger className="w-full overflow-hidden" value="user-form">
            <p className="overflow-hidden">User Form</p>
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="appearance"
          className="flex h-full flex-col space-y-4 overflow-hidden"
        >
          <div className="w-full h-full flex flex-col space-y-4 overflow-y-scroll scrollbar-hide">
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
                    side="right"
                    label="Bot description for your personal reference."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <Input
                  value={form.bot_name}
                  onChange={(e) =>
                    setform((prev) => ({
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
                    side="right"
                    label="Company Name to be displayed in the chatbot."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <Input
                  value={form.company_name}
                  onChange={(e) =>
                    setform((prev) => ({
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
                    side="right"
                    label="Bot description for your personal reference."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <Input
                  placeholder="Enter a description for your bot here..."
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={form.description}
                  onChange={(e) =>
                    setform((prev) => ({
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
                    side="right"
                    label="Company Logo to be displayed in the chatbot."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <FileUpload
                  onChange={setform}
                  endpoint="chatbot"
                  customKey="company_logo"
                  value={form?.company_logo}
                />
              </div>
              <div className="w-1/2 space-y-2">
                <Label className="flex items-center space-x-1">
                  <p>Bot Avatar</p>
                  <ActionTooltip
                    side="right"
                    label="Chatbot Picture to be displayed in the chatbot."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <FileUpload
                  onChange={setform}
                  endpoint="chatbot"
                  customKey="bot_avatar"
                  value={form?.bot_avatar}
                />
              </div>
            </div>
            <div className="flex items-center w-full space-x-2">
              <div className="w-full space-y-2">
                <Label className="flex items-center space-x-1">
                  <p>Chat bubble icon</p>
                  <ActionTooltip
                    side="right"
                    label="Customize the button style of the chatbot"
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <div className="flex items-center space-x-2 w-full">
                  {Chat_Bubble_Icons.map((item: any, index: number) => (
                    <Button
                      key={index}
                      onClick={() => {
                        setform((prev) => ({
                          ...prev,
                          chat_bubble_icon: item?.label
                        }));
                      }}
                      variant="outline"
                      className={cn(
                        "p-2",
                        chatbot?.chat_bubble_icon === item?.label ||
                          form?.chat_bubble_icon === item?.label
                          ? "border-indigo-500"
                          : null
                      )}
                    >
                      {item?.icon()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center w-full space-x-2">
              <div className="w-fit space-y-2">
                <Label className="flex items-center space-x-1">
                  <p>Accent colour</p>
                </Label>
                <Input
                  value={form.accent_colour}
                  onChange={(e) =>
                    setform((prev) => ({
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
                    side="right"
                    label="Chatbot Subheading to be displayed in the chatbot."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <Input
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={form.subheading}
                  onChange={(e) =>
                    setform((prev) => ({
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
                    side="right"
                    label="Customize the welcome message that is shown to your customers."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <Input
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={form.welcome_message}
                  onChange={(e) =>
                    setform((prev) => ({
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
                    side="right"
                    label="Chatbot Input Placeholder to be displayed in the chatbot."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <Input
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={form.input_box_placeholder}
                  onChange={(e) =>
                    setform((prev) => ({
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
                  <p>Botsonic branding on the widget</p>
                  <ActionTooltip
                    side="right"
                    label="Hide/Show Botsonic banner at the bottom."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <div className="w-fit flex items-center p-1 bg-slate-100 rounded-lg">
                  <Button
                    onClick={() =>
                      setform((prev) => ({
                        ...prev,
                        botsonic_branding_on_the_widget: "show"
                      }))
                    }
                    className={cn(
                      form.botsonic_branding_on_the_widget === "show"
                        ? "bg-white hover:bg-white"
                        : "bg-slate-100 hover:bg-slate-100",
                      "py-1 px-3 text-sm text-black leading-6 rounded-md"
                    )}
                  >
                    Show
                  </Button>
                  <Button
                    onClick={() =>
                      setform((prev) => ({
                        ...prev,
                        botsonic_branding_on_the_widget: "hide"
                      }))
                    }
                    className={cn(
                      form.botsonic_branding_on_the_widget === "hide"
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
                    side="right"
                    label="Choose the location of the widget. Note: Doesn't work on the preview shown on this page."
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <div className="w-fit flex items-center p-1 bg-slate-100 rounded-lg">
                  <Button
                    onClick={() =>
                      setform((prev) => ({
                        ...prev,
                        widget_position: "left"
                      }))
                    }
                    className={cn(
                      form.widget_position === "left"
                        ? "bg-white hover:bg-white"
                        : "bg-slate-100 hover:bg-slate-100",
                      "py-1 px-3 text-sm text-black leading-6 rounded-md"
                    )}
                  >
                    Left
                  </Button>
                  <Button
                    onClick={() =>
                      setform((prev) => ({
                        ...prev,
                        widget_position: "right"
                      }))
                    }
                    className={cn(
                      form.widget_position === "right"
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
                    side="right"
                    label="Hide/Show sources along with responses"
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <div className="w-fit flex items-center p-1 bg-slate-100 rounded-lg">
                  <Button
                    onClick={() =>
                      setform((prev) => ({
                        ...prev,
                        show_sources_with_the_response: "show"
                      }))
                    }
                    className={cn(
                      form.show_sources_with_the_response === "show"
                        ? "bg-white hover:bg-white"
                        : "bg-slate-100 hover:bg-slate-100",
                      "py-1 px-3 text-sm text-black leading-6 rounded-md"
                    )}
                  >
                    Show
                  </Button>
                  <Button
                    onClick={() =>
                      setform((prev) => ({
                        ...prev,
                        show_sources_with_the_response: "hide"
                      }))
                    }
                    className={cn(
                      form.show_sources_with_the_response === "hide"
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
                    side="right"
                    label="Hide/Show post chat feedback"
                  >
                    <Info width={10} height={10} />
                  </ActionTooltip>
                </Label>
                <div className="w-fit flex items-center p-1 bg-slate-100 rounded-lg">
                  <Button
                    onClick={() =>
                      setform((prev) => ({
                        ...prev,
                        post_chat_feedback: "show"
                      }))
                    }
                    className={cn(
                      form.post_chat_feedback === "show"
                        ? "bg-white hover:bg-white"
                        : "bg-slate-100 hover:bg-slate-100",
                      "py-1 px-3 text-sm text-black leading-6 rounded-md"
                    )}
                  >
                    Show
                  </Button>
                  <Button
                    onClick={() =>
                      setform((prev) => ({
                        ...prev,
                        post_chat_feedback: "hide"
                      }))
                    }
                    className={cn(
                      form.post_chat_feedback === "hide"
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
                setform((prev) => ({
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
                      disabled={form.widget === "open"}
                      checked={form.show_floating_welcome_message}
                      onCheckedChange={(e: any) =>
                        setform((prev) => ({
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
                      disabled={form.widget === "open"}
                      checked={form.show_floating_starter_questions}
                      onCheckedChange={(e: any) =>
                        setform((prev) => ({
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
            <Button onClick={handleReset} variant="outline">
              Undo Changes
            </Button>
            <Button onClick={handleSubmit} variant="primary">
              Save
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
