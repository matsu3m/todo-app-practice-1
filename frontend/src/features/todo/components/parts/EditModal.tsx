import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { todoStatuses } from "../../constants";
import { ToDo } from "../../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  todo: ToDo;
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

type FormData = {
  title: string;
  description?: string;
  dueDate?: string;
  status: string;
};

const EditModal = ({ isOpen, onClose, todo, setTodos }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const createToDo = async (data: FormData) => {
    const response = await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const updatedTodo = await response.json();
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(createToDo)}>
            <ModalBody>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>
                  タイトル <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Input
                  defaultValue={todo.title}
                  {...register("title", {
                    required: "必須項目です",
                  })}
                />
                <FormErrorMessage>{errors.title?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <Spacer h={4} />

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>内容</FormLabel>
                <Textarea defaultValue={todo.description} {...register("description")} />
                <FormErrorMessage>{errors.description?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <Spacer h={4} />

              <FormControl isInvalid={!!errors.dueDate}>
                <FormLabel>期限</FormLabel>
                <Input type="date" defaultValue={todo.dueDate} {...register("dueDate")} />
                <FormErrorMessage>{errors.dueDate?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <Spacer h={4} />

              <FormControl isInvalid={!!errors.status}>
                <FormLabel>
                  ステータス <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Select
                  defaultValue={todo.status}
                  {...register("status", {
                    required: "必須項目です",
                  })}
                >
                  {Object.entries(todoStatuses).map(([statusId, statusDisplayName]) => (
                    <option key={statusId} value={statusId}>
                      {statusDisplayName}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.status?.message?.toString()}</FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <HStack spacing={3}>
                <Button isLoading={isSubmitting} type="submit">
                  更新
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
