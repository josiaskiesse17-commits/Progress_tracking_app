"use client";

import { useState } from "react";

import { ItemForm } from "@/app/components/item-form";
import { ReminderForm } from "@/app/components/reminder-form";
import { SessionForm } from "@/app/components/session-form";
import { ThemeToggle } from "@/app/components/theme-toggle";
import type { LearningItem, Reminder, StudySession } from "@/app/lib/models";

export function PlannerClient({
  items,
  sessions,
  reminders,
}: {
  items: LearningItem[];
  sessions: StudySession[];
  reminders: Reminder[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingItem = items.find((item) => item.id === editingId) ?? null;

  const completedCount = items.filter((item) => item.status === "Completed").length;
  const upcomingSessions = [...sessions]
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime(),
    )
    .slice(0, 4);
  const upcomingDeadlines = [...items]
    .filter((item) => item.targetDate)
    .sort(
      (a, b) =>
        new Date(a.targetDate ?? 0).getTime() - new Date(b.targetDate ?? 0).getTime(),
    )
    .slice(0, 4);

  return (
    <main
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <header
          className="flex items-center justify-between gap-4 rounded-2xl p-6 shadow-sm ring-1"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "0 1px 3px var(--shadow)",
          }}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
              Learning planner
            </p>
            <h1 className="mt-2 text-3xl font-bold">This week</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium transition"
              style={{
                backgroundColor: "var(--button)",
                color: "var(--button-text)",
              }}
            >
              + Quick add
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Items" value={String(items.length)} accent="bg-blue-100 text-blue-700" />
          <SummaryCard label="Completed" value={String(completedCount)} accent="bg-emerald-100 text-emerald-700" />
          <SummaryCard label="Sessions" value={String(sessions.length)} accent="bg-violet-100 text-violet-700" />
          <SummaryCard label="Reminders" value={String(reminders.length)} accent="bg-amber-100 text-amber-700" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div
            className="rounded-2xl p-6 shadow-sm ring-1"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "0 1px 3px var(--shadow)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming study sessions</h2>
              <span style={{ color: "var(--muted)" }} className="text-sm">
                Next 4
              </span>
            </div>

            <div className="space-y-3">
              {upcomingSessions.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No sessions scheduled yet.
                </p>
              ) : (
                upcomingSessions.map((session) => {
                  const item = items.find((entry) => entry.id === session.learningItemId);
                  return (
                    <div
                      key={session.id}
                      className="rounded-xl border p-4"
                      style={{
                        backgroundColor: "var(--surface-soft)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold" style={{ color: "var(--foreground)" }}>
                            {item?.title ?? "Learning item"}
                          </p>
                          <p className="text-sm" style={{ color: "var(--muted)" }}>
                            {new Date(session.scheduledDate).toLocaleDateString()} · {session.durationMinutes} min
                          </p>
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: session.completed ? "rgba(16, 185, 129, 0.15)" : "rgba(168, 85, 247, 0.18)",
                            color: session.completed ? "#34d399" : "#c084fc",
                          }}
                        >
                          {session.completed ? "Done" : "Planned"}
                        </span>
                      </div>
                      {session.notes ? (
                        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                          {session.notes}
                        </p>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div
            className="rounded-2xl p-6 shadow-sm ring-1"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "0 1px 3px var(--shadow)",
            }}
          >
            <h2 className="mb-4 text-xl font-semibold">Deadlines</h2>
            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No deadlines added yet.
                </p>
              ) : (
                upcomingDeadlines.map((item) => (
                  <div key={item.id} className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium" style={{ color: "var(--foreground)" }}>{item.title}</p>
                      <span className="rounded-full px-2 py-1 text-xs font-medium" style={{ backgroundColor: "rgba(251, 191, 36, 0.14)", color: "#fbbf24" }}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                      {item.targetDate ? new Date(item.targetDate).toLocaleDateString() : "No target date"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            className="rounded-2xl p-6 shadow-sm ring-1"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "0 1px 3px var(--shadow)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Learning items</h2>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="text-sm font-medium"
                style={{ color: "var(--muted)" }}
              >
                New item
              </button>
            </div>

            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No learning items yet.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl border p-3"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-soft)" }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: "var(--foreground)" }}>{item.title}</p>
                      <p className="text-sm" style={{ color: "var(--muted)" }}>{item.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: "var(--subtle)", color: "var(--foreground)" }}>
                        {item.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingId(item.id)}
                        className="rounded-md border px-2 py-1 text-xs font-medium"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="rounded-2xl p-6 shadow-sm ring-1"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "0 1px 3px var(--shadow)",
              }}
            >
              <h2 className="mb-4 text-xl font-semibold">
                {editingItem ? "Edit learning item" : "Add learning item"}
              </h2>
              <ItemForm
                initialValues={
                  editingItem
                    ? {
                        id: editingItem.id,
                        title: editingItem.title,
                        type: editingItem.type,
                        status: editingItem.status,
                        description: editingItem.description,
                        targetDate: editingItem.targetDate,
                      }
                    : undefined
                }
                onSubmitted={() => setEditingId(null)}
              />
            </div>

            <div
              className="rounded-2xl p-6 shadow-sm ring-1"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "0 1px 3px var(--shadow)",
              }}
            >
              <h2 className="mb-4 text-xl font-semibold">Add study session</h2>
              <SessionForm items={items.map(({ id, title }) => ({ id, title }))} />
            </div>

            <div
              className="rounded-2xl p-6 shadow-sm ring-1"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "0 1px 3px var(--shadow)",
              }}
            >
              <h2 className="mb-4 text-xl font-semibold">Add reminder</h2>
              <ReminderForm items={items.map(({ id, title }) => ({ id, title }))} />
            </div>

            <div
              className="rounded-2xl p-6 shadow-sm ring-1"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "0 1px 3px var(--shadow)",
              }}
            >
              <h2 className="mb-4 text-xl font-semibold">Reminders</h2>
              <div className="space-y-3">
                {reminders.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    No reminders yet.
                  </p>
                ) : (
                  reminders.map((reminder) => (
                    <div key={reminder.id} className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                      <p className="font-medium" style={{ color: "var(--foreground)" }}>{reminder.title}</p>
                      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                        {new Date(reminder.reminderDate).toLocaleDateString()}
                      </p>
                      {reminder.link ? (
                        <a href={reminder.link} className="mt-2 inline-block text-sm" style={{ color: "#60a5fa" }}>
                          Open link
                        </a>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 shadow-sm ring-1"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "0 1px 3px var(--shadow)",
      }}
    >
      <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${accent}`}>
        {label}
      </div>
      <p className="mt-4 text-3xl font-bold" style={{ color: "var(--foreground)" }}>{value}</p>
    </div>
  );
}
