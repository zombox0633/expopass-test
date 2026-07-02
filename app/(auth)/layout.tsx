import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-1 flex-col">
      <header className="flex items-center justify-end p-6">
        {/* <Link
          href="/"
          className="flex size-9 items-center justify-center text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link> */}
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
