export type ToDoStatus = "backlog" | "upcoming" | "inProgress" | "completed";

export type ToDo = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: ToDoStatus;
};
