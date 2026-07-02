import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/server/jwt";

// ตรวจ JWT ใน httpOnly cookie ฝั่ง server ก่อน render หน้า private
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    // ไม่มี token / หมดอายุ / ปลอม → กลับไปหน้า sign-in
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*"],
};
