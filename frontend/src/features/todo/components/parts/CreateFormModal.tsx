import { Button, useDisclosure, useToast } from "@chakra-ui/react";
import { createTodo } from "../../api";
import { ToDo, ToDoFormInput } from "../../types";
import BaseFormModal from "./BaseFormModal";

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const CreateModal = ({ setTodos }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleCreate = async (data: ToDoFormInput) => {
    try {
      const createdTodo = await createTodo(data);
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
      onClose();
    } catch (e) {
      console.error(e);
      toast({
        title: "ToDo の作成に失敗しました",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen} height={10} marginRight={5}>
        ＋ 作成
      </Button>

      <BaseFormModal isOpen={isOpen} onClose={onClose} onSubmit={handleCreate} isSubmitting={false} />
    </>
  );
};

export default CreateModal;
