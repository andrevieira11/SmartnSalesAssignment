export type Status = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  owner: number;
  created_at: string;
  task_count: number;
}

export interface Task {
  id: number;
  project: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  due_date: string | null;
  assigned_to: number | null;
  assigned_to_detail: User | null;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DashboardData {
  total_projects: number;
  total_tasks: number;
  tasks_by_status: Record<Status, number>;
  overdue: number;
  due_this_week: number;
}

export const STATUSES: Status[] = ["TODO", "IN_PROGRESS", "DONE"];
export const STATUS_LABELS: Record<Status, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};
