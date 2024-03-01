import { ToDo } from "@/src/features/todo/types";

export const getAllTodos = async (signal?: AbortSignal): Promise<ToDo[]> => {
  const response = await fetch("/api/todos/", { signal });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};
