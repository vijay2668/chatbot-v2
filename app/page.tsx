import { ChatBot } from "@/components/chatbot";
import { createThread, getAssistants } from "@/lib/OpenAI";
import { currentProfile } from "@/lib/current-profile";
import axios from "axios";

const Home = async () => {
  const profile = await currentProfile();

  return <ChatBot user={profile}/>;
};

export default Home;
