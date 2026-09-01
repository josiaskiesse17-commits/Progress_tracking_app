"use client";

import { useState } from "react";

import { createItem, deleteItem, updateItem } from "@/app/actions";
import { LEARNING_ITEM_TYPES, LEARNING_STATUSES } from "@/app/lib/models";

export function ItemForm({
  initialValues,
  onSubmitted,
}: {
  initialValues?: {
    id?: string;
    title?: string;
    type?: string;
    status?: string;
    description?: string;
    targetDate?: string;
  };
  onSubmitted?: () => void;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [type, setType] = useState(initialValues?.type ?? "Course");
  const [status, setStatus] = useState(initialValues?.status ?? "Not started");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [targetDate, setTargetDate] = useState(initialValues?.targetDate ?? "");

  const isEditing = Boolean(initialValues?.id);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (isEditing) {
      await updateItem(formData);
      onSubmitted?.();
      return;
    }

    await createItem(formData);
    setTitle("");
    setDescription("");
    setTargetDate("");
    setType("Course");
    setStatus("Not started");
    onSubmitted?.();
  };

  return (
    <div
      className="space-y-4 rounded-2xl p-5 shadow-sm ring-1"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "0 1px 3px var(--shadow)",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
            Title
          </label>
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none ring-0 transition"
            style={{
              backgroundColor: "var(--input)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            placeholder="e.g. Japanese grammar sprint"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
              Type
            </label>
            <select
              name="type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none"
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              {LEARNING_ITEM_TYPES.map((itemType) => (
                <option key={itemType} value={itemType}>
                  {itemType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
              Status
            </label>
            <select
              name="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none"
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              {LEARNING_STATUSES.map((itemStatus) => (
                <option key={itemStatus} value={itemStatus}>
                  {itemStatus}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full rounded-lg border px-3 py-2 outline-none"
            style={{
              backgroundColor: "var(--input)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            placeholder="Optional notes or goals"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
            Target date
          </label>
          <input
            name="targetDate"
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none"
            style={{
              backgroundColor: "var(--input)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {initialValues?.id ? <input type="hidden" name="id" value={initialValues.id} /> : null}

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg px-4 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: "var(--button)",
              color: "var(--button-text)",
            }}
          >
            {isEditing ? "Save changes" : "Add item"}
          </button>
        </div>
      </form>

      {isEditing ? (
        <form action={deleteItem} className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <input type="hidden" name="id" value={initialValues?.id} />
          <button
            type="submit"
            className="rounded-lg border px-4 py-2 text-sm font-medium transition"
            style={{
              borderColor: "#fca5a5",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              color: "#ef4444",
            }}
          >
            Delete item
          </button>
        </form>
      ) : null}
    </div>
  );
}
