"use client";

import { useState, type InputHTMLAttributes } from "react";

type PasswordFieldProps = {
  id: string;
  label: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordField({ id, label, ...props }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="text-foreground mb-2 block text-xs font-bold tracking-[0.2em] uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className="border-foreground/20 bg-background placeholder:text-foreground/50 focus:border-foreground w-full border-2 px-3.5 py-4 text-sm focus:outline-none"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="text-foreground hover:text-foreground/80 absolute top-1/2 right-4 -translate-y-1/2 text-xs font-bold tracking-[0.06em]"
        >
          {showPassword ? "HIDE" : "SHOW"}
        </button>
      </div>
    </div>
  );
}
