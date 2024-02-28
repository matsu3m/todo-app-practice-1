import { ToDoStatus } from "@/src/features/todo/types";

export const todoStatuses: Record<ToDoStatus, string> = {
  backlog: "バックログ",
  upcoming: "着手予定",
  inProgress: "進行中",
  completed: "完了",
};
