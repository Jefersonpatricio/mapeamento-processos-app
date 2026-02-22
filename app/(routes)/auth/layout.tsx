export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50/90 font-sans">
      <main className="flex flex-col min-h-screen w-full max-w-6xl items-start justify-start py-8 px-8 bg-white rounded-lg">
        {children}
      </main>
    </div>
  );
}
