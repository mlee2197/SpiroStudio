
export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen md:h-screen md:p-20">
      <main className="h-full w-full">
        {children}
      </main>
    </div>
  );
}
