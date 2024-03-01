import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import console from "console";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { todoStatuses } from "../../constants";
import { ToDo } from "../../types";
import DeleteModal from "./DeleteModal";

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
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const updateToDo = async (data: FormData) => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Response is not ok");
      }
      const updatedTodo = await response.json();
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
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
          <ModalHeader />
          <ModalCloseButton />
          <form onSubmit={handleSubmit(updateToDo)}>
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

              <Spacer h={5} />

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>内容</FormLabel>
                <Textarea defaultValue={todo.description} {...register("description")} />
                <FormErrorMessage>{errors.description?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <Spacer h={5} />

              <FormControl isInvalid={!!errors.dueDate}>
                <FormLabel>期日</FormLabel>
                <Input type="date" defaultValue={todo.dueDate} {...register("dueDate")} />
                <FormErrorMessage>{errors.dueDate?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <Spacer h={5} />

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
              <Flex justifyContent="space-between" width="100%">
                <DeleteModal todoId={todo.id} setTodos={setTodos} />
                <Button isLoading={isSubmitting} type="submit">
                  更新
                </Button>
              </Flex>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
