import { ToDo } from "../types";

export const getAllTodos = async (): Promise<{ success: true; data: ToDo[] } | { success: false }> => {
  try {
    const response = await fetch("/api/todos/");
    if (!response.ok) {
      throw new Error("Response was not ok");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};
