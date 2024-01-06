import { currentProfile } from "@/lib/current-profile";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const profile = await currentProfile();
  if (!profile?.user_key) return;
  
  return <main className="bg-transparent w-full h-screen">{children}</main>;
}
