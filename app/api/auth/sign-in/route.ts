import { NextResponse } from "next/server";
import { sha256 } from "@/lib/hash";
import { signToken } from "@/lib/server/jwt";
import { findUserByEmail } from "@/lib/server/users.repo";
import type { SessionUser } from "@/types/users";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  const hashed = await sha256(password);

  if (!user || user.data.password !== hashed) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signToken({ sub: user.id, email: user.data.email });

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.data.email,
    first_name: user.data.first_name,
    last_name: user.data.last_name,
  };

  const res = NextResponse.json({ user: sessionUser });
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 วัน เท่าอายุ JWT
  });
  return res;
}
