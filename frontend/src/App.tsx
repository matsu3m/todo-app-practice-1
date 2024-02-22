import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  status: "pending" | "completed";
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  return (
    <>
      <Heading>ToDo app</Heading>
      {todos.map((todo) => (
        <div key={todo.id}>
          <h2>{todo.title}</h2>
          <p>{todo.content}</p>
          <p>{todo.dueDate}</p>
          <p>{todo.status}</p>
        </div>
      ))}
    </>
  );
};

export default App;
