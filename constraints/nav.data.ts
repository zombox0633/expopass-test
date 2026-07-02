export type NavLink = {
  href: string;
  label: string;
  auth?: "user" | "guest"; // ไม่ระบุ = โชว์ทุกสถานะ
};

export const LINKS_NAV: NavLink[] = [
  { href: "/users", label: "Users", auth: "user" },
  { href: "/sign-up", label: "Sign_Up", auth: "guest" },
  { href: "/sign-in", label: "Sign_In", auth: "guest" },
];
