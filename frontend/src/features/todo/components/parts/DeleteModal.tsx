import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { ToDo } from "../../types";

type Props = {
  todoId: string;
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const DeleteModal = ({ todoId, setTodos }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteTodo = async () => {
    await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });

    setTodos((prevTodos) => prevTodos.filter((prevTodo) => prevTodo.id !== todoId));
    onClose();
  };

  return (
    <>
      <IconButton aria-label="Delete ToDo" variant="outline" color="red" icon={<DeleteIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>削除してもよろしいですか？</ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button onClick={deleteTodo}>削除</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteModal;
