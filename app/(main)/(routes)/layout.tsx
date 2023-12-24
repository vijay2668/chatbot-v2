import { ChatbotDemoPage } from "@/components/chatbot-demo";
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
      {/* <ChatbotDemoPage user={profile}/> */}
      {/* <iframe
        className="absolute bottom-5 right-5 w-full h-[80vh] rounded-xl sm:max-w-[400px]"
        frameBorder="0"
        src="http://localhost:3000/6583da9faf2b8f539beef2e0/asst_PsSNKiN3xk92q7VwDZ1HhyNy"
      /> */}
      <ModalProvider user={profile} />
    </main>
  );
};

export default MainLayout;
