import { api } from "./axios";
import { sha256 } from "@/lib/hash";
import type { AuthInput, RecordsListResponse, SingleRecordResponse } from "@/types/api";
import type { UserRecord } from "@/types/users";

const RECORDS = "/collections/users/records";

async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const res = await api.get<RecordsListResponse>(RECORDS, {
    params: { limit: 100 },
  });
  return res.data.data.find((r) => r.data.email === email);
}

export async function login({ email, password }: AuthInput) {
  const user = await findUserByEmail(email);
  const hashed = await sha256(password);

  if (!user || user.data.password !== hashed) {
    throw new Error("Invalid email or password");
  }

  return { token: crypto.randomUUID(), user };
}

export async function register({ email, password }: AuthInput) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("This email is already registered");
  }

  const hashed = await sha256(password);
  const res = await api.post<SingleRecordResponse>(RECORDS, {
    data: {
      email,
      password: hashed,
      first_name: "",
      last_name: "",
      gender: 3,
      age: 0,
    },
  });

  return { token: crypto.randomUUID(), user: res.data.data };
}
