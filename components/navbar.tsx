"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { LINKS_NAV } from "@/constraints/nav.data";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-foreground/10 bg-background/80 sticky top-0 z-50 border-2 border-b backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <Link href="/" aria-label="home" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex items-center gap-1">
          {LINKS_NAV.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 py-1.5 text-sm uppercase transition-colors",
                  active
                    ? "bg-foreground/10 font-bold"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="ml-1">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
