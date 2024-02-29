import ToDoLane from "@/src/features/todo/components/parts/ToDoLane";
import { todoStatuses } from "@/src/features/todo/constants";
import { ToDo } from "@/src/features/todo/types";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CreateModal from "../parts/CreateModal";
import SearchBox from "../parts/SearchBox";

const ToDoPage = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ToDo[]>([]);

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
      <Flex>
        <CreateModal setTodos={setTodos} />
        <SearchBox todos={todos} setFilteredTodos={setFilteredTodos} />
      </Flex>

      <Flex gap={6}>
        {Object.entries(todoStatuses).map(([statusId, statusDisplayName]) => (
          <ToDoLane
            key={statusId}
            statusId={statusId}
            statusDisplayName={statusDisplayName}
            todos={filteredTodos.filter((todo) => todo.status === statusId)}
            setTodos={setTodos}
          />
        ))}
      </Flex>
    </>
  );
};

export default ToDoPage;
