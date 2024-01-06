"use client";
import { ActionTooltip } from "@/components/action-tooltip";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { cn, countries } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "../ui/switch";
// import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import toast from "react-hot-toast";
// import Image from "next/image";

export const BotSettingsForm = ({ chatbotUI }: any) => {
  // const [slider, setslider] = useState(0);
  // const [showLangSelect, setShowLangSelect] = useState(true);
  const [loading, setLoading] = useState(false);

  const [botSettingsForm, setBotSettingsForm] = useState({
    bot_template: chatbotUI?.bot_template || "support",
    response_length: chatbotUI?.response_length || "short",
    // multilingual_support: chatbotUI?.multilingual_support,
    // multilingual_language: chatbotUI?.multilingual_language || "",
    is_gpt_4: chatbotUI?.is_gpt_4 || false,
    bot_guidelines: chatbotUI?.bot_guidelines || "",
    messages_limit_per_day: chatbotUI?.messages_limit_per_day || 30,
    messages_limit_warning_message:
      chatbotUI?.messages_limit_warning_message ||
      "You've reached the message limit"
  });

  const botSettingsFormReset = () => {
    setBotSettingsForm({
      bot_template: chatbotUI?.bot_template || "support",
      response_length: chatbotUI?.response_length || "short",
      // multilingual_support: chatbotUI?.multilingual_support,
      // multilingual_language: chatbotUI?.multilingual_language || "",
      is_gpt_4: chatbotUI?.is_gpt_4 || false,
      bot_guidelines: chatbotUI?.bot_guidelines || "",
      messages_limit_per_day: chatbotUI?.messages_limit_per_day || 30,
      messages_limit_warning_message:
        chatbotUI?.messages_limit_warning_message ||
        "You've reached the message limit"
    });
  };

  const botSettingsFormSubmit = async () => {
    try {
      setLoading(true);
      const res: any = await axios.post("/api/updateChatbotUI", {
        id: chatbotUI?.id,
        values: botSettingsForm,
        index: 1
      });
      const data = await res.data;
      console.log(data);
      if (res.status === 200) {
        toast.success("bot settings updated");
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error);
      setLoading(false);
    }
  };
  console.log(botSettingsForm);

  return (
    <>
      <div className="w-full h-full flex flex-col space-y-4 overflow-y-scroll scrollbar-hide">
        <div className="flex flex-col w-full min-h-fit space-y-1">
          <Label className="text-base font-semibold">Bot settings</Label>
          <Label className="text-sm font-normal text-gray-400">
            Configure your bot according to your needs
          </Label>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Bot template</p>
            </Label>
            <Select
              onValueChange={(value) =>
                setBotSettingsForm((prev) => ({
                  ...prev,
                  bot_template: value
                }))
              }
              defaultValue={botSettingsForm.bot_template}
              name="bot_template"
            >
              <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select a Bot Template..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="personalized">Personalized</SelectItem>
                <SelectItem value="e-commerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Response Length</p>
            </Label>
            <Select
              onValueChange={(value) =>
                setBotSettingsForm((prev) => ({
                  ...prev,
                  response_length: value
                }))
              }
              defaultValue={botSettingsForm.response_length}
              name="response_length"
            >
              <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select a Response..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* <div className="flex items-center min-h-[68px] h-full w-full space-x-2">
          <div className="w-1/2 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Multilingual Support</p>
              <ActionTooltip
                side="top"
                align="start"
                label="If disabled, the bot will stick to the selected language"
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                onCheckedChange={setShowLangSelect}
                checked={showLangSelect}
                id="multilingual_support"
                name="multilingual_support"
              />
            </div>
          </div>
          {!showLangSelect && (
            <div className="w-1/2 space-y-2">
              <Label className="flex items-center space-x-1">
                <p>Language</p>
                <ActionTooltip
                  side="top"
                  align="start"
                  label="Your bot will always stick to the selected language irrespective of the user's entered language."
                >
                  <Info width={10} height={10} />
                </ActionTooltip>
              </Label>
              <Select name="language">
                <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select a language..." />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.value}
                      value={country.value}
                      className="pl-2"
                    >
                      <div className="flex items-center w-full space-x-2">
                        <Image
                          src={country.image}
                          alt=""
                          width={20}
                          height={20}
                        />
                        <Label>{country.label}</Label>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div> */}
        <div className="w-1/2 space-y-2">
          <Label className="flex items-center space-x-1">
            <p>Use Latest GPT-4 model</p>
            <ActionTooltip
              side="top"
              align="start"
              label="Use GPT-3.5, or switch to GPT-4 for improved response quality (at 10x cost)."
            >
              <Info width={10} height={10} />
            </ActionTooltip>
          </Label>
          <ActionTooltip
            side="bottom"
            align="start"
            label="Please upgrade to a paid plan to activate this option"
          >
            <div>
              <Switch
                disabled
                onCheckedChange={(checked) =>
                  setBotSettingsForm((prev) => ({ ...prev, is_gpt_4: checked }))
                }
                checked={botSettingsForm?.is_gpt_4}
                defaultChecked={botSettingsForm?.is_gpt_4}
                id="is_gpt_4"
                name="is_gpt_4"
              />
            </div>
          </ActionTooltip>
        </div>

        {/* <div className="flex items-center w-full space-x-2">
          <div className="w-3/4 space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Response Confidence</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Higher accuracy means the bot answers only when certain, while higher confidence allows it to respond even when uncertain."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <Slider
              className="cursor-pointer w-5/6 mx-auto"
              defaultValue={[100]}
              value={[slider]}
              onValueChange={(e: any) => setslider(e[0])}
              max={100}
              step={50}
            />
            <div className="flex items-center justify-between w-full">
              <Label
                onClick={() => setslider(0)}
                className={cn(
                  slider === 0 ? "text-indigo-500" : "text-gray-400",
                  "text-xs cursor-pointer"
                )}
              >
                More accuracy
              </Label>
              <Label
                onClick={() => setslider(50)}
                className={cn(
                  slider === 50 ? "text-indigo-500" : "text-gray-400",
                  "text-xs cursor-pointer"
                )}
              >
                Balanced
              </Label>
              <Label
                onClick={() => setslider(100)}
                className={cn(
                  slider === 100 ? "text-indigo-500" : "text-gray-400",
                  "text-xs cursor-pointer"
                )}
              >
                More confidense
              </Label>
            </div>
          </div>
        </div> */}
        <Separator />
        <div className="w-full space-y-2">
          <Label className="flex items-center space-x-1">
            <p>Chatbot Guidelines</p>
            <ActionTooltip
              side="top"
              align="start"
              label="Add specific guidelines for your chatbot."
            >
              <Info width={10} height={10} />
            </ActionTooltip>
          </Label>
          <ActionTooltip
            side="bottom"
            align="start"
            label="Please upgrade to a paid plan to activate this option"
          >
            <div>
              <Textarea
                disabled
                defaultValue={botSettingsForm?.bot_guidelines}
                value={botSettingsForm?.bot_guidelines}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) =>
                  setBotSettingsForm((prev) => ({
                    ...prev,
                    bot_guidelines: e.target.value
                  }))
                }
                placeholder="Be polite and friendly. Don't use slang. Don't use emojis"
                name="chatbot_guidelines"
              />
            </div>
          </ActionTooltip>
        </div>

        <Separator />

        <div className="flex items-center w-full space-x-2">
          <div className="w-full space-y-2">
            <Label className="flex items-center space-x-1">
              <p>Usage limit per day</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Set usage limit per day"
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <ActionTooltip
              side="bottom"
              align="start"
              label="Please upgrade to a paid plan to activate this option"
            >
              <div>
                <Input
                  disabled
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  type="number"
                  defaultValue={botSettingsForm?.messages_limit_per_day}
                  value={botSettingsForm?.messages_limit_per_day}
                  onChange={(e) =>
                    setBotSettingsForm((prev) => ({
                      ...prev,
                      messages_limit_per_day: e.target.value
                    }))
                  }
                  name="usage_limit_per_day"
                />
              </div>
            </ActionTooltip>
          </div>
        </div>
        <div className="flex items-center w-full space-x-2">
          <div className="w-full space-y-2">
            <Label className="flex items-center space-x-1">
              <p>User limit warning</p>
              <ActionTooltip
                side="top"
                align="start"
                label="Set warning message to show when user limit exceeds."
              >
                <Info width={10} height={10} />
              </ActionTooltip>
            </Label>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              defaultValue={botSettingsForm?.messages_limit_warning_message}
              value={botSettingsForm?.messages_limit_warning_message}
              onChange={(e) =>
                setBotSettingsForm((prev) => ({
                  ...prev,
                  messages_limit_warning_message: e.target.value
                }))
              }
              name="user_limit_warning"
            />
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex items-center w-full justify-between">
        <Button onClick={botSettingsFormReset} variant="outline">
          Undo Changes
        </Button>
        <Button onClick={botSettingsFormSubmit} variant="primary">
          Save
        </Button>
      </div>
    </>
  );
};
