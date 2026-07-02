"use client";

import { useState } from "react";
import { TextField } from "@/components/input/text-field";
import { ModalShell } from "@/components/modal-shell";
import { GENDERS } from "@/constraints/gender.data";
import { UserData, UserRecord } from "@/types/users";

export function EditUserModal({
  user,
  isSaving,
  onSave,
  onClose,
}: {
  user: UserRecord;
  isSaving: boolean;
  onSave: (data: UserData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<UserData>(user.data);

  return (
    <ModalShell size="lg" onClose={onClose}>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <h2 className="tracking-[-0.03em] uppercase">Edit_User</h2>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <TextField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="gender"
                className="text-foreground mb-2 block text-xs font-bold tracking-[0.2em] uppercase"
              >
                Gender
              </label>
              <select
                id="gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: Number(e.target.value) })}
                className="border-foreground/20 bg-background focus:border-foreground h-14 w-full border-2 px-3.5 text-sm focus:outline-none"
              >
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <TextField
              id="age"
              label="Age"
              type="number"
              min={1}
              max={120}
              value={form.age}
              required
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
            />
          </div>
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
            disabled={isSaving}
            className="bg-foreground text-background hover:bg-foreground/80 flex-1 py-3 text-sm font-extrabold tracking-[0.06em] uppercase transition-colors disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function DeleteUserModal({
  user,
  isDeleting,
  onConfirm,
  onClose,
}: {
  user: UserRecord;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex flex-col gap-6">
        <h2 className="tracking-[-0.03em] uppercase">Delete_User</h2>
        <p className="text-foreground/60 text-sm">
          Delete{" "}
          <span className="text-foreground font-bold">
            {user.data.first_name} {user.data.last_name}
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
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex-1 bg-red-500 py-3 text-sm font-extrabold tracking-[0.06em] text-white uppercase transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
