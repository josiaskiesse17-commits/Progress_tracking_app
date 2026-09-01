export type LearningItemType =
  | "Course"
  | "Book"
  | "Tutorial"
  | "Certification"
  | "Webinar/Event"
  | "Practice"
  | "Other";

export type LearningStatus =
  | "Not started"
  | "In progress"
  | "Completed"
  | "Paused"
  | "Archived";

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

export interface LearningItem {
  id: string;
  userId: string;
  title: string;
  type: LearningItemType;
  status: LearningStatus;
  description?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  learningItemId: string;
  scheduledDate: string;
  durationMinutes: number;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  learningItemId: string;
  title: string;
  reminderDate: string;
  link?: string;
  notes?: string;
  createdAt: string;
}

export const LEARNING_ITEM_TYPES: LearningItemType[] = [
  "Course",
  "Book",
  "Tutorial",
  "Certification",
  "Webinar/Event",
  "Practice",
  "Other",
];

export const LEARNING_STATUSES: LearningStatus[] = [
  "Not started",
  "In progress",
  "Completed",
  "Paused",
  "Archived",
];
