import { NextResponse } from "next/server";
import { sha256 } from "@/lib/hash";
import { signToken } from "@/lib/server/jwt";
import { createUser, findUserByEmail } from "@/lib/server/users.repo";
import type { SessionUser } from "@/types/users";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
  }

  const hashed = await sha256(password);
  const user = await createUser({
    email,
    password: hashed,
    first_name: "",
    last_name: "",
    gender: 3,
    age: 0,
  });

  const token = await signToken({ sub: user.id, email: user.data.email });

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.data.email,
    first_name: user.data.first_name,
    last_name: user.data.last_name,
  };

  const res = NextResponse.json({ user: sessionUser }, { status: 201 });
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}
