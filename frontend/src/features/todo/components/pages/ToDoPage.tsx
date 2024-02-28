import ToDoLane from "@/src/features/todo/components/parts/ToDoLane";
import { todoStatuses } from "@/src/features/todo/constants";
import { ToDo } from "@/src/features/todo/types";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CreateModal from "../parts/CreateModal";

const ToDoPage = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("/api/todos/");
      const data = await response.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  return (
    <>
      <CreateModal setTodos={setTodos} />

      <Flex gap={6}>
        {Object.entries(todoStatuses).map(([statusId, statusDisplayName]) => (
          <ToDoLane
            key={statusId}
            statusId={statusId}
            statusDisplayName={statusDisplayName}
            todos={todos.filter((todo) => todo.status === statusId)}
            setTodos={setTodos}
          />
        ))}
      </Flex>
    </>
  );
};

export default ToDoPage;
