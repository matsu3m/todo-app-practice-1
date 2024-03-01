export type ToDoStatus = "backlog" | "upcoming" | "inProgress" | "completed";

export const isToDoStatus = (value: string): value is ToDoStatus => {
  return value === "backlog" || value === "upcoming" || value === "inProgress" || value === "completed";
};

export type ToDo = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: ToDoStatus;
};

export type ToDoCreate = {
  title: string;
  description: string;
  dueDate: string;
  status: ToDoStatus;
};

export type ToDoUpdate = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: ToDoStatus;
};

export type ToDoFormInput = {
  title: string;
  description: string;
  dueDate: string;
  status: ToDoStatus;
};
