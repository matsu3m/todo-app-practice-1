import { ToDo } from "@/src/features/todo/types";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CreateModal from "../parts/CreateModal";
import SearchBox from "../parts/SearchBox";
import ToDoBoard from "../parts/ToDoBoard";

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

      <ToDoBoard todos={filteredTodos} setTodos={setTodos} />
    </>
  );
};

export default ToDoPage;
