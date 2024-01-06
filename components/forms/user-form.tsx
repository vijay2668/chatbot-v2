"use client";
import { ActionTooltip } from "@/components/action-tooltip";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import { Plus } from "lucide-react";

export const UserForm = ({ chatbotUI }: any) => {
  const [fields, setFields] = useState<any>(chatbotUI?.fields || []);

  const handleDeleteField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields((prevFields: any) => [
      ...prevFields,
      {
        type: "text",
        label: "name",
        placeholder: "Enter a message",
        is_required: false
      }
    ]);
  };

  console.log(fields);

  return (
    <>
      <div className="w-full h-full flex flex-col space-y-4 overflow-y-scroll scrollbar-hide">
        <div className="flex flex-col w-full min-h-fit space-y-1">
          <Label className="text-base font-semibold">User form</Label>
          <Label className="text-sm font-normal text-gray-400">
            Choose what data to collect from your users before they chat
          </Label>
        </div>
        <div className="w-full space-y-2">
          <ActionTooltip
            side="top"
            align="start"
            label="Upgrade to a paid plan to activate this option"
          >
            <div className="w-fit flex items-center space-x-1 p-1 border border-gray-200 rounded-lg">
              <Button
                disabled
                // onClick={() =>
                //   setform((prev: any) => ({
                //     ...prev,
                //     botsonic_branding_on_the_widget: "show"
                //   }))
                // }
                className={cn(
                  chatbotUI.show_user_form || false
                    ? "bg-indigo-500 text-white"
                    : "bg-transparent hover:bg-indigo-500/60 hover:text-white text-black",
                  "py-1 px-3 h-fit text-sm leading-6 rounded-md"
                )}
              >
                Show
              </Button>
              <Button
                disabled
                // onClick={() =>
                //   setform((prev: any) => ({
                //     ...prev,
                //     botsonic_branding_on_the_widget: "hide"
                //   }))
                // }
                className={cn(
                  chatbotUI.show_user_form || true
                    ? "bg-indigo-500 text-white"
                    : "bg-transparent hover:bg-indigo-500/60 hover:text-white text-black",
                  "py-1 px-3 h-fit text-sm leading-6 rounded-md"
                )}
              >
                Hide
              </Button>
            </div>
          </ActionTooltip>
        </div>
        <div className="flex items-center space-x-2 w-3/5">
          <Label className="text-xs w-1/3">Field type</Label>
          <Label className="text-xs w-1/3">Field label</Label>
          <Label className="text-xs w-1/3">Mandatory</Label>
        </div>
        <div className="w-3/5 overflow-scroll scrollbar-hide flex flex-col max-h-full space-y-2">
          {fields?.map((field: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 w-full">
              <div className="w-1/3">
                <Select
                  defaultValue={field?.type}
                  onValueChange={(value) => {
                    setFields((prev: any) => {
                      const updatedFields: any = [...prev];
                      updatedFields[index].type = value;
                      return updatedFields;
                    });
                  }}
                  name="field_type"
                >
                  <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select a field..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email_id">Email-ID</SelectItem>
                    <SelectItem value="phone_number">Phone Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                className="focus-visible:ring-0 focus-visible:ring-offset-0 w-1/3"
                defaultValue="name"
                value={fields[index].label}
                onChange={(e) => {
                  setFields((prev: any) => {
                    const updatedFields: any = [...prev];
                    updatedFields[index].label = e.target.value;
                    return updatedFields;
                  });
                }}
                name="field_label"
              />
              <div className="w-1/3 flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={(checked) => {
                    setFields((prevFields: any) => {
                      const updatedFields: any = [...prevFields];
                      updatedFields[index].is_required = checked;
                      return updatedFields;
                    });
                  }}
                  checked={field.is_required}
                  className="data-[state=checked]:bg-indigo-500 border-gray-400 w-5 h-5"
                  id={`field_required_${index}`}
                />
                <button
                  onClick={() => handleDeleteField(index)}
                  className="text-2xl text-red-600"
                >
                  <MdDeleteOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button
            onClick={handleAddField}
            variant="outline"
            className="border-indigo-500/30 space-x-1 rounded-lg text-indigo-500 hover:text-indigo-500 hover:bg-indigo-50"
          >
            <div className="flex items-center space-x-1">
              <Plus width={18} height={18} />
              <p>Add more fields</p>
            </div>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex items-center w-full justify-between">
        {/* <Button onClick={handleReset} variant="outline">
          Undo Changes
        </Button>
        <Button onClick={handleSubmit} variant="primary">
          Save
        </Button> */}
      </div>
    </>
  );
};
