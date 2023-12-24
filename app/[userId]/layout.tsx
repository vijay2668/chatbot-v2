export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <main className="bg-transparent w-full h-screen">{children}</main>;
}
