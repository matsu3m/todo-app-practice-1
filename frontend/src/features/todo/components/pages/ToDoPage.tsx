import { getAllTodos } from "@/src/features/todo/api";
import CreateFormModal from "@/src/features/todo/components/parts/CreateFormModal";
import SearchBox from "@/src/features/todo/components/parts/SearchBox";
import ToDoBoard from "@/src/features/todo/components/parts/ToDoBoard";
import { ToDo } from "@/src/features/todo/types";
import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

const ToDoPage = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toast = useToast();

  const filteredTodos = useMemo(() => {
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [todos, searchQuery]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTodos = async () => {
      try {
        const data = await getAllTodos(abortController.signal);
        setTodos(data);
      } catch (e) {
        if (!(e instanceof DOMException)) {
          console.error(e);
          toast({
            title: "ToDo の取得に失敗しました",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    fetchTodos();

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
            <CreateFormModal setTodos={setTodos} />
            <SearchBox setSearchQuery={setSearchQuery} />
          </Flex>
        </Flex>

        <ToDoBoard todos={filteredTodos} setTodos={setTodos} />
      </Box>
    </Box>
  );
};

export default ToDoPage;
