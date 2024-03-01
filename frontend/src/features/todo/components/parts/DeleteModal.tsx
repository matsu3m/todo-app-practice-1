import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ToDo } from "../../types";

type Props = {
  todoId: string;
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const DeleteModal = ({ todoId, setTodos }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const deleteTodo = async () => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Response is not ok");
      }
      setTodos((prevTodos) => prevTodos.filter((prevTodo) => prevTodo.id !== todoId));
      onClose();
    } catch (e) {
      console.error(e);
      toast({
        title: "ToDo の削除に失敗しました",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <>
      <Button onClick={onOpen}>削除</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>削除してもよろしいですか？</ModalBody>

          <ModalFooter>
            <HStack>
              <Button onClick={deleteTodo}>削除</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteModal;
