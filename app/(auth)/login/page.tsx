import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TextField } from "@/components/input/text-field";
import { PasswordField } from "@/components/input/password-field";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <div className="border-foreground/15 flex w-full max-w-sm flex-col gap-7 border-2 p-8">
      <Logo />

      <div className="flex flex-col gap-2">
        <h1 className="tracking-[-0.03em] uppercase">Login</h1>
        <p className="text-foreground/60 text-sm">Welcome back. Sign in to manage your users.</p>
      </div>

      <div className="flex flex-col gap-5">
        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />

        <div className="flex flex-col gap-2">
          <PasswordField
            id="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="bg-foreground text-background hover:bg-foreground/80 w-full py-4 font-extrabold tracking-[0.06em] uppercase transition-colors active:translate-y-px"
        >
          Login
        </button>

        <p className="text-foreground/60 flex items-center justify-center gap-2 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-foreground hover:text-foreground/70 flex items-center font-bold uppercase"
          >
            Sign_Up <ChevronRight className="size-4" />
          </Link>
        </p>
      </div>
    </div>
  );
}
