"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { TextField } from "@/components/input/text-field";
import { PasswordField } from "@/components/input/password-field";
import { Logo } from "@/components/logo";
import { login } from "@/lib/api/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      setUser(user);
      router.push("/users");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-foreground/15 flex w-full max-w-sm flex-col gap-7 border-2 p-8"
    >
      <div className="flex flex-col gap-2">
        <Logo />
        <h1 className="tracking-[-0.03em] uppercase">Sign_In</h1>
        <p className="text-foreground/60 text-sm">Welcome back. Sign in to manage your users.</p>
      </div>

      <div className="flex flex-col gap-5">
        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          id="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {loginMutation.isError && (
        <p className="border-2 border-red-500/40 px-4 py-3 text-sm font-bold text-red-500">
          {loginMutation.error.message}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="bg-foreground text-background hover:bg-foreground/80 w-full py-4 font-extrabold tracking-[0.06em] uppercase transition-colors active:translate-y-px disabled:opacity-60"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign_In"}
        </button>

        <p className="text-foreground/60 flex items-center justify-center gap-2 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-foreground hover:text-foreground/70 flex items-center font-bold uppercase"
          >
            Sign_Up <ChevronRight className="size-4" />
          </Link>
        </p>
      </div>
    </form>
  );
}
