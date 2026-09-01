import { ItemForm } from "@/app/components/item-form";
import { ReminderForm } from "@/app/components/reminder-form";
import { SessionForm } from "@/app/components/session-form";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { getLearningItemById, getPlannerData } from "@/app/lib/db";

export default function Home({
  searchParams,
}: {
  searchParams?: { edit?: string };
}) {
  const { items, sessions, reminders } = getPlannerData();
  const editingId = searchParams?.edit ?? null;
  const editingItem = editingId ? getLearningItemById(editingId) : null;

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
            <a
              href="/?"
              className="rounded-lg px-4 py-2 text-sm font-medium transition"
              style={{
                backgroundColor: "var(--button)",
                color: "var(--button-text)",
              }}
            >
              + Quick add
            </a>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Items" value={String(items.length)} accent="bg-blue-100 text-blue-700" />
          <SummaryCard label="Completed" value={String(completedCount)} accent="bg-emerald-100 text-emerald-700" />
          <SummaryCard label="Sessions" value={String(sessions.length)} accent="bg-violet-100 text-violet-700" />
          <SummaryCard label="Reminders" value={String(reminders.length)} accent="bg-amber-100 text-amber-700" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming study sessions</h2>
              <span className="text-sm text-slate-500">Next 4</span>
            </div>

            <div className="space-y-3">
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-slate-500">No sessions scheduled yet.</p>
              ) : (
                upcomingSessions.map((session) => {
                  const item = items.find((entry) => entry.id === session.learningItemId);
                  return (
                    <div key={session.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{item?.title ?? "Learning item"}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(session.scheduledDate).toLocaleDateString()} · {session.durationMinutes} min
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            session.completed
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-violet-100 text-violet-700"
                          }`}
                        >
                          {session.completed ? "Done" : "Planned"}
                        </span>
                      </div>
                      {session.notes ? (
                        <p className="mt-2 text-sm text-slate-600">{session.notes}</p>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-xl font-semibold">Deadlines</h2>
            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-slate-500">No deadlines added yet.</p>
              ) : (
                upcomingDeadlines.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-800">{item.title}</p>
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.targetDate ? new Date(item.targetDate).toLocaleDateString() : "No target date"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Learning items</h2>
              <a href="/?" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                New item
              </a>
            </div>

            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-slate-500">No learning items yet.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="font-medium text-slate-800">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {item.status}
                      </span>
                      <a
                        href={`/?edit=${item.id}`}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
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
              />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-xl font-semibold">Add study session</h2>
              <SessionForm items={items.map(({ id, title }) => ({ id, title }))} />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-xl font-semibold">Add reminder</h2>
              <ReminderForm items={items.map(({ id, title }) => ({ id, title }))} />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-xl font-semibold">Reminders</h2>
              <div className="space-y-3">
                {reminders.length === 0 ? (
                  <p className="text-sm text-slate-500">No reminders yet.</p>
                ) : (
                  reminders.map((reminder) => (
                    <div key={reminder.id} className="rounded-xl border border-slate-200 p-3">
                      <p className="font-medium text-slate-800">{reminder.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(reminder.reminderDate).toLocaleDateString()}
                      </p>
                      {reminder.link ? (
                        <a href={reminder.link} className="mt-2 inline-block text-sm text-blue-600 hover:underline">
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
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${accent}`}>
        {label}
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
