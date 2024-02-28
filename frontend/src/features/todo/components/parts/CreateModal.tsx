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
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { todoStatuses } from "../../constants";
import { ToDo } from "../../types";

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

type FormData = {
  title: string;
  description?: string;
  dueDate?: string;
  status: string;
};

const CreateModal = ({ setTodos }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const createToDo = async (data: FormData) => {
    const response = await fetch("/api/todos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const newTodo = await response.json();
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <>
      <Button onClick={onOpen}>＋ 追加</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ToDo の作成</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(createToDo)}>
            <ModalBody>
              <FormControl isRequired isInvalid={!!errors.title}>
                <FormLabel>タイトル</FormLabel>
                <Input
                  {...register("title", {
                    required: "必須項目です",
                  })}
                />
                <FormErrorMessage>{errors.title?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <Spacer h={4} />

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>内容</FormLabel>
                <Textarea {...register("description")} />
                <FormErrorMessage>{errors.description?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <Spacer h={4} />

              <FormControl isInvalid={!!errors.dueDate}>
                <FormLabel>期限</FormLabel>
                <Input type="date" {...register("dueDate")} />
                <FormErrorMessage>{errors.dueDate?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <Spacer h={4} />

              <FormControl isRequired isInvalid={!!errors.status}>
                <FormLabel>ステータス</FormLabel>
                <Select
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
                  タスクを作成
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateModal;
