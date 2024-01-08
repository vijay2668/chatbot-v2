"use client";

import { useEffect, useState } from "react";
import { FileUploadModal } from "./modals/file-upload-modal";
import { WebsiteModal } from "./modals/website-modal";
import { EditFileUploadModal } from "./modals/edit-file-upload-modal";
import { EditWebsiteModal } from "./modals/edit-website-modal";
import { FAQsModal } from "./modals/faqs-modal";
import { LearnMoreModal } from "./modals/learn-more-modal";
import { CreateBotModal } from "./modals/create-bot-modal";

export const ModalProvider = ({ user }: any) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateBotModal user={user} />
      <FileUploadModal user={user} />
      <EditFileUploadModal user={user} />
      <WebsiteModal user={user} />
      <EditWebsiteModal user={user} />
      <FAQsModal />
      <LearnMoreModal />
    </>
  );
};
