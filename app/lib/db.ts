import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

import type {
  LearningItem,
  LearningItemType,
  LearningStatus,
  Reminder,
  StudySession,
} from "./models";

const dbDir = path.join(process.cwd(), "data");
mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, "learning.db");
const db = new DatabaseSync(dbPath);

const defaultUserId = "default-user";

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS learning_items (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (
      type IN (
        'Course',
        'Book',
        'Tutorial',
        'Certification',
        'Webinar/Event',
        'Practice',
        'Other'
      )
    ),
    status TEXT NOT NULL CHECK (
      status IN (
        'Not started',
        'In progress',
        'Completed',
        'Paused',
        'Archived'
      )
    ),
    description TEXT,
    targetDate TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS study_sessions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    learningItemId TEXT NOT NULL,
    scheduledDate TEXT NOT NULL,
    durationMinutes INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
    notes TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (learningItemId) REFERENCES learning_items(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    learningItemId TEXT NOT NULL,
    title TEXT NOT NULL,
    reminderDate TEXT NOT NULL,
    link TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (learningItemId) REFERENCES learning_items(id) ON DELETE CASCADE
  );
`);

const userExists = db
  .prepare("SELECT 1 FROM users WHERE id = ?")
  .get(defaultUserId) as { 1: number } | undefined;

if (!userExists) {
  db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(
    defaultUserId,
    "Default User",
  );
}

export { db, defaultUserId };

export type CreateLearningItemInput = {
  title: string;
  type: LearningItemType;
  status: LearningStatus;
  description?: string;
  targetDate?: string;
};

export type CreateStudySessionInput = {
  learningItemId: string;
  scheduledDate: string;
  durationMinutes: number;
  completed?: boolean;
  notes?: string;
};

export type CreateReminderInput = {
  learningItemId: string;
  title: string;
  reminderDate: string;
  link?: string;
  notes?: string;
};

export function listLearningItems(): LearningItem[] {
  return db
    .prepare(
      "SELECT * FROM learning_items WHERE userId = ? ORDER BY updatedAt DESC",
    )
    .all(defaultUserId) as LearningItem[];
}

export function getLearningItemById(id: string): LearningItem | null {
  const item = db
    .prepare("SELECT * FROM learning_items WHERE id = ?")
    .get(id) as LearningItem | undefined;

  return item ?? null;
}

export function createLearningItem(
  input: CreateLearningItemInput,
): LearningItem {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  db.prepare(
    `
      INSERT INTO learning_items (
        id,
        userId,
        title,
        type,
        status,
        description,
        targetDate,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).run(
    id,
    defaultUserId,
    input.title,
    input.type,
    input.status,
    input.description ?? null,
    input.targetDate ?? null,
    now,
    now,
  );

  return db
    .prepare("SELECT * FROM learning_items WHERE id = ?")
    .get(id) as LearningItem;
}

export function updateLearningItem(
  id: string,
  updates: Partial<CreateLearningItemInput & { status: LearningStatus }>,
): LearningItem | null {
  const existing = db
    .prepare("SELECT * FROM learning_items WHERE id = ?")
    .get(id) as LearningItem | undefined;

  if (!existing) return null;

  const next = {
    title: updates.title ?? existing.title,
    type: updates.type ?? existing.type,
    status: updates.status ?? existing.status,
    description: updates.description ?? existing.description,
    targetDate: updates.targetDate ?? existing.targetDate,
  };

  const now = new Date().toISOString();

  db.prepare(
    `
      UPDATE learning_items
      SET title = ?, type = ?, status = ?, description = ?, targetDate = ?, updatedAt = ?
      WHERE id = ?
    `,
  ).run(
    next.title,
    next.type,
    next.status,
    next.description ?? null,
    next.targetDate ?? null,
    now,
    id,
  );

  return db
    .prepare("SELECT * FROM learning_items WHERE id = ?")
    .get(id) as LearningItem;
}

export function deleteLearningItem(id: string): boolean {
  const result = db.prepare("DELETE FROM learning_items WHERE id = ?").run(id);
  return (result.changes ?? 0) > 0;
}

export function listStudySessions(): StudySession[] {
  return db
    .prepare(
      "SELECT * FROM study_sessions WHERE userId = ? ORDER BY scheduledDate DESC",
    )
    .all(defaultUserId) as StudySession[];
}

export function createStudySession(
  input: CreateStudySessionInput,
): StudySession {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  db.prepare(
    `
      INSERT INTO study_sessions (
        id,
        userId,
        learningItemId,
        scheduledDate,
        durationMinutes,
        completed,
        notes,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).run(
    id,
    defaultUserId,
    input.learningItemId,
    input.scheduledDate,
    input.durationMinutes,
    input.completed ? 1 : 0,
    input.notes ?? null,
    now,
  );

  return db
    .prepare("SELECT * FROM study_sessions WHERE id = ?")
    .get(id) as StudySession;
}

export function listReminders(): Reminder[] {
  return db
    .prepare(
      "SELECT * FROM reminders WHERE userId = ? ORDER BY reminderDate ASC",
    )
    .all(defaultUserId) as Reminder[];
}

export function createReminder(input: CreateReminderInput): Reminder {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  db.prepare(
    `
      INSERT INTO reminders (
        id,
        userId,
        learningItemId,
        title,
        reminderDate,
        link,
        notes,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).run(
    id,
    defaultUserId,
    input.learningItemId,
    input.title,
    input.reminderDate,
    input.link ?? null,
    input.notes ?? null,
    now,
  );

  return db.prepare("SELECT * FROM reminders WHERE id = ?").get(id) as Reminder;
}

function ensureSeedData() {
  const existing = db
    .prepare("SELECT COUNT(*) as count FROM learning_items")
    .get() as { count: number };

  if (existing.count > 0) {
    return;
  }

  const item1 = createLearningItem({
    title: "Deep Learning Book",
    type: "Book",
    status: "In progress",
    description: "Finish the current reading plan and notes.",
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
  });

  const item2 = createLearningItem({
    title: "React Fundamentals",
    type: "Tutorial",
    status: "Not started",
    description: "Complete the practice exercises.",
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
  });

  const item3 = createLearningItem({
    title: "AWS Cloud Practitioner",
    type: "Certification",
    status: "Paused",
    description: "Review exam topics and practice questions.",
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  });

  createStudySession({
    learningItemId: item1.id,
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    durationMinutes: 45,
    completed: false,
    notes: "Read chapter 4 and summarize key points.",
  });

  createStudySession({
    learningItemId: item2.id,
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    durationMinutes: 60,
    completed: false,
    notes: "Build the sample component and test it.",
  });

  createReminder({
    learningItemId: item3.id,
    title: "Practice exam",
    reminderDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    link: "https://example.com/practice-exam",
    notes: "Attempt a timed set of 20 questions.",
  });
}

ensureSeedData();

export function getPlannerData() {
  const items = listLearningItems();
  const sessions = listStudySessions();
  const reminders = listReminders();

  return {
    items,
    sessions,
    reminders,
  };
}
