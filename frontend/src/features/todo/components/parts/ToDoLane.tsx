import ToDoCard from "@/src/features/todo/components/parts/ToDoCard";
import { ToDo } from "@/src/features/todo/types";
import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";

type Props = {
  statusId: string;
  statusDisplayName: string;
  todos: ToDo[];
  setTodos: React.Dispatch<React.SetStateAction<ToDo[]>>;
};

const ToDoLane = ({ statusId, statusDisplayName, todos, setTodos }: Props) => {
  return (
    <Card id={statusId} backgroundColor="gray.50">
      <CardHeader>
        <Heading size="sm">{statusDisplayName}</Heading>
      </CardHeader>

      <CardBody>
        {todos.map((todo) => (
          <ToDoCard key={todo.id} todo={todo} setTodos={setTodos} />
        ))}
      </CardBody>
    </Card>
  );
};

export default ToDoLane;
