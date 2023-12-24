import Settings from "@/components/settings";
import { currentProfile } from "@/lib/current-profile";
import React from "react";

const SettingPage = async () => {
  const profile = await currentProfile();
  return <Settings user={profile} />;
};

export default SettingPage;
