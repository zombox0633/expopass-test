"use client";

import { clsx } from "clsx";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
} as const;

export function ModalShell({
  children,
  onClose,
  size = "sm",
}: {
  children: React.ReactNode;
  onClose: () => void;
  size?: keyof typeof SIZES;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={onClose}
    >
      <div
        className={clsx("border-foreground/15 bg-background w-full border-2 p-8", SIZES[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
