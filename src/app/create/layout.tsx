
export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen md:h-screen">
      <main className="h-full w-full">
        {children}
      </main>
    </div>
  );
}
