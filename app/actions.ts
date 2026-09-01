"use server";

import { revalidatePath } from "next/cache";

import {
  createLearningItem,
  createReminder,
  createStudySession,
  deleteLearningItem,
  updateLearningItem,
} from "./lib/db";
import { LEARNING_ITEM_TYPES, LEARNING_STATUSES } from "./lib/models";

export async function createItem(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "Course");
  const status = String(formData.get("status") ?? "Not started");
  const description = String(formData.get("description") ?? "").trim();
  const targetDate = String(formData.get("targetDate") ?? "");

  if (!title) {
    return;
  }

  createLearningItem({
    title,
    type: LEARNING_ITEM_TYPES.includes(type as any)
      ? (type as any)
      : "Course",
    status: LEARNING_STATUSES.includes(status as any)
      ? (status as any)
      : "Not started",
    description: description || undefined,
    targetDate: targetDate || undefined,
  });

  revalidatePath("/");
}

export async function updateItem(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "Course");
  const status = String(formData.get("status") ?? "Not started");
  const description = String(formData.get("description") ?? "").trim();
  const targetDate = String(formData.get("targetDate") ?? "");

  if (!id || !title) {
    return;
  }

  updateLearningItem(id, {
    title,
    type: LEARNING_ITEM_TYPES.includes(type as any)
      ? (type as any)
      : "Course",
    status: LEARNING_STATUSES.includes(status as any)
      ? (status as any)
      : "Not started",
    description: description || undefined,
    targetDate: targetDate || undefined,
  });

  revalidatePath("/");
}

export async function deleteItem(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  deleteLearningItem(id);
  revalidatePath("/");
}

export async function createSession(formData: FormData) {
  const learningItemId = String(formData.get("learningItemId") ?? "");
  const scheduledDate = String(formData.get("scheduledDate") ?? "");
  const durationMinutes = Number(formData.get("durationMinutes") ?? 0);
  const notes = String(formData.get("notes") ?? "").trim();
  const completed = String(formData.get("completed") ?? "false") === "true";

  if (!learningItemId || !scheduledDate || durationMinutes <= 0) {
    return;
  }

  createStudySession({
    learningItemId,
    scheduledDate,
    durationMinutes,
    completed,
    notes: notes || undefined,
  });

  revalidatePath("/");
}

export async function createReminderAction(formData: FormData) {
  const learningItemId = String(formData.get("learningItemId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const reminderDate = String(formData.get("reminderDate") ?? "");
  const link = String(formData.get("link") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!learningItemId || !title || !reminderDate) {
    return;
  }

  createReminder({
    learningItemId,
    title,
    reminderDate,
    link: link || undefined,
    notes: notes || undefined,
  });

  revalidatePath("/");
}
