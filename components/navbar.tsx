"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { LINKS_NAV } from "@/constraints/nav.data";
import { useAuthStore } from "@/store/auth.store";
import { signOut } from "@/lib/api/auth.service";

const subscribe = () => () => {};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // user มาจาก localStorage ซึ่ง server ไม่รู้จัก — รอ mount ก่อนค่อยตัดสินใจ
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isAuthed = mounted && !!user;

  const links = LINKS_NAV.filter(
    (link) => !link.auth || link.auth === (isAuthed ? "user" : "guest"),
  );

  async function handleSignOut() {
    await signOut();
    logout();
    router.push("/sign-in");
  }

  return (
    <header className="border-foreground/10 bg-background/80 sticky top-0 z-50 border-2 border-b backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <Link href="/" aria-label="home" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
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

          {isAuthed && (
            <button
              type="button"
              onClick={handleSignOut}
              className="text-foreground/60 hover:bg-foreground/5 hover:text-foreground flex items-center gap-1.5 px-3 py-1.5 text-sm uppercase transition-colors"
            >
              Sign_Out
            </button>
          )}

          <div className="ml-1">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
