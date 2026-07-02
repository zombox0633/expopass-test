import type { AuthInput } from "@/types/api";
import type { SessionUser } from "@/types/users";

// คุยกับ route handlers ของเราเอง (/api/auth/*) — ฝั่ง server เป็นคนตรวจรหัส
// เซ็น JWT และ set httpOnly cookie ให้ (JS ฝั่งนี้ไม่เคยเห็น token เลย)
async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? "Something went wrong");
  }
  return json;
}

export async function login(input: AuthInput) {
  return post<{ user: SessionUser }>("/api/auth/sign-in", input);
}

export async function register(input: AuthInput) {
  return post<{ user: SessionUser }>("/api/auth/sign-up", input);
}

export async function signOut() {
  return post<{ ok: boolean }>("/api/auth/sign-out");
}
