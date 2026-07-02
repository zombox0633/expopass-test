"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GENDER_LABEL } from "@/constraints/gender.data";
import { UserData, UserRecord } from "@/types/users";
import { deleteUser, getUsers, updateUser } from "./service";
import { DeleteUserModal, EditUserModal } from "./actions";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserRecord | null>(null);

  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsers(page),
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
                  {dayjs(user.updated_at).format("DD MMM YYYY HH:mm")}
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
                  No users left.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
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
          onClick={() => setPage((p) => p + 1)}
          className="border-foreground/20 hover:border-foreground border-2 px-4 py-2 text-xs font-bold tracking-[0.06em] uppercase transition-colors disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
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
