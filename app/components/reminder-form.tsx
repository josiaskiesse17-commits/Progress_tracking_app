"use client";

import { useState } from "react";

import { createReminderAction } from "@/app/actions";

export function ReminderForm({ items }: { items: { id: string; title: string }[] }) {
  const [learningItemId, setLearningItemId] = useState(items[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [reminderDate, setReminderDate] = useState(new Date().toISOString().slice(0, 10));
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    await createReminderAction(formData);

    setTitle("");
    setLink("");
    setNotes("");
    setReminderDate(new Date().toISOString().slice(0, 10));
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        Add a learning item first so you can attach a reminder to it.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl p-5 shadow-sm ring-1"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "0 1px 3px var(--shadow)",
      }}
    >
      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
          Learning item
        </label>
        <select
          name="learningItemId"
          value={learningItemId}
          onChange={(event) => setLearningItemId(event.target.value)}
          className="w-full rounded-lg border px-3 py-2 outline-none"
          style={{
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
          Reminder title
        </label>
        <input
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-lg border px-3 py-2 outline-none"
          style={{
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
          placeholder="e.g. Practice quiz"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
          Date
        </label>
        <input
          name="reminderDate"
          type="date"
          value={reminderDate}
          onChange={(event) => setReminderDate(event.target.value)}
          className="w-full rounded-lg border px-3 py-2 outline-none"
          style={{
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
          Optional link
        </label>
        <input
          name="link"
          type="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          className="w-full rounded-lg border px-3 py-2 outline-none"
          style={{
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
          Notes
        </label>
        <textarea
          name="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="w-full rounded-lg border px-3 py-2 outline-none"
          style={{
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
          placeholder="What should you remember?"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg px-4 py-2 text-sm font-medium transition"
        style={{
          backgroundColor: "var(--button)",
          color: "var(--button-text)",
        }}
      >
        Add reminder
      </button>
    </form>
  );
}
