"use client";

import { useState } from "react";

import { createSession } from "@/app/actions";

export function SessionForm({ items }: { items: { id: string; title: string }[] }) {
  const [learningItemId, setLearningItemId] = useState(items[0]?.id ?? "");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    await createSession(formData);

    setScheduledDate(new Date().toISOString().slice(0, 10));
    setDurationMinutes(45);
    setNotes("");
    setCompleted(false);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        Add a learning item first so you can schedule a study session.
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

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" style={{ color: "var(--muted)" }}>
            Date
          </label>
          <input
            name="scheduledDate"
            type="date"
            value={scheduledDate}
            onChange={(event) => setScheduledDate(event.target.value)}
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
            Duration (minutes)
          </label>
          <input
            name="durationMinutes"
            type="number"
            min={15}
            step={15}
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(Number(event.target.value) || 15)}
            className="w-full rounded-lg border px-3 py-2 outline-none"
            style={{
              backgroundColor: "var(--input)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            required
          />
        </div>
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
          placeholder="What will you focus on?"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
        <input
          name="completed"
          type="checkbox"
          value="true"
          checked={completed}
          onChange={(event) => setCompleted(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
        />
        Mark as completed
      </label>

      <button
        type="submit"
        className="rounded-lg px-4 py-2 text-sm font-medium transition"
        style={{
          backgroundColor: "var(--button)",
          color: "var(--button-text)",
        }}
      >
        Add session
      </button>
    </form>
  );
}
