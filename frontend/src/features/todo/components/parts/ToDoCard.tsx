import { Card, CardBody, CardFooter, CardHeader, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ToDo } from "../../types";
import EditFormModal from "./EditFormModal";

type Props = {
  id: string;
  todo: ToDo;
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const ToDoCard = ({ id, todo, setTodos }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: id });
  const style = { transform: CSS.Transform.toString(transform) };

  return (
    <>
      <Card
        cursor="pointer"
        marginBottom={5}
        padding={3}
        onClick={onOpen}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
      >
        <CardHeader padding={2}>
          <Heading size="sm">{todo.title}</Heading>
        </CardHeader>

        {todo.description && (
          <CardBody padding={2}>
            <Text>{todo.description}</Text>
          </CardBody>
        )}

        {todo.dueDate && (
          <CardFooter padding={2}>
            <Text fontSize="sm">{todo.dueDate}</Text>
          </CardFooter>
        )}
      </Card>

      <EditFormModal isOpen={isOpen} onClose={onClose} todo={todo} setTodos={setTodos} />
    </>
  );
};

export default ToDoCard;
