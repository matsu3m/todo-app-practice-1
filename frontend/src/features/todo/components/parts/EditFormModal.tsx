import { updateTodo } from "@/src/features/todo/api";
import BaseFormModal from "@/src/features/todo/components/parts/BaseFormModal";
import { ToDo, ToDoFormInput } from "@/src/features/todo/types";
import { useToast } from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  todo: ToDo;
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const EditModal = ({ isOpen, onClose, todo, setTodos }: Props) => {
  const toast = useToast();

  const handleUpdate = async (data: ToDoFormInput) => {
    try {
      const updatedTodo = await updateTodo({
        ...data,
        id: todo.id,
      });
      setTodos((prevTodos) => prevTodos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
      onClose();
    } catch (e) {
      console.error(e);
      toast({
        title: "ToDo の更新に失敗しました",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <BaseFormModal
        todo={todo}
        setTodos={setTodos}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleUpdate}
        defaultValues={todo}
        isSubmitting={false}
      />
    </>
  );
};

export default EditModal;
