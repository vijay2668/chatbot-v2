import { DashboardHeader } from "@/components/header";
import { ModalProvider } from "@/components/modal-provider";
import { Sidebar } from "@/components/sidebar";
import { currentProfile } from "@/lib/current-profile";

const MainLayout: any = async ({ children }: { children: React.ReactNode }) => {
  const profile: any = await currentProfile();

  return (
    <main className="h-full relative flex w-full flex-1 overflow-hidden">
      <Sidebar />
      <div className="h-full w-full overflow-hidden flex flex-col">
        <DashboardHeader />
        <div className="h-full w-full overflow-hidden flex-1 flex flex-col">
          {children}
        </div>
      </div>

      <ModalProvider user={profile} />
    </main>
  );
};

export default MainLayout;
