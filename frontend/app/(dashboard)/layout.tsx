export default function MainDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <main className="flex flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </>
  );
}