import { DashboardPage } from "@/components/dashboard";
import { currentProfile } from "@/lib/current-profile";

const MainDashboard = async () => {
  const profile: any = await currentProfile();

  return <DashboardPage user={profile} />;
};

export default MainDashboard;
