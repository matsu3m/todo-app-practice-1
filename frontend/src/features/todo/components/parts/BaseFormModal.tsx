import { todoStatuses } from "@/src/features/todo/constants";
import { ToDo, ToDoFormInput } from "@/src/features/todo/types";
import {
  Box,
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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import DeleteModal from "./DeleteModal";

type Props = {
  todo?: ToDo;
  setTodos?: React.Dispatch<React.SetStateAction<ToDo[]>>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ToDoFormInput) => Promise<void>;
  isSubmitting: boolean;
};

const TodoFormModal = ({ todo, setTodos, isOpen, onClose, onSubmit, isSubmitting }: Props) => {
  const defaultValues = todo
    ? {
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        status: todo.status,
      }
    : undefined;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ToDoFormInput>({ defaultValues });

  useEffect(() => {
    if (isOpen) {
      reset(todo);
    }
  }, [isOpen, todo, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>
                タイトル <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Input
                {...register("title", {
                  required: "必須項目です",
                  maxLength: { value: 100, message: "100文字以内で入力してください" },
                })}
              />
              <FormErrorMessage>{errors.title?.message?.toString()}</FormErrorMessage>
            </FormControl>

            <Spacer h={5} />

            <FormControl isInvalid={!!errors.description}>
              <FormLabel>内容</FormLabel>
              <Textarea
                {...register("description", { maxLength: { value: 1000, message: "1000文字以内で入力してください" } })}
              />
              <FormErrorMessage>{errors.description?.message?.toString()}</FormErrorMessage>
            </FormControl>

            <Spacer h={5} />

            <FormControl isInvalid={!!errors.dueDate}>
              <FormLabel>期日</FormLabel>
              <Input type="date" {...register("dueDate")} />
              <FormErrorMessage>{errors.dueDate?.message?.toString()}</FormErrorMessage>
            </FormControl>

            <Spacer h={5} />

            <FormControl isInvalid={!!errors.status}>
              <FormLabel>
                ステータス <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Select {...register("status")}>
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
            <Flex width="100%" justifyContent="space-between">
              {todo && setTodos ? <DeleteModal todoId={todo.id} setTodos={setTodos} /> : <Box />}
              <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
                {todo ? "更新" : "作成"}
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TodoFormModal;
