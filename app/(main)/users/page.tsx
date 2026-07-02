"use client";

import { useState } from "react";
import Image from "next/image";
import { TextField } from "@/components/input/text-field";
import { ModalShell } from "@/components/modal-shell";
import { MOCK_USERS } from "@/constraints/users.mock";
import { User } from "@/types/users";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // TODO: replace local state with reqres API (GET/PUT/DELETE /api/users)
  function handleSaveEdit(updated: User) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(null);
  }

  function handleConfirmDelete(id: number) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeletingUser(null);
  }

  return (
    <div className="flex flex-col gap-8 py-10">
      <section className="flex flex-col gap-2">
        <h1 className="tracking-[-0.08em] uppercase">User_List</h1>
        <p className="text-foreground/60 text-sm">
          {users.length} users — edit or delete from the actions column.
        </p>
      </section>

      <section className="border-foreground/15 overflow-x-auto border-2">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-foreground/15 border-b-2 text-xs font-bold tracking-[0.2em] uppercase">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-foreground/10 hover:bg-foreground/5 border-b last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.avatar}
                      alt={`${user.first_name} ${user.last_name}`}
                      width={36}
                      height={36}
                      className="border-foreground/15 border-2"
                    />
                    <span className="font-bold">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                </td>
                <td className="text-foreground/60 px-4 py-3">{user.email}</td>
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
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="text-foreground/50 px-4 py-10 text-center">
                  No users left.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSaveEdit}
          onClose={() => setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}

function EditUserModal({
  user,
  onSave,
  onClose,
}: {
  user: User;
  onSave: (updated: User) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(user);

  return (
    <ModalShell onClose={onClose}>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <h2 className="tracking-[-0.03em] uppercase">Edit_User</h2>

        <div className="flex flex-col gap-4">
          <TextField
            id="first_name"
            label="First name"
            value={form.first_name}
            required
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
          <TextField
            id="last_name"
            label="Last name"
            value={form.last_name}
            required
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border-foreground/20 hover:border-foreground flex-1 border-2 py-3 text-sm font-bold tracking-[0.06em] uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-foreground text-background hover:bg-foreground/80 flex-1 py-3 text-sm font-extrabold tracking-[0.06em] uppercase transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function DeleteUserModal({
  user,
  onConfirm,
  onClose,
}: {
  user: User;
  onConfirm: (id: number) => void;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex flex-col gap-6">
        <h2 className="tracking-[-0.03em] uppercase">Delete_User</h2>
        <p className="text-foreground/60 text-sm">
          Delete{" "}
          <span className="text-foreground font-bold">
            {user.first_name} {user.last_name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border-foreground/20 hover:border-foreground flex-1 border-2 py-3 text-sm font-bold tracking-[0.06em] uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(user.id)}
            className="flex-1 bg-red-500 py-3 text-sm font-extrabold tracking-[0.06em] text-white uppercase transition-colors hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
