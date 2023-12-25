import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const Home = async () => {
  const profile = await initialProfile();

  if (profile) {
    redirect("/dashboard");
  }
};

export default Home;
