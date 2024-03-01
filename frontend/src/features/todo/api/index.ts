import { ToDo, ToDoCreate, ToDoUpdate } from "@/src/features/todo/types";

export const getAllTodos = async (signal?: AbortSignal): Promise<ToDo[]> => {
  const response = await fetch("/api/todos/", { signal });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};

export const createTodo = async (todo: ToDoCreate): Promise<ToDo> => {
  const response = await fetch("/api/todos/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};

export const updateTodo = async (todo: ToDoUpdate): Promise<ToDo> => {
  const response = await fetch(`/api/todos/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
};
