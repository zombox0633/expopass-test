import type { InputHTMLAttributes } from "react";

type TextFieldProps = {
  id: string;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ id, label, ...props }: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-foreground mb-2 block text-xs font-bold tracking-[0.2em] uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        className="border-foreground/20 bg-background placeholder:text-foreground/50 focus:border-foreground w-full border-2 px-3.5 py-4 text-sm focus:outline-none"
        {...props}
      />
    </div>
  );
}
