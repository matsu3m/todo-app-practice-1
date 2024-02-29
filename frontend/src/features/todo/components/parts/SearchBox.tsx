import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ToDo } from "../../types";

type Props = {
  todos: ToDo[];
  setFilteredTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const SearchBox = ({ todos, setFilteredTodos }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const filterTodos = () => {
      const filtered = todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredTodos(filtered);
    };
    filterTodos();
  }, [searchQuery, todos, setFilteredTodos]);

  return (
    <Flex alignItems="center" marginBottom={6} padding={2} gap={2} border="gray.100" borderWidth={1}>
      <SearchIcon />
      <Input
        placeholder="Search for todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="unstyled"
      />
    </Flex>
  );
};

export default SearchBox;
