import { Sidebar } from '@/components/sidebar';

const MainLayout:any = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex w-full">
      <Sidebar />
      <main className="h-full w-full">{children}</main>
    </div>
  );
};

export default MainLayout;
