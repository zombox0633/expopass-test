import { api } from "@/lib/api/axios";
import type { RecordsListResponse, SingleRecordResponse } from "@/types/api";
import type { UserData } from "@/types/users";

const RECORDS = "/collections/users/records";

export async function getUsers(page = 1, limit = 10) {
  const res = await api.get<RecordsListResponse>(RECORDS, {
    params: { page, limit },
  });
  return res.data;
}

export async function searchUsers(page: number, limit: number, term: string) {
  const res = await api.get<RecordsListResponse>(RECORDS, {
    params: { page: 1, limit: 100, search: term },
  });

  const q = term.toLowerCase();
  const matches = res.data.data.filter(
    (r) =>
      r.data.first_name.toLowerCase().includes(q) ||
      r.data.last_name.toLowerCase().includes(q) ||
      r.data.email.toLowerCase().includes(q),
  );

  return {
    data: matches.slice((page - 1) * limit, page * limit),
    meta: {
      page,
      limit,
      total: matches.length,
      pages: Math.max(1, Math.ceil(matches.length / limit)),
    },
  };
}

export async function createUser(data: UserData) {
  const res = await api.post<SingleRecordResponse>(RECORDS, { data });
  return res.data.data;
}

export async function updateUser(id: string, data: UserData) {
  const res = await api.put<SingleRecordResponse>(`${RECORDS}/${id}`, { data });
  return res.data.data;
}

export async function deleteUser(id: string) {
  await api.delete(`${RECORDS}/${id}`); // 204 No Content
}
