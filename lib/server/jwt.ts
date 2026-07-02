import { SignJWT, jwtVerify } from "jose";

// ใช้ได้เฉพาะฝั่ง server (route handlers / proxy) — JWT_SECRET ไม่มี NEXT_PUBLIC_
// จึงไม่ถูก bundle ไป browser
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type SessionPayload = {
  sub: string; // user record id
  email: string;
};

export async function signToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secret);
    return payload;
  } catch {
    return null; // ปลอม/หมดอายุ/แก้ payload → signature ไม่ผ่าน
  }
}
