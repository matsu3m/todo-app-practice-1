import { ToDo } from "@/src/features/todo/types";
import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CreateModal from "../parts/CreateModal";
import SearchBox from "../parts/SearchBox";
import ToDoBoard from "../parts/ToDoBoard";

const ToDoPage = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ToDo[]>([]);

  const toast = useToast();

  useEffect(() => {
    const abortController = new AbortController();

    const getAllTodos = async () => {
      try {
        const response = await fetch("/api/todos/", { signal: abortController.signal });
        if (!response.ok) {
          throw new Error("Response is not ok");
        }
        const data: ToDo[] = await response.json();
        setTodos(data);
      } catch (e) {
        console.error(e);
        toast({
          title: "ToDo の取得に失敗しました",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    getAllTodos();

    return () => {
      abortController.abort();
    };
  }, [toast]);

  return (
    <Box width="100%">
      <Box width="70%" margin="auto">
        <Flex alignItems="center" width="100%" justifyContent="space-between" marginTop={3} marginBottom={10}>
          <Heading as="h1" size="2xl">
            ToDo APP
          </Heading>
          <Flex>
            <CreateModal setTodos={setTodos} />
            <SearchBox todos={todos} setFilteredTodos={setFilteredTodos} />
          </Flex>
        </Flex>

        <ToDoBoard todos={filteredTodos} setTodos={setTodos} />
      </Box>
    </Box>
  );
};

export default ToDoPage;
