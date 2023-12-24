import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

const Home = async () => {
  const profile = await currentProfile();

  if (profile) {
    redirect("/dashboard");
  }
};

export default Home;
