import type { RecordsListResponse, SingleRecordResponse } from "@/types/api";
import type { UserData, UserRecord } from "@/types/users";

// เรียก reqres จากฝั่ง server เท่านั้น (route handlers)
const BASE = "https://reqres.in/api/collections/users/records";

function headers() {
  return {
    "x-api-key": process.env.NEXT_PUBLIC_REQRES_API_KEY ?? "",
    "Content-Type": "application/json",
  };
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const res = await fetch(`${BASE}?limit=100`, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to reach user store");
  const json: RecordsListResponse = await res.json();
  return json.data.find((r) => r.data.email === email);
}

export async function createUser(data: UserData): Promise<UserRecord> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error("Failed to create user");
  const json: SingleRecordResponse = await res.json();
  return json.data;
}
