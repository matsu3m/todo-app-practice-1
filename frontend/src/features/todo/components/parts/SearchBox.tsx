import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input } from "@chakra-ui/react";

type Props = {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};
const SearchBox = ({ setSearchQuery }: Props) => {
  return (
    <Flex alignItems="center" height={10} padding={2} gap={2} borderRadius={8} borderColor="gray.100" borderWidth={1}>
      <SearchIcon />
      <Input placeholder="キーワード検索" onChange={(e) => setSearchQuery(e.target.value)} variant="unstyled" />
    </Flex>
  );
};

export default SearchBox;
