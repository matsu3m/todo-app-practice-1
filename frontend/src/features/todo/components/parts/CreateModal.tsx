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
  useToast,
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
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const createToDo = async (data: FormData) => {
    try {
      const response = await fetch("/api/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Response is not ok");
      }
      const newTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, newTodo]);
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

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <>
      <Button onClick={onOpen} height={10} marginRight={5}>
        ＋ 作成
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <form onSubmit={handleSubmit(createToDo)}>
            <ModalBody>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>
                  タイトル <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Input
                  {...register("title", {
                    required: "必須項目です",
                  })}
                />
                <FormErrorMessage>{errors.title?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <Spacer h={5} />

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>内容</FormLabel>
                <Textarea {...register("description")} />
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
              <HStack>
                <Button isLoading={isSubmitting} type="submit">
                  作成
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
