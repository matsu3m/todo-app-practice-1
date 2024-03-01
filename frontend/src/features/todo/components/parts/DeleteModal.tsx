import { deleteTodo } from "@/src/features/todo/api";
import { ToDo } from "@/src/features/todo/types";
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

type Props = {
  todoId: string;
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const DeleteModal = ({ todoId, setTodos }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await deleteTodo(todoId);
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
              <Button onClick={handleDelete}>削除</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteModal;
