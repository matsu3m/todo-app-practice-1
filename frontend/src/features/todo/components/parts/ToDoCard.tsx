import { Card, CardBody, CardFooter, CardHeader, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ToDo } from "../../types";
import EditModal from "./EditModal";

type Props = {
  id: string;
  todo: ToDo;
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const ToDoCard = ({ id, todo, setTodos }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card
      cursor="pointer"
      marginBottom={3}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={onOpen}
    >
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

      <EditModal isOpen={isOpen} onClose={onClose} todo={todo} setTodos={setTodos} />
    </Card>
  );
};

export default ToDoCard;
