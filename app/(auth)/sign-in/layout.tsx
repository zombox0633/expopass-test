import type { Metadata } from "next";

// หน้า page.tsx เป็น client component จึง export metadata เองไม่ได้ — ใส่ที่ layout แทน
export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
