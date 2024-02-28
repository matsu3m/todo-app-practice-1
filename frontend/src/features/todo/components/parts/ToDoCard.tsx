import { ToDo } from "@/src/features/todo/types";
import { Card, CardBody, CardFooter, CardHeader, Heading, Text, useDisclosure } from "@chakra-ui/react";
import EditModal from "./EditModal";

type Props = {
  todo: ToDo;
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const ToDoCard = ({ todo, setTodos }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card cursor="pointer" marginBottom={3} onClick={onOpen}>
        <CardHeader>
          <Heading size="sm">{todo.title}</Heading>
        </CardHeader>

        {todo.description && (
          <CardBody>
            <Text>{todo.description}</Text>
          </CardBody>
        )}

        {todo.dueDate && (
          <CardFooter>
            <Text>{todo.dueDate}</Text>
          </CardFooter>
        )}
      </Card>

      <EditModal isOpen={isOpen} onClose={onClose} todo={todo} setTodos={setTodos} />
    </>
  );
};

export default ToDoCard;
