"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { TextField } from "@/components/input/text-field";
import { PasswordField } from "@/components/input/password-field";
import { Logo } from "@/components/logo";
import { register } from "@/lib/api/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { validatePassword } from "@/lib/common";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: ({ user }) => {
      setUser(user);
      router.push("/users");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setFormError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    registerMutation.mutate({ email, password });
  }

  const errorMessage =
    formError ?? (registerMutation.isError ? registerMutation.error.message : null);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-foreground/15 flex w-full max-w-sm flex-col gap-7 border-2 p-8"
    >
      <div className="flex flex-col gap-2">
        <Logo />
        <h1 className="tracking-[-0.03em] uppercase">Sign_Up</h1>
        <p className="text-foreground/60 text-sm">Create an account to get started.</p>
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

        <div className="flex flex-col gap-2">
          <PasswordField
            id="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-foreground/50 text-xs">
            At least 8 characters, with a letter, a number, and a special character.
          </p>
        </div>

        <PasswordField
          id="confirm-password"
          label="Confirm Password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {errorMessage && (
        <p className="border-2 border-red-500/40 px-4 py-3 text-sm font-bold text-red-500">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="bg-foreground text-background hover:bg-foreground/80 w-full py-4 font-extrabold tracking-[0.06em] uppercase transition-colors active:translate-y-px disabled:opacity-60"
        >
          {registerMutation.isPending ? "Creating account..." : "Sign_Up"}
        </button>

        <p className="text-foreground/60 flex items-center justify-center gap-2 text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-foreground hover:text-foreground/70 flex items-center font-bold uppercase"
          >
            Sign_In <ChevronRight className="size-4" />
          </Link>
        </p>
      </div>
    </form>
  );
}
