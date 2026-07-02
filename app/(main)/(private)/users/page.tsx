"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GENDER_LABEL } from "@/constraints/gender.data";
import { UserData, UserRecord } from "@/types/users";
import { deleteUser, getUsers, searchUsers, updateUser } from "./service";
import { DeleteUserModal, EditUserModal } from "./actions";

const PAGE_SIZES = [5, 10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;
const MIN_SEARCH_LENGTH = 3; // พิมพ์ครบก่อนค่อยยิงค้นหา

export default function UsersPage() {
  return (
    <Suspense>
      <UsersPageContent />
    </Suspense>
  );
}

function UsersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // อ่าน page/limit/search จาก URL → refresh/แชร์ลิงก์แล้วยังอยู่ตำแหน่งเดิม
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limitParam = Number(searchParams.get("limit"));
  const limit = PAGE_SIZES.includes(limitParam) ? limitParam : DEFAULT_PAGE_SIZE;
  const search = searchParams.get("search") ?? "";
  const isSearching = search.length >= MIN_SEARCH_LENGTH;

  function goTo(nextPage: number, nextLimit: number, nextSearch = search) {
    const params = new URLSearchParams({ page: String(nextPage), limit: String(nextLimit) });
    if (nextSearch) params.set("search", nextSearch);
    router.push(`/users?${params}`);
  }

  // ยิงค้นหาเมื่อพิมพ์ครบ 3 ตัวอักษรเท่านั้น (debounce 400ms กันยิงทุกตัวอักษร)
  // ต่ำกว่านั้นถือว่าไม่ค้น → กลับไปแสดงรายการปกติ
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const trimmed = searchInput.trim();
    const nextSearch = trimmed.length >= MIN_SEARCH_LENGTH ? trimmed : "";
    if (nextSearch === search) return;
    const timer = setTimeout(() => goTo(1, limit, nextSearch), 400);
    return () => clearTimeout(timer);
  });

  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserRecord | null>(null);

  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["users", page, limit, isSearching ? search : ""],
    queryFn: () => (isSearching ? searchUsers(page, limit, search) : getUsers(page, limit)),
  });

  const users = data?.data ?? [];

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserData }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeletingUser(null);
    },
  });

  return (
    <div className="flex flex-col gap-8 py-10">
      <section className="flex flex-col gap-2">
        <h1 className="tracking-[-0.08em] uppercase">User_List</h1>
        <p className="text-foreground/60 text-sm">
          {data?.meta.total ?? 0} users — edit or delete from the actions column.
        </p>
      </section>

      <section className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email (min 3 characters)"
            className="border-foreground/20 bg-background focus:border-foreground w-full max-w-sm border-2 px-3 py-2 text-sm focus:outline-none"
          />
          {isSearching && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                goTo(1, limit, "");
              }}
              className="border-foreground/20 hover:border-foreground border-2 px-4 py-2 text-xs font-bold tracking-[0.06em] whitespace-nowrap uppercase transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {searchInput.trim().length > 0 && searchInput.trim().length < MIN_SEARCH_LENGTH && (
          <p className="text-foreground/50 text-xs">
            Type at least {MIN_SEARCH_LENGTH} characters to search.
          </p>
        )}
      </section>

      <section className="border-foreground/15 overflow-x-auto border-2">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-foreground/15 border-b-2 text-xs font-bold tracking-[0.2em] uppercase">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isPending && (
              <tr>
                <td colSpan={6} className="text-foreground/50 px-4 py-10 text-center">
                  Loading users...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-red-500">
                  Failed to load users: {error.message}
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr
                key={user.id}
                className="border-foreground/10 hover:bg-foreground/5 border-b last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {user.data.first_name} {user.data.last_name}
                    </span>
                  </div>
                </td>
                <td className="text-foreground/60 px-4 py-3">{user.data.email}</td>
                <td className="text-foreground/60 px-4 py-3">
                  {GENDER_LABEL[user.data.gender] ?? "-"}
                </td>
                <td className="text-foreground/60 px-4 py-3">{user.data.age}</td>
                <td className="text-foreground/60 px-4 py-3 whitespace-nowrap">
                  {dayjs(user.updated_at).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(user)}
                      className="border-foreground/20 hover:border-foreground border-2 px-3 py-1.5 text-xs font-bold tracking-[0.06em] uppercase transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingUser(user)}
                      className="border-2 border-red-500/40 px-3 py-1.5 text-xs font-bold tracking-[0.06em] text-red-500 uppercase transition-colors hover:border-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!isPending && !isError && users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-foreground/50 px-4 py-10 text-center">
                  {isSearching ? `No users match "${search}".` : "No users left."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="flex items-center justify-between gap-3">
        <label className="text-foreground/60 flex items-center gap-2 text-sm">
          Per page
          <select
            value={limit}
            onChange={(e) => goTo(1, Number(e.target.value))}
            className="border-foreground/20 bg-background focus:border-foreground border-2 px-3 py-2 text-sm focus:outline-none"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goTo(page - 1, limit)}
            className="border-foreground/20 hover:border-foreground border-2 px-4 py-2 text-xs font-bold tracking-[0.06em] uppercase transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-foreground/60 text-sm">
            Page {page} / {data?.meta.pages ?? "-"}
          </span>
          <button
            type="button"
            disabled={!data || page >= data.meta.pages}
            onClick={() => goTo(page + 1, limit)}
            className="border-foreground/20 hover:border-foreground border-2 px-4 py-2 text-xs font-bold tracking-[0.06em] uppercase transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </section>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          isSaving={updateMutation.isPending}
          onSave={(data) => updateMutation.mutate({ id: editingUser.id, data })}
          onClose={() => setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          isDeleting={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(deletingUser.id)}
          onClose={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}
